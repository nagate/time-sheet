"use client";
import { Divider, List } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import NumberListItem from "@/components/molecules/listItems/numberListItem";
import dayjs, { Dayjs } from "dayjs";
import TimeListItem from "@/components/molecules/listItems/timeListItem";
import { Settings, db } from "@/app/indexedDB/timeSheetAppDB";

const INDEX = {
  HOURLY_PAY: 1,
  BREAK_TIME: 2,
  START_WORK_TIME: 3,
  END_WORK_TIME: 4,
};

export default function SettingsListPage() {
  // 現時点では固定
  const SETTING_ID = 1;
  const [settingId, setSettingId] = useState(SETTING_ID);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hourlyPay, setHourlyPay] = useState<number>(850);
  const [breakTime, setBreakTime] = useState<number>(60);
  const [startWorkTime, setStartWorkTime] = useState<Dayjs | null>(
    dayjs().hour(9).minute(0)
  );
  const [endWorkTime, setEndWorkTime] = useState<Dayjs | null>(
    dayjs().hour(18).minute(0)
  );

  useEffect(() => {
    // 以下の対応
    // 「ストリクトモード」で実行すると、安全でない副作用を洗い出すために、React は意図的にコンポーネントを二重レンダリングします。
    // https://github.com/reactwg/react-18/discussions/19
    let _isFirst = false;

    // 設定情報を取得
    // TODO: サービス側に実装を移行する
    (async () => {
      const _s = await db.settings.get(settingId);
      if (_s) {
        // すでに作成済みの場合は実行させない
        setHourlyPay(_s.hourlyPay);
        setBreakTime(_s.breakTime);
        setStartWorkTime(dayjs(_s.startWorkTime));
        setEndWorkTime(dayjs(_s.endWorkTime));
        return;
      } else {
        // 存在しない場合はデータを作成

        // 2回目以降は実行させない
        if (_isFirst) return;

        // 初期値を設定
        const _id = await db.settings.add({
          hourlyPay: 850,
          breakTime: 60,
          startWorkTime: dayjs().hour(9).minute(0).toDate(),
          endWorkTime: dayjs().hour(18).minute(0).toDate(),
          localUpdatedAt: new Date(),
        });
        setSettingId(_id);
      }
    })();

    return () => {
      _isFirst = true;
    };
  }, [settingId]);

  const updateSettingsIndexedDB = async (values: Settings) => {
    try {
      // TODO: サービス側に実装を移行する
      // TODO: 値に変更がなければ、更新させない
      await db.settings.update(settingId, {
        ...values,
        localUpdatedAt: new Date(),
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // 設定項目共通
  const handleClickSetting = (index: number) => {
    setSelectedIndex(index);
  };

  // 時給
  const handleCloseHourlyPay = async (value: number) => {
    await updateSettingsIndexedDB({
      hourlyPay: value,
      breakTime,
      startWorkTime: startWorkTime?.toDate() ?? null,
      endWorkTime: endWorkTime?.toDate() ?? null,
    });
    setHourlyPay(value);
  };

  // 休憩時間
  const handleCloseBreakTime = async (value: number) => {
    await updateSettingsIndexedDB({
      hourlyPay,
      breakTime: value,
      startWorkTime: startWorkTime?.toDate() ?? null,
      endWorkTime: endWorkTime?.toDate() ?? null,
    });
    setBreakTime(value);
  };

  // 出勤時間
  const handleOkStartWorkTime = async (value: Dayjs | null) => {
    await updateSettingsIndexedDB({
      hourlyPay,
      breakTime,
      startWorkTime: value?.toDate() ?? null,
      endWorkTime: endWorkTime?.toDate() ?? null,
    });
    setStartWorkTime(value);
  };

  // 退勤時間
  const handleOkEndWorkTime = async (value: Dayjs | null) => {
    await updateSettingsIndexedDB({
      hourlyPay,
      breakTime,
      startWorkTime: startWorkTime?.toDate() ?? null,
      endWorkTime: value?.toDate() ?? null,
    });
    setEndWorkTime(value);
  };

  return (
    <>
      <List component="nav" aria-label="main mailbox folders">
        <NumberListItem
          name={"hourlyPay"}
          title={"時給"}
          value={hourlyPay}
          unitName={"円"}
          selected={selectedIndex === INDEX.HOURLY_PAY}
          onClick={() => {
            handleClickSetting(INDEX.HOURLY_PAY);
          }}
          onClickOk={handleCloseHourlyPay}
        ></NumberListItem>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folder">
        <TimeListItem
          name={"startWorkTime"}
          title={"出勤時間"}
          value={startWorkTime}
          selected={selectedIndex === INDEX.START_WORK_TIME}
          onClick={() => {
            handleClickSetting(INDEX.START_WORK_TIME);
          }}
          onClickOk={handleOkStartWorkTime}
        ></TimeListItem>
        <TimeListItem
          name={"endWorkTime"}
          title={"退勤時間"}
          value={endWorkTime}
          selected={selectedIndex === INDEX.END_WORK_TIME}
          onClick={() => {
            handleClickSetting(INDEX.END_WORK_TIME);
          }}
          onClickOk={handleOkEndWorkTime}
        ></TimeListItem>
        <NumberListItem
          name={"breakTime"}
          title={"休憩時間"}
          value={breakTime}
          unitName={"分"}
          selected={selectedIndex === INDEX.BREAK_TIME}
          onClick={() => {
            handleClickSetting(INDEX.BREAK_TIME);
          }}
          onClickOk={handleCloseBreakTime}
        ></NumberListItem>
      </List>
    </>
  );
}
