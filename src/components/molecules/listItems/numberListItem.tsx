"use client";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NumberInputDialog from "@/components/organisms/inputDialogs/numberInputDialog";

export default function NumberListItem({
  name,
  title,
  value,
  unitName = "",
  selected = false,
  onClose,
}: {
  name: string;
  title: string;
  value: number;
  unitName?: string;
  selected?: boolean;
  onClose: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (value: number, cancel: boolean) => {
    setOpen(false);
    if (cancel) return;
    onClose(value);
  };

  return (
    <>
      <ListItemButton selected={selected} onClick={handleClick}>
        <ListItemText primary={title} />
        <ListItemText primary={`${value}${unitName}`} />
        <ListItemIcon>
          <NavigateNextIcon />
        </ListItemIcon>
      </ListItemButton>
      <NumberInputDialog
        name={name}
        title={title}
        value={value}
        open={open}
        onClickClose={handleClose}
      ></NumberInputDialog>
    </>
  );
}
