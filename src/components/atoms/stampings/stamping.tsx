"use client";
import datetimeUtil from "@/utils/datetime";
import { Box, Button, TextField, styled } from "@mui/material";
import React, { MouseEventHandler, ReactNode } from "react";

const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

const Time = styled(Box)({
  marginRight: "8px",
});

export default function Stamping({
  date,
  text,
  onClick,
  startIcon,
}: {
  date: Date | null;
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  startIcon: ReactNode;
}) {
  const handleClickEdit = () => {
    console.log("handleClickEdit");
  };

  const getButton = (date: Date | null) => {
    const isEdit = date !== null;
    const disabled = date !== null;
    // if (isEdit) {
    //   return (
    //     <Button variant="outlined" onClick={handleClickEdit}>
    //       編集
    //     </Button>
    //   );
    // }
    return (
      <Button
        variant="outlined"
        startIcon={startIcon}
        disabled={disabled}
        onClick={onClick}
      >
        {text}
      </Button>
    );
  };

  return (
    <StyledBox>
      {/* <Time>
        {date
          ? datetimeUtil.getFormattedDatetime({ date, format: "HH:mm" })
          : "00:00"}
      </Time> */}
      <TextField
        label={text}
        value={
          date
            ? datetimeUtil.getFormattedDatetime({ date, format: "HH:mm" })
            : "00:00"
        }
        disabled
      ></TextField>
      {getButton(date)}
    </StyledBox>
  );
}
