"use client";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NumberInputDialog from "@/components/organisms/inputDialogs/numberInputDialog";
import EditIcon from "@mui/icons-material/Edit";

const StyledListItemButton = styled(ListItemButton)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  border: `1px solid rgba(25, 118, 210, 0.5)`,
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

export default function NumberInputButton({
  name,
  title,
  value,
  unitName = "",
  endIcon = <NavigateNextIcon />,
  selected = false,
  onClick = () => {},
  onClickOk,
}: {
  name: string;
  title: string;
  value: number;
  unitName?: string;
  endIcon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onClickOk: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    onClick();
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
        <EditIcon>{endIcon}</EditIcon>
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
