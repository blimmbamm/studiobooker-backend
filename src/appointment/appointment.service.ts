import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, In, Not, Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as timezone from 'dayjs/plugin/timezone';

import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { Company } from 'src/company/entities/company.entity';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { PersonnelService } from 'src/personnel/personnel.service';
import { Personnel } from 'src/personnel/entities/personnel.entity';
import { AvailableSlotsQueryDto } from './dto/available-slots-query.dto';
import { ServiceService } from 'src/service/service.service';
import {
  AppointmentSlot,
  AvailableAppointmentSlots,
} from './dto/available-slots.dto';
import { CalendarDay } from './dto/calendar-day.dto';
import { DummyAppointment } from './types/dummy-appointment';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { EmailService } from '../email/email.service';
import { CompanyInfoService } from '../company-info/company-info.service';

dayjs.extend(isSameOrBefore);
dayjs.extend(timezone);

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly companyInfoService: CompanyInfoService,
    private readonly personnelService: PersonnelService,
    private readonly serviceService: ServiceService,
    private readonly emailService: EmailService,
  ) {}

  async findAvailableSlots(
    company: Company,
    availableSlotsQueryDto: AvailableSlotsQueryDto,
  ) {
    const { start, serviceId, staffId } = availableSlotsQueryDto;

    const service = await this.serviceService.findOneByPersonnel(
      company,
      serviceId,
      staffId,
    );

    const timezone = await this.companyInfoService.getTimezone(company);

    const end = dayjs(start).add(5, 'days').subtract(1, 'millisecond').toDate();

    const appointments = await this._findMany(company, {
      from: start,
      to: end,
      timezone,
      staff: [staffId],
    });

    // TODO: In fact, service.duration can be null, this is wrong in the entity
    return this._findAvailableSlots(
      appointments,
      service.personnel!,
      service.duration,
      10,
      timezone,
    );
  }

  private _findAvailableSlots(
    data: CalendarDay[],
    staff: Personnel[],
    serviceDuration: number, // e.g. 60
    slotStep: number = 5, // e.g. 5-minute grid
    timezone: string,
  ): AvailableAppointmentSlots[] {
    const weekdayMap = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const results: AvailableAppointmentSlots[] = [];

    for (const { date, staffWithAppointments } of data) {
      const day = dayjs(date);

      const dayNumber = day.tz(timezone).day();

      const weekday = weekdayMap[dayNumber];

      const slotMap = new Map<string, Set<number>>(); // key: ISO string, value: Set of staffIds

      for (const staffMember of staff) {
        const workingTime = staffMember.workingTimes?.find(
          (wt) => wt.weekday === weekday && wt.activated,
        );
        if (!workingTime) continue;

        const [startHour, startMinutes] = workingTime.start.split(':');
        const [endHour, endMinutes] = workingTime.end.split(':');
        const dayStart = dayjs(date)
          .set('hours', +startHour)
          .set('minutes', +startMinutes)
          .toDate();
        const dayEnd = dayjs(date)
          .set('hours', +endHour)
          .set('minutes', +endMinutes)
          .toDate();

        const appointmentRanges =
          staffWithAppointments
            .find((s) => s.id === staffMember.id)
            ?.appointments.map((app) => {
              const start = app.start;
              const end = new Date(start.getTime() + app.duration * 60_000);
              return [start, end];
            }) || [];

        for (
          let slot = new Date(dayStart);
          slot.getTime() + serviceDuration * 60_000 <= dayEnd.getTime();
          slot.setMinutes(slot.getMinutes() + slotStep)
        ) {
          const slotEnd = new Date(slot.getTime() + serviceDuration * 60_000);

          const overlaps = appointmentRanges.some(
            ([aStart, aEnd]) => slot < aEnd && slotEnd > aStart,
          );

          if (!overlaps) {
            const isoKey = slot.toISOString();
            if (!slotMap.has(isoKey)) {
              slotMap.set(isoKey, new Set());
            }
            slotMap.get(isoKey)!.add(staffMember.id);
          }
        }
      }

      const slots: AppointmentSlot[] = Array.from(slotMap.entries()).map(
        ([iso, staffIds]) => ({
          date: new Date(iso),
          staffIds: Array.from(staffIds),
        }),
      );

      results.push({ day, slots });
    }

    return results;
  }

  private async _findMany(
    company: Company,
    query: {
      from: Date;
      to: Date;
      timezone: string;
      staff: number[];
      includeCancelledAppointments?: boolean;
    },
  ) {
    const { staff, from, to, includeCancelledAppointments } = query;

    const statusFilter: FindOptionsWhere<Appointment> =
      includeCancelledAppointments
        ? {}
        : { status: Not(AppointmentStatus.CANCELLED) };

    const appointments = await this.appointmentRepository.find({
      where: {
        company,
        personnel: { id: In(staff) },
        start: Between(from, to),
        ...statusFilter,
      },
      relations: {
        personnel: true,
      },
    });

    // Transform to target shape:
    const groupedByDay: Record<
      string,
      Record<number, { staff: Personnel; appointments: Appointment[] }>
    > = {};

    const start = dayjs(from);
    const end = dayjs(to);

    for (let i = 0; start.add(i, 'day').isSameOrBefore(end); i++) {
      const currentDay = start.add(i, 'day').toISOString();
      groupedByDay[currentDay] = {};
    }

    const timezone = query.timezone;

    for (const row of appointments) {
      const dayKey = dayjs.tz(row.start, timezone).startOf('day').toISOString();

      if (!groupedByDay[dayKey][row.personnel!.id]) {
        groupedByDay[dayKey][row.personnel!.id] = {
          staff: row.personnel!,
          appointments: [],
        };
      }

      groupedByDay[dayKey][row.personnel!.id].staff = row.personnel!;
      groupedByDay[dayKey][row.personnel!.id].appointments.push(row);
    }

    const calendarDays: CalendarDay[] = Object.entries(groupedByDay).map(
      ([dateStr, staffMap]) => ({
        date: dateStr,
        staffWithAppointments: Object.entries(staffMap).map(
          ([_staffId, { staff, appointments }]) => ({
            ...staff,
            appointments,
          }),
        ),
      }),
    );

    return calendarDays;
  }

  async findMany(company: Company, appointmentQueryDto: AppointmentQueryDto) {
    const { staff, from, to, includeCancelledAppointments } =
      appointmentQueryDto;

    const timezone = await this.companyInfoService.getTimezone(company);

    const fromDate = dayjs.tz(from, 'YYYYMMDD', timezone).startOf('day');
    const toDate = dayjs.tz(to, 'YYYYMMDD', timezone).endOf('day');

    return this._findMany(company, {
      from: fromDate.toDate(),
      to: toDate.toDate(),
      timezone,
      staff,
      includeCancelledAppointments,
    });
  }

  async createAppointment(
    company: Company,
    createAppointmentDto: CreateAppointmentDto,
  ) {
    const { serviceId, staffId, ...rest } = createAppointmentDto;

    const personnel =
      await this.personnelService.findByIdOrThrowNotFoundException(
        company,
        staffId,
      );

    const service = await this.serviceService.findOneOrThrowNotFoundException(
      company,
      { where: { id: serviceId }, relations: { personnel: true } },
    );

    // BadRequest if personnel is not part of the service's personnel
    if (!service.personnel?.map((p) => p.id).includes(personnel.id)) {
      throw new BadRequestException();
    }

    const appointment = this.appointmentRepository.create({
      ...rest,
      personnel,
      service,
      company,
    });

    await this.appointmentRepository.save(appointment);

    return plainToInstance(Appointment, appointment);
  }

  async updateAppointment(
    company: Company,
    id: number,
    dto: UpdateAppointmentDto,
  ) {
    const appointment = await this.appointmentRepository.findOne({
      where: { company, id },
      relations: { personnel: true },
    });

    if (!appointment) throw new NotFoundException();

    const updatedAppointment: Appointment = {
      ...appointment,
      ...dto,
    };

    return this.appointmentRepository.save(updatedAppointment);
  }

  async cancelAppointment(company: Company, id: number) {
    const appointment = await this.updateAppointment(company, id, {
      status: AppointmentStatus.CANCELLED,
    });

    if (appointment.customerEmail) {
      await this.emailService.sendEmail(
        appointment.customerEmail,
        'Cancellation of your appointment',
        `
        We're very sorry, but we had to cancel your appointment.`,
      );
    }

    return appointment;
  }

  async confirmAppointment(company: Company, id: number) {
    const appointment = await this.updateAppointment(company, id, {
      status: AppointmentStatus.CONFIRMED,
    });

    if (appointment.customerEmail) {
      await this.emailService.sendEmail(
        appointment.customerEmail,
        'Confirmation',
        `Your appointment was confirmed, see you soon!`,
      );
    }

    return appointment;
  }

  async seedAppointments(company: Company) {
    const personnelNames = ['Geraldine', 'Marvin', 'Lucia'];

    const personnelMap = new Map<string, Personnel>();

    await Promise.all(
      personnelNames.map(async (name) => {
        const personnel = await this.personnelService.getByNameOrCreate(
          company,
          { name },
        );
        personnelMap.set(name, personnel);
      }),
    );

    const appointments = this.appointmentRepository.create(
      this.generateDummyAppointments(20, personnelNames).map(
        ({ personnelName, ...a }) => ({
          ...a,
          company,
          personnel: personnelMap.get(personnelName),
        }),
      ),
    );

    return this.appointmentRepository.save(appointments);
  }

  generateDummyAppointments(
    totalAppointments: number,
    personnel: string[],
  ): DummyAppointment[] {
    const appointments: DummyAppointment[] = [];

    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0); // strip time for consistency

    const appointmentsPerPerson: Record<
      string,
      Record<number, DummyAppointment[]> // dayOffset -> appointments[]
    > = {};

    for (const person of personnel) {
      appointmentsPerPerson[person] = {};
    }

    let titleIndex = 1;

    while (appointments.length < totalAppointments) {
      for (const person of personnel) {
        if (appointments.length >= totalAppointments) break;

        const dayOffset = Math.floor(Math.random() * 7) - 3;
        const dayStart = new Date(
          baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000,
        );
        dayStart.setHours(8, 0, 0, 0); // 08:00 start time

        const personDayAppointments =
          appointmentsPerPerson[person][dayOffset] || [];

        // determine next available slot on that day
        let startTime = new Date(dayStart);
        if (personDayAppointments.length > 0) {
          const last = personDayAppointments[personDayAppointments.length - 1];
          startTime = new Date(last.start.getTime() + last.duration * 60_000);
        }

        // pick a random duration (15–180 min, multiple of 15)
        const duration = Math.floor(Math.random() * 12 + 1) * 15;
        const endTime = new Date(startTime.getTime() + duration * 60_000);

        // skip if this appointment would go past 18:00
        if (endTime.getHours() >= 18) continue;

        const appointment: DummyAppointment = {
          start: startTime,
          confirmed: false,
          duration,
          personnelName: person,
          title: `Appointment ${titleIndex++}`,
        };

        appointments.push(appointment);

        // update person's day-specific appointments
        if (!appointmentsPerPerson[person][dayOffset]) {
          appointmentsPerPerson[person][dayOffset] = [];
        }

        appointmentsPerPerson[person][dayOffset].push(appointment);
      }
    }

    return appointments;
  }
}
