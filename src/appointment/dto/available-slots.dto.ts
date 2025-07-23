import * as dayjs from 'dayjs';

export type AppointmentSlot = {
  date: Date;
  staffIds: number[];
};

export type AvailableAppointmentSlots = {
  day: dayjs.Dayjs;
  slots: AppointmentSlot[];
};
