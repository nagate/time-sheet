"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import datetimeUtil from "@/utils/datetime";
import { Delete } from "@mui/icons-material";
import { TimeSheets, db } from "../../../indexedDB/timeSheetAppDB";
import { useLiveQuery } from "dexie-react-hooks";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import InformationDialog from "@/components/organisms/dialogs/informationDialog";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { CONSTANTS } from "@/constants/constants";
import YearPicker from "@/components/atoms/datePicker/yearPicker";
import { TimeSheetimeSheetService } from "@/services/timeSheetsService";
import CalendarNavigation from "@/components/molecules/navigations/calendarNavigation";

export default function TimeSheetsPage() {
  const router = useRouter();
  const targetId = useRef<string | null>(null);

  const [openInfoDialog, setOpenInfoDialog] = useState<boolean>(false);
  const [targetMonth, setTargetMonth] = useState<Dayjs>(
    dayjs().startOf("month")
  );

  // ========================================
  // Get Data From IndexedDB
  // ========================================
  const timeSheets: TimeSheets[] | undefined = useLiveQuery(async () => {
    return await TimeSheetimeSheetService.getTimeSheetsByMonth(targetMonth);
  }, [targetMonth]);

  // ========================================
  // useEffect
  // ========================================
  useEffect(() => {
    (async () => {
      console.log("useEffect");
      // 取得できていない場合は処理しない
      if (timeSheets === undefined) return;
      // すでに作成済みの場合は実行させない
      if (timeSheets.length > 0) return;

      // 未作成の場合、タイムシートを作成
      await TimeSheetimeSheetService.createTimeSheetsByMonth(targetMonth);
    })();
  }, [targetMonth, timeSheets]);

  // ========================================
  // Column Definition
  // ========================================
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "日付",
      width: 80,
      sortable: false,
      valueFormatter: (params: GridValueFormatterParams<string>) => {
        if (params.value == null) {
          return "";
        }
        return datetimeUtil.getFormattedDatetime({
          date: dayjs(params.value, CONSTANTS.TIME_SHEET_ID_FORMAT).toDate(),
          format: "dd（aaa）",
          zeroFilled: true,
        });
      },
    },
    {
      field: "startWorkTime",
      headerName: "出勤",
      width: 60,
      sortable: false,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        if (params.value == null) {
          return "";
        }
        return datetimeUtil.getFormattedDatetime({
          date: params.value,
          format: "HH:mm",
          zeroFilled: true,
        });
      },
    },
    {
      field: "endWorkTime",
      headerName: "退勤",
      width: 60,
      sortable: false,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        if (params.value == null) {
          return "";
        }
        return datetimeUtil.getFormattedDatetime({
          date: params.value,
          format: "HH:mm",
          zeroFilled: true,
        });
      },
    },
    {
      field: "breakTime",
      headerName: "休憩",
      type: "number",
      width: 40,
      sortable: false,
    },
    {
      field: "actions",
      headerName: "操作",
      type: "actions",
      width: 40,
      sortable: false,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key={0}
          icon={<InfoIcon />}
          onClick={() => handleClickDetail(params.id)}
          label="詳細確認"
          showInMenu
        />,
        <GridActionsCellItem
          key={1}
          icon={<EditIcon />}
          onClick={() => handleClickEdit(params.id)}
          label="編集"
          showInMenu
        />,
        <GridActionsCellItem
          key={2}
          icon={<Delete />}
          onClick={() => handleClickDelete(params.id)}
          label="削除"
          showInMenu
        />,
      ],
    },
  ];

  // ========================================
  // Event
  // ========================================

  // 前月へ
  const handleClickPrevMonth = (date: Date) => {
    setTargetMonth(dayjs(date).startOf("month"));
  };

  // 次月へ
  const handleClickNextMonth = (date: Date) => {
    setTargetMonth(dayjs(date).startOf("month"));
  };

  // 対象年月の変更
  const handleChangeTargetMonth = (yearMonth: Dayjs | null) => {
    console.log(yearMonth);
    if (!yearMonth) return;
    setTargetMonth(yearMonth);
  };

  // 参照
  const handleClickDetail = (id: GridRowId) => {
    router.push(`/time-sheets/detail?id=${id.toString()}`);
  };

  // 編集
  const handleClickEdit = (id: GridRowId) => {
    router.push(`/time-sheets/edit?id=${id.toString()}`);
  };

  const handleClickDelete = (id: GridRowId) => {
    targetId.current = id.toString();
    setOpenInfoDialog(true);
  };

  // 削除ダイアログ
  const handleCloseDeleteDialog = async (cancel: boolean) => {
    setOpenInfoDialog(false);
    if (cancel) return;
    if (timeSheets === undefined) return;
    if (!targetId.current) return;

    await TimeSheetimeSheetService.logicalDelete(targetId.current);

    targetId.current = null;
  };

  return (
    <>
      <Box sx={{ height: 500, width: "100%" }}>
        <CalendarNavigation
          onPreviousMonthClick={handleClickPrevMonth}
          onNextMonthClick={handleClickNextMonth}
          currentDate={targetMonth.toDate()}
        ></CalendarNavigation>
        <DataGrid
          rows={timeSheets ?? []}
          columns={columns}
          loading={(timeSheets?.length ?? 0) === 0}
          columnHeaderHeight={32}
          rowHeight={40}
          disableColumnFilter
          disableColumnMenu
          hideFooter
        />
      </Box>
      <InformationDialog
        title={"削除"}
        open={openInfoDialog}
        message={"出退勤日時、休憩時間を削除します。よろしいですか？"}
        onClickOk={handleCloseDeleteDialog}
      />
    </>
  );
}
