import { Personnel } from 'src/personnel/entities/personnel.entity';
import { Appointment } from '../entities/appointment.entity';

export type CalendarDay = {
  date: string;
  staffWithAppointments: (Personnel & {
    appointments: Appointment[];
  })[];
};
