"use client";

import Stamping from "@/components/atoms/stampings/stamping";
import datetimeUtil from "@/utils/datetime";
import { NumberUtil } from "@/utils/numburUtil";
import { Delete, TimeToLeave, Work } from "@mui/icons-material";
import { Box, Button, TextField, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Settings, TimeSheets, db } from "../indexedDB/timeSheetAppDB";
import { useLiveQuery } from "dexie-react-hooks";
import dayjs from "dayjs";

const TodayBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const DateBox = styled(Box)({
  fontSize: 30,
});

const TimeBox = styled(Box)({
  fontSize: 50,
});

const StyledStamping = styled(Stamping)({
  // TODO: 効かない?
  margin: 16,
  padding: 16,
});

const Margin8Box = styled(Box)({
  margin: 8,
});

// 就業時間を計算（分）
const getWorkTimesM = ({
  endTime,
  startTime,
  breakTime,
}: {
  endTime: Date | null | undefined;
  startTime: Date | null | undefined;
  breakTime: number | undefined;
}): number => {
  // 出勤日未入力の場合
  if (!startTime) return 0;

  // 秒は切り捨て、分単位で計算
  const s = datetimeUtil.truncateSeconds(startTime);
  // 退勤日未入力の場合、現在日時で計算
  const e = datetimeUtil.truncateSeconds(endTime ?? new Date());

  // マイナスを考慮に入れる→マイナスの場合は0にする
  let diffTime = datetimeUtil.subtractTime(s, e);
  diffTime = diffTime < 0 ? 0 : diffTime / (1000 * 60) - (breakTime ?? 0);
  const diffMinutes = NumberUtil.truncate(diffTime);
  // 出勤時間がマイナスの場合
  if (diffMinutes < 0) return 0;

  return diffMinutes;
};

// 就業時間を計算
const getWorkTImes = ({
  endTime,
  startTime,
  breakTime,
}: {
  endTime: Date | null;
  startTime: Date | null;
  breakTime: number;
}): string => {
  if (!startTime) {
    // 出勤日未入力の場合
    return INIT_WORK_TIMES;
  }

  // 秒は切り捨て、分単位で計算
  const s = datetimeUtil.truncateSeconds(startTime);
  // 退勤日未入力の場合、現在日時で計算
  const e = datetimeUtil.truncateSeconds(endTime ?? new Date());

  // マイナスを考慮に入れる→マイナスの場合は0にする
  let diffTime = datetimeUtil.subtractTime(s, e);
  diffTime = diffTime < 0 ? 0 : diffTime / (1000 * 60) - breakTime;
  const diffMinutes = NumberUtil.truncate(diffTime);

  if (diffMinutes < 0) {
    // 出勤時間がマイナスの場合
    return INIT_WORK_TIMES;
  }
  const hours = NumberUtil.truncate(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  // 2桁の文字列に変換
  const formattedHours = NumberUtil.toTwoDigits(hours);
  const formattedMinutes = NumberUtil.toTwoDigits(minutes);

  return `${formattedHours}:${formattedMinutes}`;
};

const INIT_BREAK_TIME = 0;
const INIT_WORK_TIMES = "00:00";
// 現時点では固定
const SETTING_ID = 1;

export default function HomePage() {
  const [id, setId] = useState<Date>(dayjs().startOf("day").toDate());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [workTime, setWorkTime] = useState<string>(INIT_WORK_TIMES);

  const thisYear = useRef<string>(
    datetimeUtil.getFormattedDatetime({
      date: new Date(),
      format: "yyyy",
      zeroFilled: true,
    })
  );
  const thisMonth = useRef<string>(
    datetimeUtil.getFormattedDatetime({
      date: new Date(),
      format: "MM",
      zeroFilled: true,
    })
  );

  const timeSheets: TimeSheets | undefined = useLiveQuery(async () => {
    return await db.timeSheets.where("id").equals(id).first();
  }, [id]);

  const settings: Settings | undefined = useLiveQuery(async () => {
    return await db.settings.get(SETTING_ID);
  }, []);

  useEffect(() => {
    // 1秒おきに日付を更新
    const intervalTime = 1000;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, intervalTime);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const et = timeSheets?.endWorkTime || currentTime;
    setWorkTime(
      getWorkTImes({
        endTime: et,
        startTime: timeSheets?.startWorkTime ?? null,
        breakTime: timeSheets?.breakTime ?? INIT_BREAK_TIME,
      })
    );
  }, [
    timeSheets?.endWorkTime,
    currentTime,
    timeSheets?.breakTime,
    timeSheets?.startWorkTime,
  ]);

  useEffect(() => {
    // 情報を取得
    // TODO: サービス側に実装を移行する
    // TODO: トランザクションを貼る
    (async () => {
      let data = await db.timeSheets.where("id").equals(id).first();
      // すでに作成済みの場合は実行させない
      if (data !== undefined) return;

      // 存在しない場合はデータを作成
      const countDays = datetimeUtil.getDaysInMonth(
        Number(thisYear.current),
        Number(thisMonth.current)
      );

      const dates: TimeSheets[] = [];
      const now = new Date();
      for (let i = 0; i < countDays; i++) {
        dates.push({
          id: dayjs()
            .year(Number(thisYear.current))
            .month(Number(thisMonth.current) - 1)
            .day(i + 1)
            .startOf("day")
            .toDate(),
          yearMonth: `${thisYear.current}${thisMonth.current}`,
          breakTime: INIT_BREAK_TIME,
          startWorkTime: null,
          endWorkTime: null,
          localUpdatedAt: now,
        });
      }

      data = await db.timeSheets.where("id").equals(id).first();
      // すでに作成済みの場合は実行させない
      if (data !== undefined) return;
      await db.timeSheets.bulkAdd(dates);
    })();
  }, [id, timeSheets]);

  const updateTimeSheetsIndexedDB = async (values: TimeSheets) => {
    try {
      // TODO: サービス側に実装を移行する
      // TODO: 値に変更がなければ、更新させない
      await db.timeSheets.put({
        ...values,
        id,
        localUpdatedAt: new Date(),
      });
    } catch (error) {
      throw error;
    }
  };

  // 出勤
  const handleClickStart = () => {
    if (timeSheets === undefined) return;
    updateTimeSheetsIndexedDB({
      ...timeSheets,
      startWorkTime: new Date(),
    });
  };

  // 退勤
  const handleClickEnd = () => {
    if (timeSheets === undefined) return;
    updateTimeSheetsIndexedDB({
      ...timeSheets,
      endWorkTime: new Date(),
    });
  };

  // 休憩
  const handleChangeBreakTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _val = e.target.value;
    let _breakTime = Number.isNaN(_val) || _val === "" ? 0 : Number(_val);

    if (timeSheets === undefined) return;
    updateTimeSheetsIndexedDB({
      ...timeSheets,
      breakTime: _breakTime,
    });
  };

  // 削除
  const handleClickDelete = () => {
    // TODO: 確認ダイアログを表示する
    if (timeSheets === undefined) return;
    updateTimeSheetsIndexedDB({
      ...timeSheets,
      startWorkTime: null,
      endWorkTime: null,
      breakTime: 0,
    });
    setWorkTime(INIT_WORK_TIMES);
  };

  return (
    <>
      <TodayBox>
        <DateBox>
          {datetimeUtil.getFormattedDatetime({
            date: currentTime,
            format: "yyyy年MM月dd日（aaa）",
            zeroFilled: false,
          })}
        </DateBox>
        <TimeBox>
          {datetimeUtil.getFormattedDatetime({
            date: currentTime,
            format: "HH:mm:ss",
            zeroFilled: true,
          })}
        </TimeBox>
      </TodayBox>
      <Margin8Box>
        <StyledStamping
          date={timeSheets?.startWorkTime ?? null}
          text={"出勤"}
          onClick={handleClickStart}
          startIcon={<Work />}
        ></StyledStamping>
      </Margin8Box>
      <Margin8Box>
        <StyledStamping
          date={timeSheets?.endWorkTime ?? null}
          text={"退勤"}
          onClick={handleClickEnd}
          startIcon={<TimeToLeave />}
        ></StyledStamping>
      </Margin8Box>
      <TextField
        id="break-time"
        type="number"
        label="休憩時間（分）"
        variant="outlined"
        value={timeSheets?.breakTime ?? null}
        onChange={handleChangeBreakTime}
      />
      <div>就業時間</div>
      <div>{workTime}</div>
      <div>給料</div>
      <div>
        ¥
        {(settings?.hourlyPay ?? 0) *
          (getWorkTimesM({
            startTime: timeSheets?.startWorkTime,
            endTime: timeSheets?.endWorkTime,
            breakTime: timeSheets?.breakTime,
          }) /
            60)}
      </div>
      <Button
        variant="outlined"
        startIcon={<Delete />}
        onClick={handleClickDelete}
      >
        削除
      </Button>
    </>
  );
}
