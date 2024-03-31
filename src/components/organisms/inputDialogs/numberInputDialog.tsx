import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

export default function NumberInputDialog({
  name,
  title,
  open,
  onClickClose,
  value,
}: {
  name: string;
  title: string;
  open: boolean;
  onClickClose: (value: number, cancel: boolean) => void;
  value: number;
}) {
  const [val, setVal] = useState<number>(value);

  const handleClickOk = () => {
    onClickClose(val, false);
  };

  const handleClose = () => {
    onClickClose(value, true);
  };

  const handeleChangeValue = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setVal(Number(ev.currentTarget.value));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{title}を入力する</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name={name}
          type="number"
          fullWidth
          variant="standard"
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
