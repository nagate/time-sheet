"use client";

import { Button, ButtonProps, List, styled } from "@mui/material";
import React from "react";
import NumberListItem from "@/components/molecules/listItems/numberListItem";
import dayjs, { Dayjs } from "dayjs";
import TimeListItem from "@/components/molecules/listItems/timeListItem";
import { Settings, TimeSheets, db } from "@/indexedDB/timeSheetAppDB";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter, useSearchParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { CONSTANTS } from "@/constants/constants";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  // // backgroundColor: purple[500],
  // "&:hover": {
  //   backgroundColor: purple[700],
  // },
  // minWidth: 160,
  // minHeight: 80,
  // fontSize: "2rem",
  "& .MuiButton-startIcon>*:nth-of-type(1)": {
    // fontSize: 40,
  },
}));

export default function TimeSheetEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const timeSheets: TimeSheets | undefined = useLiveQuery(async () => {
    if (!id) return;
    return await db.timeSheets.where("id").equals(id).first();
  }, [id]);

  const settings: Settings | undefined = useLiveQuery(async () => {
    return await db.settings.where("id").equals(CONSTANTS.SETTING_ID).first();
  });

  const updateTimeSheetsIndexedDB = async (values: TimeSheets) => {
    try {
      // TODO: サービス側に実装を移行する
      // TODO: 値に変更がなければ、更新させない
      await db.timeSheets.put({
        ...values,
        localUpdatedAt: new Date(),
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // ========================================
  // Event
  // ========================================

  // 休憩時間
  const handleCloseBreakTime = async (value: number) => {
    if (!timeSheets) return;
    await updateTimeSheetsIndexedDB({
      ...timeSheets,
      breakTime: value,
    });
  };

  // 出勤時間
  const handleOkStartWorkTime = async (value: Dayjs | null) => {
    if (!timeSheets) return;
    await updateTimeSheetsIndexedDB({
      ...timeSheets,
      startWorkTime: value?.toDate() ?? null,
    });
  };

  // 退勤時間
  const handleOkEndWorkTime = async (value: Dayjs | null) => {
    if (!timeSheets) return;
    await updateTimeSheetsIndexedDB({
      ...timeSheets,
      endWorkTime: value?.toDate() ?? null,
    });
  };

  // 戻る
  const handleClickReturn = () => {
    router.back();
  };

  // 初期値を設定
  const handleClickInitVal = async () => {
    if (!timeSheets) return;
    if (!settings) return;

    await updateTimeSheetsIndexedDB({
      ...timeSheets,
      startWorkTime: settings.startWorkTime,
      endWorkTime: settings.endWorkTime,
      breakTime: settings.breakTime,
    });
  };

  return (
    <>
      <List component="nav" aria-label="secondary mailbox folder">
        <TimeListItem
          name={"startWorkTime"}
          title={"出勤時間"}
          value={dayjs(timeSheets?.startWorkTime) ?? null}
          endIcon={<EditIcon />}
          onClickOk={handleOkStartWorkTime}
        ></TimeListItem>
        <TimeListItem
          name={"endWorkTime"}
          title={"退勤時間"}
          value={dayjs(timeSheets?.endWorkTime) ?? null}
          endIcon={<EditIcon />}
          onClickOk={handleOkEndWorkTime}
        ></TimeListItem>
        <NumberListItem
          name={"breakTime"}
          title={"休憩時間"}
          value={timeSheets?.breakTime ?? 0}
          unitName={"分"}
          endIcon={<EditIcon />}
          onClickOk={handleCloseBreakTime}
        ></NumberListItem>
      </List>
      <ColorButton
        variant="outlined"
        startIcon={<KeyboardReturnIcon />}
        onClick={handleClickReturn}
      >
        戻る
      </ColorButton>
      <ColorButton
        variant="outlined"
        startIcon={<KeyboardReturnIcon />}
        onClick={handleClickInitVal}
      >
        初期値を設定
      </ColorButton>
    </>
  );
}
