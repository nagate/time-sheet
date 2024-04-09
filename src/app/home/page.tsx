"use client";

import Stamping from "@/components/atoms/stampings/stamping";
import datetimeUtil from "@/utils/datetime";
import { NumberUtil } from "@/utils/numburUtil";
import { Delete, Edit, TimeToLeave, Work } from "@mui/icons-material";
import { Box, Button, List, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Settings, TimeSheets, db } from "../indexedDB/timeSheetAppDB";
import { useLiveQuery } from "dexie-react-hooks";
import dayjs, { Dayjs } from "dayjs";
import NumberListItem from "@/components/molecules/listItems/numberListItem";
import EditIcon from "@mui/icons-material/Edit";
import TimeListItem from "@/components/molecules/listItems/timeListItem";
import InformationDialog from "@/components/organisms/dialogs/informationDialog";
import { useRouter } from "next/navigation";

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
const INIT_WORK_TIMES = "00:00";
// 現時点では固定
const SETTING_ID = 1;

export default function HomePage() {
  const router = useRouter();
  const [id, setId] = useState<Date>(dayjs().startOf("day").toDate());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [workTime, setWorkTime] = useState<Dayjs | null>(null);
  const [openInfoDialog, setOpenInfoDialog] = useState<boolean>(false);

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

  // ========================================
  // Event
  // ========================================

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
  const handleChangeBreakTime = (value: number) => {
    if (timeSheets === undefined) return;
    updateTimeSheetsIndexedDB({
      ...timeSheets,
      breakTime: value,
    });
  };

  // 削除
  const handleClickDelete = () => {
    setOpenInfoDialog(true);
  };

  // 削除ダイアログ
  const handleCloseDeleteDialog = (cancel: boolean) => {
    setOpenInfoDialog(false);
    if (cancel) return;

    if (timeSheets === undefined) return;
    updateTimeSheetsIndexedDB({
      ...timeSheets,
      startWorkTime: null,
      endWorkTime: null,
      breakTime: 0,
    });
    setWorkTime(null);
  };

  // 編集
  const handleClickEdit = () => {
    // TODO:画面遷移する、IDを渡す
    const strId = dayjs(id).format("YYYYMMDD");
    router.push(`/time-sheets/edit?id=${strId}`);
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
