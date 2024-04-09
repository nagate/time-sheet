"use client";

import { Button, ButtonProps, List, styled } from "@mui/material";
import React from "react";
import NumberListItem from "@/components/molecules/listItems/numberListItem";
import dayjs from "dayjs";
import TimeListItem from "@/components/molecules/listItems/timeListItem";
import { TimeSheets, db } from "@/indexedDB/timeSheetAppDB";
import { useRouter, useSearchParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

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

export default function TimeSheetDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const timeSheets: TimeSheets | undefined = useLiveQuery(async () => {
    if (!id) return;
    return await db.timeSheets.where("id").equals(id).first();
  }, [id]);

  // ========================================
  // Event
  // ========================================

  // 戻る
  const handleClickReturn = () => {
    router.back();
  };

  return (
    <>
      <List component="nav" aria-label="secondary mailbox folder">
        <TimeListItem
          name={"startWorkTime"}
          title={"出勤時間"}
          value={dayjs(timeSheets?.startWorkTime) ?? null}
          readOnly
        ></TimeListItem>
        <TimeListItem
          name={"endWorkTime"}
          title={"退勤時間"}
          value={dayjs(timeSheets?.endWorkTime) ?? null}
          readOnly
        ></TimeListItem>
        <NumberListItem
          name={"breakTime"}
          title={"休憩時間"}
          value={timeSheets?.breakTime ?? 0}
          unitName={"分"}
          readOnly
        ></NumberListItem>
      </List>
      <ColorButton
        variant="outlined"
        startIcon={<KeyboardReturnIcon />}
        onClick={handleClickReturn}
      >
        戻る
      </ColorButton>
    </>
  );
}
