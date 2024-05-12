import { CONSTANTS } from "@/constants/constants";
import { TimeSheets, db } from "@/indexedDB/timeSheetAppDB";
import datetimeUtil from "@/utils/datetime";
import dayjs from "dayjs";

export class TimeSheetimeSheetService {
  /**
   * 指定した月のタイムシートデータを取得
   *
   * @param targetMonth 月
   * @returns タイムシート
   */
  static async getTargetMonthTimeSheets(
    targetMonth: dayjs.Dayjs
  ): Promise<TimeSheets[] | undefined> {
    return await db.timeSheets
      .where("yearMonth")
      .equals(targetMonth.format(CONSTANTS.TIME_SHEET_KEY1_FORMAT))
      .toArray();
  }

  /**
   * 指定した月のタイムシートデータを作成
   *
   * @param targetMonth 月
   * @returns 成功/失敗
   */
  static async createMonthTimeSheets(
    targetMonth: dayjs.Dayjs
  ): Promise<boolean> {
    // 既存レコードを確認
    const _record = (await this.getTargetMonthTimeSheets(targetMonth)) ?? [];
    if (_record?.length > 0) {
      // すでにレコードが存在する場合は作成しない
      return false;
    }

    const _strTargeYaerMonth = targetMonth.format(
      CONSTANTS.TIME_SHEET_KEY1_FORMAT
    );
    const _targetYear = Number(targetMonth.format("YYYY"));
    const _targetMonth = Number(targetMonth.format("MM")) - 1;

    // 存在しない場合はデータを作成
    const countDays = datetimeUtil.getDaysInMonth(_targetYear, _targetMonth);

    const dates: TimeSheets[] = [];
    const now = new Date();
    for (let i = 0; i < countDays; i++) {
      const _id = dayjs()
        .year(_targetYear)
        .month(_targetMonth)
        .date(i + 1)
        .format(CONSTANTS.TIME_SHEET_ID_FORMAT);

      dates.push({
        id: _id,
        yearMonth: _strTargeYaerMonth,
        breakTime: 0,
        startWorkTime: null,
        endWorkTime: null,
        localUpdatedAt: now,
      });
    }

    await db.timeSheets.bulkAdd(dates);
    return true;
  }
}
