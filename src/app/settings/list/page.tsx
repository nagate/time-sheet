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
import NumberListItem from "@/components/molecules/listItems/numberListItem";

export default function SettingsListPage() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [hourlyPay, setHourlyPay] = useState<number>(850);
  const [breakTime, setBreakTime] = useState<number>(60);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  const handleCloseHourlyPay = (value: number) => {
    setSelectedIndex(-1);
    setHourlyPay(value);
  };

  const handleCloseBreakTime = (value: number) => {
    setSelectedIndex(-1);
    setBreakTime(value);
  };

  return (
    <>
      <List component="nav" aria-label="main mailbox folders">
        <NumberListItem
          name={"hourlyPay"}
          title={"時給"}
          value={hourlyPay}
          unitName={"円"}
          selected={selectedIndex === 0}
          onClose={handleCloseHourlyPay}
        ></NumberListItem>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folder">
        <NumberListItem
          name={"breakTime"}
          title={"休憩"}
          value={breakTime}
          unitName={"分"}
          selected={selectedIndex === 1}
          onClose={handleCloseBreakTime}
        ></NumberListItem>
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
    </>
  );
}
