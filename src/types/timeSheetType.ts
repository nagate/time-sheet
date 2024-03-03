export type TimeSheet = {
  id: string;
  date: Date;
  year?: string;
  month?: string;
  yearMonth?: string;
  day?: string;
  startTime?: Date;
  endTime?: Date;
  breakTime: number;
};
