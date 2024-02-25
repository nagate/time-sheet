"use client";
import TimeField from "@/components/atoms/timeFields/timeField";
import datetimeUtil from "@/utils/datetime";
import { NumberUtil } from "@/utils/numburUtil";
import { TimeToLeave, Work } from "@mui/icons-material";
import { Box, styled } from "@mui/material";
import React, { useEffect, useState } from "react";

const TodayBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

const StyledTimeField = styled(TimeField)({
  // TODO: 効かない?
  margin: 16,
  padding: 16,
});

const Margin8Box = styled(Box)({
  margin: 8,
});

const getWorkTImes = ({
  endTime,
  startTime,
}: {
  endTime: Date | null;
  startTime: Date | null;
}) => {
  const diffMinutes = NumberUtil.truncate(
    datetimeUtil.subtractTime(startTime, endTime) / (1000 * 60)
  );
  const hours = NumberUtil.truncate(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  // 2桁の文字列に変換
  const formattedHours = NumberUtil.toTwoDigits(hours);
  const formattedMinutes = NumberUtil.toTwoDigits(minutes);

  return `${formattedHours}:${formattedMinutes}`;
};

export default function HomePage() {
  // TODO: useMemoを使う？
  // const today = new Date();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [workTime, setWorkTime] = useState<string>("00:00");

  useEffect(() => {
    // 60秒
    const intervalTime = 1000 * 6;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, intervalTime);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    const et = endTime || currentTime;
    setWorkTime(getWorkTImes({ endTime: et, startTime }));
  }, [endTime, currentTime, startTime]);

  const handleClickStart = () => {
    setStartTime(new Date());
  };

  const handleClickEnd = () => {
    setEndTime(new Date());
  };

  return (
    <>
      <TodayBox>
        {datetimeUtil.getFormattedDatetime({
          date: currentTime,
          format: "yyyy年MM月dd日（aaa）",
          zeroFilled: false,
        })}
      </TodayBox>
      <Margin8Box>
        <StyledTimeField
          date={startTime}
          text={"出勤"}
          onClick={handleClickStart}
          startIcon={<Work />}
        ></StyledTimeField>
      </Margin8Box>
      <Margin8Box>
        <StyledTimeField
          date={endTime}
          text={"退勤"}
          onClick={handleClickEnd}
          startIcon={<TimeToLeave />}
        ></StyledTimeField>
      </Margin8Box>
      <div>就業時間</div>
      <div>{workTime}</div>
    </>
  );
}
