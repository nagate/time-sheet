export class NumberUtil {
  /**
   * 数値を2桁の文字列に変換します。
   *
   * @param num 数値
   * @returns 2桁の文字列
   */
  static toTwoDigits(num: number): string {
    // 絶対値を取得
    const absNum = Math.abs(num);
    const str = absNum.toString();
    // TODO: 2桁以上の場合の考慮
    return str.length === 1 ? (num < 0 ? "-0" : "0") + str : str;
  }

  /**
   * 数値を3桁の文字列に変換します。
   *
   * @param num 数値
   * @returns 3桁の文字列
   */
  static toThreeDigits(num: number): string {
    const str = num.toString();
    return str.length === 1 ? `00${str}` : str.length === 2 ? `0${str}` : str;
  }

  /**
   * 数値をカンマ区切りでフォーマットします。
   *
   * @param num 数値
   * @returns カンマ区切りの文字列
   */
  static toCommaSeparatedString(num: number): string {
    return num.toLocaleString();
  }

  /**
   * 数値を小数点第2位までフォーマットします。
   *
   * @param num 数値
   * @returns 小数点第2位までの文字列
   */
  static toFixed(num: number): string {
    return num.toFixed(2);
  }

  /**
   * 数値が正数かどうかを判定します。
   *
   * @param num 数値
   * @returns true: 正数, false: 負数または0
   */
  static isPositive(num: number): boolean {
    return num > 0;
  }

  /**
   * 数値が負数かどうかを判定します。
   *
   * @param num 数値
   * @returns true: 負数, false: 正数または0
   */
  static isNegative(num: number): boolean {
    return num < 0;
  }

  /**
   * 数値が整数かどうかを判定します。
   *
   * @param num 数値
   * @returns true: 整数, false: 小数
   */
  static isInteger(num: number): boolean {
    return Number.isInteger(num);
  }

  /**
   * 数値の範囲を判定します。
   *
   * @param num 数値
   * @param min 最小値
   * @param max 最大値
   * @returns true: 範囲内, false: 範囲外
   */
  static isInRange(num: number, min: number, max: number): boolean {
    return num >= min && num <= max;
  }

  /**
   * 数値を最大値に制限します。
   *
   * @param num 数値
   * @param max 最大値
   * @returns 最大値以下の数値
   */
  static clamp(num: number, max: number): number {
    return Math.min(num, max);
  }

  /**
   * 数値を最小値に制限します。
   *
   * @param num 数値
   * @param min 最小値
   * @returns 最小値以上の数値
   */
  static floor(num: number, min: number): number {
    return Math.max(num, min);
  }

  /**
   * 数値を四捨五入します。
   *
   * @param num 数値
   * @returns 四捨五入された数値
   */
  static round(num: number): number {
    return Math.round(num);
  }

  /**
   * 数値を小数点以下切り捨てます。
   *
   * @param num 数値
   * @returns 小数点以下切り捨てられた数値
   */
  static truncate(num: number): number {
    return Math.floor(num);
  }

  /**
   * 数値をランダムに生成します。
   *
   * @param min 最小値
   * @param max 最大値
   * @returns ランダムな数値
   */
  static random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
