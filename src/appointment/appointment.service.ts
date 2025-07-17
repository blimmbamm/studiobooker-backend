import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Between, In, Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { PersonnelService } from 'src/personnel/personnel.service';
import { Personnel } from 'src/personnel/entities/personnel.entity';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly personnelService: PersonnelService,
  ) {}

  async findMany(company: Company, appointmentQueryDto: AppointmentQueryDto) {
    const { staff, from, to } = appointmentQueryDto;

    const appointments = await this.appointmentRepository.find({
      where: {
        company,
        personnel: { id: In(staff) },
        start: Between(from, to),
      },
      relations: { personnel: true },
    });

    console.log(appointments)

    // Transform to target shape:
    const groupedByDay: Record<
      string,
      Record<number, { staff: Personnel; appointments: ResponseAppointment[] }>
    > = {};

    const start = dayjs(from).utc();
    const end = dayjs(to).utc();

    for (let i = 0; start.add(i, 'day').isSameOrBefore(end, 'day'); i++) {
      const currentDay = start.add(i, 'day').format('YYYY-MM-DD');
      groupedByDay[currentDay] = {};
    }

    for (const row of appointments) {
      const start = dayjs(row.start).utc();
      const dayKey = start.format('YYYY-MM-DD');
      // const startNum = start.hour() * 60 + start.minute(); // This is wrong, startNum should be computed in client because it depends on client locale

      const { personnel, ...rest } = row;

      const appt: ResponseAppointment = {
        ...rest,
        start,
        // startNum,
      };

      if (!groupedByDay[dayKey][row.personnel!.id]) {
        groupedByDay[dayKey][row.personnel!.id] = {
          staff: row.personnel!,
          appointments: [],
        };
      }

      groupedByDay[dayKey][row.personnel!.id].staff = row.personnel!;
      groupedByDay[dayKey][row.personnel!.id].appointments.push(appt);
    }

    const calendarDays: CalendarDay[] = Object.entries(groupedByDay).map(
      ([dateStr, staffMap]) => ({
        date: dateStr, // maybe this should be converted back to dayjs
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
      generateDummyAppointments(20, personnelNames).map(
        ({ personnelName, ...a }) => ({
          ...a,
          company,
          personnel: personnelMap.get(personnelName),
        }),
      ),
    );

    return this.appointmentRepository.save(appointments);
  }
}

type CalendarDay = {
  date: string;
  staffWithAppointments: (Personnel & {
    appointments: ResponseAppointment[];
  })[];
};

type ResponseAppointment = {
  id: number;
  start: dayjs.Dayjs;
  duration: number;
  // startNum: number;
};

type DummyAppointment = {
  start: Date;
  confirmed: boolean;
  duration: number; // in minutes
  personnelName: string;
  title: string;
};

function generateDummyAppointments(
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
