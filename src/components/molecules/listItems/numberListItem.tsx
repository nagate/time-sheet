"use client";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import NumberInputDialog from "@/components/organisms/inputDialogs/numberInputDialog";

const StyledListItemButton = styled(ListItemButton)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
});

const Label = styled("div")({
  display: "flex",
  flexDirection: "row",
  width: "100%",
});

const Value = styled(ListItemText)({
  textAlign: "right",
});

const NextIcon = styled(ListItemIcon)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  minWidth: 40,
});

export default function NumberListItem({
  name,
  title,
  value,
  unitName = "",
  endIcon = null,
  selected = false,
  readOnly = false,
  onClick = () => {},
  onClickOk = () => {},
}: {
  name: string;
  title: string;
  value: number;
  unitName?: string;
  endIcon?: React.ReactNode;
  selected?: boolean;
  readOnly?: boolean;
  onClick?: () => void;
  onClickOk?: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    onClick();
    if (readOnly) return;
    setOpen(true);
  };

  const handleClose = (val: number | null, cancel: boolean) => {
    setOpen(false);
    if (cancel) return;
    onClickOk(val ?? 0);
  };

  return (
    <>
      <StyledListItemButton selected={selected} onClick={handleClick}>
        <Label>
          <ListItemText primary={title} />
          <Value primary={`${value}${unitName}`} />
        </Label>
        <NextIcon>{endIcon} </NextIcon>
      </StyledListItemButton>
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
