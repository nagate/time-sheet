"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { useEffect, useRef } from "react";
import datetimeUtil from "@/utils/datetime";
import { Delete } from "@mui/icons-material";
import { TimeSheets, db } from "../indexedDB/timeSheetAppDB";
import { useLiveQuery } from "dexie-react-hooks";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "日付",
    width: 80,
    sortable: false,
    valueFormatter: (params: GridValueFormatterParams<Date>) => {
      if (params.value == null) {
        return "";
      }
      return datetimeUtil.getFormattedDatetime({
        date: params.value,
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
        icon={<Delete />}
        onClick={handleClickDelete}
        label="詳細確認"
        showInMenu
      />,
      <GridActionsCellItem
        key={1}
        icon={<Delete />}
        onClick={handleClickDelete}
        label="編集"
        showInMenu
      />,
      <GridActionsCellItem
        key={2}
        icon={<Delete />}
        onClick={handleClickDelete}
        label="削除"
        showInMenu
      />,
    ],
  },
];

const handleClickDelete = () => {
  console.log("delete");
};

export default function TimeSheetsPage() {
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
        dates.push({
          id: new Date(
            Number(thisYear.current),
            Number(thisMonth.current),
            i + 1
          ),
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

  return (
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
  );
}
