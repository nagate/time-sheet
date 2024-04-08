import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function InformationDialog({
  title,
  message,
  open,
  onClickOk,
  okLabel = "OK",
  cancelLabel = "キャンセル",
}: {
  title: string;
  message: string;
  open: boolean;
  onClickOk: (ancel: boolean) => void;
  okLabel?: string;
  cancelLabel?: string;
}) {
  const handleClose = (cancel: boolean) => {
    onClickOk(cancel);
  };

  return (
    <Dialog open={open} onClose={() => handleClose(true)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(true)} autoFocus>
          {cancelLabel}
        </Button>
        <Button onClick={() => handleClose(false)}>{okLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
