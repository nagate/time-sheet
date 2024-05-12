import React from "react";
import TextField from "@mui/material/TextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ja";

const CustomTextField = React.forwardRef<HTMLDivElement, any>(
  function CustomTextField(props, ref) {
    return <TextField {...props} ref={ref} />;
  }
);

export default function YearPicker({
  value,
  onChange,
}: {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}) {
  const handleYearChange = (date: Dayjs | null) => {
    onChange(date?.startOf("month") ?? null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <DatePicker
        views={["year", "month"]}
        label="Year"
        value={value}
        onChange={(value) => handleYearChange(value)}
        // TextFieldComponent={CustomTextField}
      />
    </LocalizationProvider>
  );
}
