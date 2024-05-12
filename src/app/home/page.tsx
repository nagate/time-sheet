"use client";

import Stamping from "@/components/atoms/stampings/stamping";
import datetimeUtil from "@/utils/datetime";
import { NumberUtil } from "@/utils/numburUtil";
import { Delete, Edit, TimeToLeave, Work } from "@mui/icons-material";
import { Box, Button, List, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Settings, TimeSheets, db } from "../../indexedDB/timeSheetAppDB";
import { useLiveQuery } from "dexie-react-hooks";
import dayjs, { Dayjs } from "dayjs";
import NumberListItem from "@/components/molecules/listItems/numberListItem";
import EditIcon from "@mui/icons-material/Edit";
import TimeListItem from "@/components/molecules/listItems/timeListItem";
import InformationDialog from "@/components/organisms/dialogs/informationDialog";
import { useRouter } from "next/navigation";
import { CONSTANTS } from "@/constants/constants";
import { TimeSheetimeSheetService } from "@/services/timeSheetsService";

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

const UtilArea = styled(Box)({
  display: "flex",
  columnGap: 16,
  padding: 8,
  backgroundColor: "rgba(25, 118, 210, 0.04)",
});

const StampingArea = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  columnGap: 8,
  padding: 8,
});

const StyledStamping = styled(Stamping)({});

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
}): Dayjs | null => {
  const diffMinutes = getWorkTimesM({ endTime, startTime, breakTime });
  return dayjs().startOf("day").add(diffMinutes, "m");
};

const INIT_BREAK_TIME = 0;
// 現時点では固定
const SETTING_ID = 1;

export default function HomePage() {
  const router = useRouter();
  const [id, setId] = useState<string>(
    dayjs().format(CONSTANTS.TIME_SHEET_ID_FORMAT)
  );
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [workTime, setWorkTime] = useState<Dayjs | null>(null);
  const [openInfoDialog, setOpenInfoDialog] = useState<boolean>(false);
  const [targetMonth, setTargetMonth] = useState<Dayjs>(
    dayjs().startOf("month")
  );

  // ========================================
  // Get Data From IndexedDB
  // ========================================
  const timeSheets: TimeSheets | undefined = useLiveQuery(async () => {
    return await TimeSheetimeSheetService.getTimeSheetById(id);
  }, [id]);

  const settings: Settings | undefined = useLiveQuery(async () => {
    return await db.settings.get(SETTING_ID);
  }, []);

  // ========================================
  // useEffect
  // ========================================
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
    // 取得できていない場合は処理しない
    if (timeSheets === undefined) return;

    (async () => {
      // すでに作成済みの場合は実行させない
      if (timeSheets !== undefined) return;

      // 未作成の場合、タイムシートを作成
      await TimeSheetimeSheetService.createTimeSheetsByMonth(targetMonth);
    })();
  }, [id, targetMonth, timeSheets]);

  // ========================================
  // Event
  // ========================================

  // 出勤
  const handleClickStart = async () => {
    if (timeSheets === undefined) return;

    await TimeSheetimeSheetService.updateTimeSheet({
      ...timeSheets,
      startWorkTime: new Date(),
    });
  };

  // 退勤
  const handleClickEnd = async () => {
    if (timeSheets === undefined) return;

    await TimeSheetimeSheetService.updateTimeSheet({
      ...timeSheets,
      endWorkTime: new Date(),
    });
  };

  // 休憩
  const handleChangeBreakTime = async (value: number) => {
    if (timeSheets === undefined) return;

    await TimeSheetimeSheetService.updateTimeSheet({
      ...timeSheets,
      breakTime: value,
    });
  };

  // 削除
  const handleClickDelete = () => {
    setOpenInfoDialog(true);
  };

  // 削除ダイアログ
  const handleCloseDeleteDialog = async (cancel: boolean) => {
    setOpenInfoDialog(false);
    if (cancel) return;

    if (timeSheets === undefined) return;
    await TimeSheetimeSheetService.logicalDelete(timeSheets.id);

    setWorkTime(null);
  };

  // 編集
  const handleClickEdit = () => {
    router.push(`/time-sheets/edit?id=${id}`);
  };

  // TODO: 有給休暇
  // TODO: memo
  // TODO: 交通費

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
      <UtilArea>
        <Button
          variant="outlined"
          startIcon={<Delete />}
          onClick={handleClickDelete}
        >
          削除
        </Button>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={handleClickEdit}
        >
          編集
        </Button>
      </UtilArea>
      <StampingArea>
        <StyledStamping
          date={timeSheets?.startWorkTime ?? null}
          text={"出勤"}
          onClick={handleClickStart}
          onClickEdit={() => {}}
          startIcon={<Work />}
        ></StyledStamping>
        <StyledStamping
          date={timeSheets?.endWorkTime ?? null}
          text={"退勤"}
          onClick={handleClickEnd}
          onClickEdit={() => {}}
          startIcon={<TimeToLeave />}
        ></StyledStamping>
      </StampingArea>
      <List component="nav" aria-label="secondary mailbox folder">
        <NumberListItem
          name={"breakTime"}
          title={"休憩時間"}
          value={timeSheets?.breakTime ?? 0}
          unitName={"分"}
          endIcon={<EditIcon />}
          onClickOk={(v) => {
            handleChangeBreakTime(v);
          }}
        ></NumberListItem>
        <TimeListItem
          name={"workTime"}
          title={"就業時間"}
          value={workTime}
          endIcon={null}
          readOnly
        ></TimeListItem>
        <NumberListItem
          name={"pay"}
          title={"給料"}
          value={
            (settings?.hourlyPay ?? 0) *
            (getWorkTimesM({
              startTime: timeSheets?.startWorkTime,
              endTime: timeSheets?.endWorkTime,
              breakTime: timeSheets?.breakTime,
            }) /
              60)
          }
          unitName={"円"}
          endIcon={null}
          readOnly
        ></NumberListItem>
      </List>
      <InformationDialog
        title={"削除"}
        open={openInfoDialog}
        message={"出退勤日時、休憩時間を削除します。よろしいですか？"}
        onClickOk={handleCloseDeleteDialog}
      />
    </>
  );
}
