"use client";
import Stamping from "@/components/atoms/stampings/stamping";
import {
  getTimeSheet,
  insertTimeSheet,
  updateTimeSheet,
} from "@/services/timeSheetService";
import datetimeUtil from "@/utils/datetime";
// import { addData, addTimeSheet } from "@/utils/indexedDB";
import { NumberUtil } from "@/utils/numburUtil";
import { Delete, TimeToLeave, Work } from "@mui/icons-material";
import { Box, Button, TextField, styled } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";

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
    return `00:00`;
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
    return `00:00`;
  }
  const hours = NumberUtil.truncate(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  // 2桁の文字列に変換
  const formattedHours = NumberUtil.toTwoDigits(hours);
  const formattedMinutes = NumberUtil.toTwoDigits(minutes);

  return `${formattedHours}:${formattedMinutes}`;
};

export default function HomePage() {
  const today = useRef<string>(
    datetimeUtil.getFormattedDatetime({
      date: new Date(),
      format: "yyyyMMdd",
      zeroFilled: true,
    })
  );
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [workTime, setWorkTime] = useState<string>("00:00");
  const [breakTime, setBreakTime] = useState<number>(60);

  useEffect(() => {
    // 1秒おきに日付を更新
    const intervalTime = 1000;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, intervalTime);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const et = endTime || currentTime;
    setWorkTime(getWorkTImes({ endTime: et, startTime, breakTime }));
  }, [endTime, currentTime, startTime, breakTime]);

  useEffect(() => {
    const getData = async () => {
      const result = await getTimeSheet(today.current);
      console.log(result);
      if (result) {
        const { id, startTime, endTime, breakTime } = result;
        startTime && setStartTime(startTime);
        endTime && setEndTime(endTime);
        setBreakTime(breakTime);
      } else {
        // まだデータがない場合は作成
        insertTimeSheet({
          id: today.current,
          date: new Date(),
          breakTime: 0,
        });
      }
    };

    getData();
  }, []);

  // 出勤
  const handleClickStart = () => {
    const s = new Date();
    setStartTime(s);
    updateTimeSheet({
      id: today.current,
      date: new Date(),
      startTime: s,
      endTime: endTime ?? undefined,
      breakTime,
    });
  };

  // 退勤
  const handleClickEnd = () => {
    const e = new Date();

    setEndTime(e);
    updateTimeSheet({
      id: today.current,
      date: new Date(),
      startTime: startTime ?? undefined,
      endTime: e,
      breakTime,
    });
  };

  // 休憩
  const handleChangeBreakTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBreakTime(Number(e.target.value));
    updateTimeSheet({
      id: today.current,
      date: new Date(),
      startTime: startTime ?? undefined,
      endTime: endTime ?? undefined,
      breakTime,
    });
  };

  // 削除
  const handleClickDelete = () => {
    // TODO: 確認ダイアログを表示する
    setStartTime(null);
    setEndTime(null);
    setWorkTime("00:00");
    setBreakTime(60);
    updateTimeSheet({
      id: today.current,
      date: new Date(),
      startTime: undefined,
      endTime: undefined,
      breakTime: 60,
    });
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
          date={startTime}
          text={"出勤"}
          onClick={handleClickStart}
          startIcon={<Work />}
        ></StyledStamping>
      </Margin8Box>
      <Margin8Box>
        <StyledStamping
          date={endTime}
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
        value={breakTime}
        onChange={handleChangeBreakTime}
      />
      <div>就業時間</div>
      <div>{workTime}</div>
      <div>給料</div>
      <div>¥5,300</div>
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
