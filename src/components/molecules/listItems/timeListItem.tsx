"use client";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TimeInputDialog from "@/components/organisms/inputDialogs/timeInputDialog";
import { Dayjs } from "dayjs";
import datetimeUtil from "@/utils/datetime";

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

export default function TimeListItem({
  name,
  title,
  value,
  format = "HH:mm",
  endIcon = <NavigateNextIcon />,
  selected = false,
  readOnly = false,
  onClick = () => {},
  onClickOk = () => {},
}: {
  name: string;
  title: string;
  value: Dayjs | null;
  format?: string;
  endIcon?: React.ReactNode;
  selected?: boolean;
  readOnly?: boolean;
  onClick?: () => void;
  onClickOk?: (value: Dayjs | null) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    onClick();
    if (readOnly) return;
    setOpen(true);
  };

  const handleClose = (val: Dayjs | null, cancel: boolean) => {
    setOpen(false);
    if (cancel) return;
    onClickOk(val);
  };

  const formatDatetime = (v: Dayjs | null) => {
    return datetimeUtil.getFormattedDatetime({
      date: v?.toDate() ?? new Date(),
      format: format,
    });
  };

  return (
    <>
      <StyledListItemButton selected={selected} onClick={handleClick}>
        <Label>
          <ListItemText primary={title} />
          <Value primary={formatDatetime(value)} />
        </Label>
        <NextIcon>{endIcon} </NextIcon>
      </StyledListItemButton>
      <TimeInputDialog
        name={name}
        title={title}
        value={value}
        open={open}
        onClickClose={handleClose}
      ></TimeInputDialog>
    </>
  );
}
