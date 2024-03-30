"use client";
import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NumberInputDialog from "@/components/organisms/inputDialogs/numberInputDialog";

export default function SettingsListPage() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [openNumber, setOpenNumber] = useState(false);
  const [hourlyPay, setHourlyPay] = useState<number>(850);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  const handleClickHourlyPay = () => {
    console.log("handleClickHourlyPay");
    setSelectedIndex(0);
    setOpenNumber(true);
  };

  const handleCloseHourlyPay = (value: number, cancel: boolean) => {
    console.log(value);
    setSelectedIndex(-1);
    setOpenNumber(false);

    if (cancel) return;
    setHourlyPay(value);
  };

  return (
    <>
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={handleClickHourlyPay}
        >
          <ListItemText primary="時給" />
          <ListItemText primary={`${hourlyPay}円`} />
          <ListItemIcon>
            <NavigateNextIcon />
          </ListItemIcon>
        </ListItemButton>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folder">
        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
        >
          <ListItemText primary="休憩" />
          <ListItemText primary="60分" />
          <ListItemIcon>
            <NavigateNextIcon />
          </ListItemIcon>
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemText primary="出勤時間" />
          <ListItemText primary="9:00" />
          <ListItemIcon>
            <NavigateNextIcon />
          </ListItemIcon>
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
        >
          <ListItemText primary="退勤時間" />
          <ListItemText primary="18:00" />
          <ListItemIcon>
            <NavigateNextIcon />
          </ListItemIcon>
        </ListItemButton>
      </List>
      <NumberInputDialog
        title={"時給"}
        value={hourlyPay}
        open={openNumber}
        onClickClose={handleCloseHourlyPay}
      ></NumberInputDialog>
    </>
  );
}
