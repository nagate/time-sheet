import { CONSTANTS } from "@/constants/constants";
import { TimeSheets, db } from "@/indexedDB/timeSheetAppDB";
import datetimeUtil from "@/utils/datetime";
import dayjs from "dayjs";

export class TimeSheetimeSheetService {
  /**
   * 指定した日のタイムシートデータを取得
   *
   * @param id 日
   * @returns タイムシート
   */
  static async getTimeSheetById(id: string): Promise<TimeSheets | undefined> {
    return await db.timeSheets.where("id").equals(id).first();
  }

  /**
   * 指定した月のタイムシートデータを取得
   *
   * @param targetMonth 月
   * @returns タイムシート
   */
  static async getTimeSheetsByMonth(
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
  static async createTimeSheetsByMonth(
    targetMonth: dayjs.Dayjs
  ): Promise<boolean> {
    return this._transaction(async () => {
      // 既存レコードを確認
      const _record = (await this.getTimeSheetsByMonth(targetMonth)) ?? [];
      if (_record?.length > 0) {
        // すでにレコードが存在する場合は作成しない
        return false;
      }

      const _strTargeYaerMonth = targetMonth.format(
        CONSTANTS.TIME_SHEET_KEY1_FORMAT
      );
      const _targetYear = Number(targetMonth.format("YYYY"));
      const _targetMonth = Number(targetMonth.format("MM"));

      // 存在しない場合はデータを作成
      const countDays = datetimeUtil.getDaysInMonth(_targetYear, _targetMonth);

      const dates: TimeSheets[] = [];
      const now = new Date();
      for (let i = 0; i < countDays; i++) {
        const _id = dayjs()
          .year(_targetYear)
          .month(_targetMonth - 1)
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
    });
  }

  /**
   * タイムシートデータの更新
   *
   * @param values タイムシート
   * @returns 成功/失敗
   */
  static async updateTimeSheet(values: TimeSheets): Promise<boolean> {
    return this._transaction(async () => {
      await db.timeSheets.put({
        ...values,
        localUpdatedAt: new Date(),
      });

      return true;
    });
  }

  /**
   * タイムシートデータの論理削除
   *
   * @param id 日
   * @returns 成功/失敗
   */
  static async logicalDelete(id: string): Promise<boolean> {
    return this._transaction(async () => {
      const _record = await this.getTimeSheetById(id);
      if (_record === undefined) return false;

      return this.updateTimeSheet({
        ..._record,
        startWorkTime: null,
        endWorkTime: null,
        breakTime: 0,
      });
    });
  }

  /**
   * トランザクション
   *
   * @param func 処理
   * @returns
   */
  private static async _transaction<T>(func: () => Promise<T>): Promise<T> {
    try {
      return await db.transaction("rw", db.timeSheets, func);
    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }
  }
}
