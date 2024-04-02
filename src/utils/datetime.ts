import dayjs from "dayjs";

// インターフェース：DatetimeUtil
export interface DatetimeUtil {
  // 現在の年月日を取得する
  getToday(): string;
  // 現在の時刻を取得する
  getCurrentTime(): string;
  //
  subtractTime(startTime?: Date | null, endTime?: Date | null): number;
  // 日付に日数を加算する
  addDays(date: Date, days: number): Date;
  // 日付から日数を減算する
  subtractDays(date: Date, days: number): Date;
  // 日付に月数を加算する
  addMonths(date: Date, months: number): Date;
  // 日付から月数を減算する
  subtractMonths(date: Date, months: number): Date;
  // 日付に年数を加算する
  addYears(date: Date, years: number): Date;
  // 日付から年数を減算する
  subtractYears(date: Date, years: number): Date;
  // 秒を切り捨て
  truncateSeconds(date: Date): Date;
  //
  getFormattedDatetime({
    date,
    format,
    zeroFilled,
  }: {
    date: Date;
    format: string;
    zeroFilled?: boolean;
  }): string;
  // 日付をフォーマットして文字列に変換する
  getFormattedDate(date: Date): string;
  // 時刻をフォーマットして文字列に変換する
  getFormattedTime(date: Date): string;
  createMonthDates(year: number, month: number): Date[];
}

const WEEKS = ["日", "月", "火", "水", "木", "金", "土"];

// DatetimeUtilの実装
const datetimeUtil = {
  // 現在の年月日を取得する
  getToday(): string {
    const now = new Date();
    return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
  },

  // 現在の時刻を取得する
  getCurrentTime(): string {
    const now = new Date();
    return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  },
  //
  subtractTime(startTime?: Date | null, endTime?: Date | null): number {
    if (!startTime || !endTime) return 0;
    return endTime.getTime() - startTime.getTime();
  },

  // 日付に日数を加算する
  addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    // 日付に日数を加算
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  },

  // 日付から日数を減算する
  subtractDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    // 日付から日数を減算
    newDate.setDate(newDate.getDate() - days);
    return newDate;
  },

  // 日付に月数を加算する
  addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    // 日付に月数を加算
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  },

  // 日付から月数を減算する
  subtractMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    // 日付から月数を減算
    newDate.setMonth(newDate.getMonth() - months);
    return newDate;
  },

  // 日付に年数を加算する
  addYears(date: Date, years: number): Date {
    const newDate = new Date(date);
    // 日付に年数を加算
    newDate.setFullYear(newDate.getFullYear() + years);
    return newDate;
  },

  // 日付から年数を減算する
  subtractYears(date: Date, years: number): Date {
    const newDate = new Date(date);
    // 日付から年数を減算
    newDate.setFullYear(newDate.getFullYear() - years);
    return newDate;
  },

  //
  getFormattedDatetime({
    date = new Date(),
    format = "yyyyMMddHHmmssSSS",
    zeroFilled = true,
  }: {
    date: Date;
    format: string;
    zeroFilled: boolean;
  }): string {
    const zeroFill = zeroFilled ? "0" : "";
    let fm = format;
    fm = fm.replace(/yyyy/g, `${date.getFullYear()}`);
    fm = fm.replace(/MM/g, `${(zeroFill + (date.getMonth() + 1)).slice(-2)}`);
    fm = fm.replace(/dd/g, `${(zeroFill + date.getDate()).slice(-2)}`);
    fm = fm.replace(/HH/g, `${(zeroFill + date.getHours()).slice(-2)}`);
    fm = fm.replace(/mm/g, `${(zeroFill + date.getMinutes()).slice(-2)}`);
    fm = fm.replace(/ss/g, `${(zeroFill + date.getSeconds()).slice(-2)}`);
    fm = fm.replace(
      /SSS/g,
      `${((zeroFilled ? "00" : "") + date.getMilliseconds()).slice(-3)}`
    );
    fm = fm.replace(/aaa/g, WEEKS[date.getDay()]);
    return fm;
  },

  truncateSeconds(date: Date): Date {
    const newDate = new Date(date.getTime());
    newDate.setSeconds(0, 0);
    return newDate;
  },

  // 日付をフォーマットして文字列に変換する
  getFormattedDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    // 日付をフォーマット
    return date.toLocaleDateString("ja-JP", options);
  },

  // 時刻をフォーマットして文字列に変換する
  getFormattedTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    // 時刻をフォーマット
    return date.toLocaleTimeString("ja-JP", options);
  },
  createMonthDates(year: number, month: number): Date[] {
    const startDate = new Date(year, month - 1, 1);
    const countDays = datetimeUtil.getDaysInMonth(year, month);

    const dates: Date[] = [];
    for (let i = 0; i < countDays; i++) {
      dates.push(
        new Date(startDate.getFullYear(), startDate.getMonth(), i + 1)
      );
    }
    return dates;
  },
  // Get the number of days in the month.
  getDaysInMonth(year: number, month: number): number {
    if (!(1 <= month || month <= 12)) {
      // TODO:
      // throw new Exception();
    }
    return dayjs()
      .year(year)
      .month(month - 1)
      .daysInMonth();
  },
};

// デフォルトエクスポート
export default datetimeUtil;
