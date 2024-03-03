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
import { useEffect, useRef, useState } from "react";
import datetimeUtil from "@/utils/datetime";
import {
  getTimeSheetByYearMonth,
  insertMonthTimeSheet,
} from "@/services/timeSheetService";
import { TimeSheet } from "@/types/timeSheetType";
import { Delete } from "@mui/icons-material";

const columns: GridColDef[] = [
  {
    field: "date",
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
    field: "startTime",
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
    field: "endTime",
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

  const [timeSheets, setTimeSheets] = useState<TimeSheet[]>([]);

  useEffect(() => {
    const getData = async () => {
      getTimeSheetByYearMonth(`${thisYear.current}${thisMonth.current}`).then(
        (data) => {
          console.table(data);
          setTimeSheets(data);
          if (data.length === 0) {
            // データ作成
            insertMonthTimeSheet(
              Number(thisYear.current),
              Number(thisMonth.current)
            ).then(() => {
              getTimeSheetByYearMonth(
                `${thisYear.current}${thisMonth.current}`
              ).then((data) => {
                console.table(data);
                setTimeSheets(data);
              });
            });
          }
        }
      );
    };

    getData();
  }, []);
  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <Box>{`${thisYear.current}/${thisMonth.current}`}</Box>
      <DataGrid
        rows={timeSheets}
        columns={columns}
        loading={timeSheets.length === 0}
        columnHeaderHeight={32}
        rowHeight={40}
        // autoHeight
        disableColumnFilter
        disableColumnMenu
        // hideFooterPagination
        hideFooter
        // autoPageSize
      />
    </Box>
  );
}
