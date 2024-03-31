import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import {
  PickerChangeHandlerContext,
  TimePicker,
  TimeValidationError,
} from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

export default function TimeInputDialog({
  name,
  title,
  open,
  onClickClose,
  value,
}: {
  name: string;
  title: string;
  open: boolean;
  onClickClose: (value: Dayjs | null, cancel: boolean) => void;
  value: Dayjs | null;
}) {
  const [val, setVal] = useState<Dayjs | null>(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const handleClickOk = () => {
    onClickClose(val, false);
  };

  const handleClose = () => {
    onClickClose(value, true);
  };

  const handeleChangeValue = (
    value: Dayjs | null,
    context: PickerChangeHandlerContext<TimeValidationError>
  ) => {
    setVal(value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{title}を入力する</DialogContentText>
        <TimePicker
          autoFocus
          name={name}
          value={val}
          onChange={handeleChangeValue}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClickOk}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
