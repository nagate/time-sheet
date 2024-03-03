"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useRef } from "react";
import datetimeUtil from "@/utils/datetime";

const columns: GridColDef[] = [
  { field: "date", headerName: "日付", width: 60, sortable: false },
  {
    field: "start",
    headerName: "出勤",
    width: 60,
    sortable: false,
  },
  {
    field: "end",
    headerName: "退勤",
    width: 60,
    sortable: false,
  },
  {
    field: "break",
    headerName: "休憩",
    type: "number",
    width: 40,
    sortable: false,
  },
];

const rows = [
  { id: 1, date: "1(月)", start: "09:00", end: "18:00", break: 60 },
  { id: 2, date: "88(月)", start: "24:33", end: "88:88", break: 888 },
  // { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  // { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  // { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  // { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  // { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  // { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  // { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  // { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

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

  useEffect(() => {
    const date = datetimeUtil.createMonthDates(
      Number(thisYear),
      Number(thisMonth)
    );
    // TODO: データがない場合は作成する
  }, []);
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        // initialState={{
        //   pagination: {
        //     paginationModel: {
        //       pageSize: 15,
        //     },
        //   },
        // }}
        // pageSizeOptions={[15]}
        // checkboxSelection
        // disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        hideFooterPagination
      />
    </Box>
  );
}
