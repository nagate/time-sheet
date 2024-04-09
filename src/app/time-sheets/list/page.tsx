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
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { CONSTANTS } from "@/constants/constants";

export default function TimeSheetsPage() {
  const router = useRouter();
  const [openInfoDialog, setOpenInfoDialog] = useState<boolean>(false);
  const targetId = useRef<string | null>(null);

  const thisYear = useRef<string>(dayjs().format("YYYY"));
  const thisMonth = useRef<string>(dayjs().format("MM"));

  const timeSheets: TimeSheets[] | undefined = useLiveQuery(async () => {
    return await db.timeSheets
      .where("yearMonth")
      .equals(`${thisYear.current}${thisMonth.current}`)
      .toArray();
  }, [`${thisYear.current}${thisMonth.current}`]);

  useEffect(() => {
    // 取得できていない場合は処理しない
    if (timeSheets === undefined) return;

    // 情報を取得
    // TODO: サービス側に実装を移行する
    (async () => {
      // すでに作成済みの場合は実行させない
      if (timeSheets.length > 0) return;

      // 存在しない場合はデータを作成
      const countDays = datetimeUtil.getDaysInMonth(
        Number(thisYear.current),
        Number(thisMonth.current)
      );

      const dates: TimeSheets[] = [];
      const now = new Date();
      for (let i = 0; i < countDays; i++) {
        const _id = dayjs()
          .year(Number(thisYear.current))
          .month(Number(thisMonth.current))
          .date(i + 1)
          .format(CONSTANTS.TIME_SHEET_ID_FORMAT);
        dates.push({
          id: _id,
          yearMonth: `${thisYear.current}${thisMonth.current}`,
          breakTime: 0,
          startWorkTime: null,
          endWorkTime: null,
          localUpdatedAt: now,
        });
      }

      await db.timeSheets.bulkAdd(dates);
    })();
  }, [timeSheets]);

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
          // onClick={handleClickDelete}
          label="詳細確認"
          showInMenu
        />,
        <GridActionsCellItem
          key={1}
          icon={<EditIcon />}
          // onClick={handleClickDelete}
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

  const updateTimeSheetsIndexedDB = async (values: TimeSheets) => {
    try {
      // TODO: サービス側に実装を移行する
      // TODO: 値に変更がなければ、更新させない
      await db.timeSheets.put({
        ...values,
        localUpdatedAt: new Date(),
      });
    } catch (error) {
      throw error;
    }
  };

  // ========================================
  // Event
  // ========================================

  // 編集
  const handleClickEdit = (id: Date) => {
    // TODO:画面遷移する、IDを渡す
    const strId = dayjs(id).format("YYYYMMDD");
    router.push(`/time-sheets/edit?id=${strId}`);
  };

  const handleClickDelete = (id: GridRowId) => {
    targetId.current = id.toString();
    setOpenInfoDialog(true);
  };

  // 削除ダイアログ
  const handleCloseDeleteDialog = (cancel: boolean) => {
    setOpenInfoDialog(false);
    if (cancel) return;
    if (timeSheets === undefined) return;
    if (!targetId.current) return;
    const _timeSheet = timeSheets.find((v) => v.id === targetId.current);
    console.log(timeSheets);

    console.log(_timeSheet);
    if (!_timeSheet) return;

    updateTimeSheetsIndexedDB({
      ..._timeSheet,
      startWorkTime: null,
      endWorkTime: null,
      breakTime: 0,
    });
    targetId.current = null;
  };

  return (
    <>
      <Box sx={{ height: 500, width: "100%" }}>
        <Box>{`${thisYear.current}/${thisMonth.current}`}</Box>
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
