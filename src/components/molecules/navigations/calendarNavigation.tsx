"use client";

import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

interface CalendarNavigationProps {
  currentDate: Date;
  onPreviousMonthClick: (d: Date) => void;
  onNextMonthClick: (d: Date) => void;
}

const Layout = styled(Box)({
  display: "flex",
});

const Label = styled(Box)({
  width: 88,
});

export default function CalendarNavigation({
  currentDate,
  onPreviousMonthClick,
  onNextMonthClick,
}: CalendarNavigationProps) {
  const handlePreviousMonthClick = () => {
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    onPreviousMonthClick(previousMonth);
  };

  const handleNextMonthClick = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    onNextMonthClick(nextMonth);
  };

  return (
    <Layout>
      <button onClick={handlePreviousMonthClick}>
        <ArrowBackIosIcon fontSize="small" />
      </button>
      <Label>
        {currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </Label>
      <button onClick={handleNextMonthClick}>
        {" "}
        <ArrowForwardIosIcon fontSize="small" />
      </button>
    </Layout>
  );
}
