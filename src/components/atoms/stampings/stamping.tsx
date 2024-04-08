"use client";

import datetimeUtil from "@/utils/datetime";
import { Box, BoxProps, Button, ButtonProps, styled } from "@mui/material";
import React, { MouseEventHandler, ReactNode } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { CONSTANTS } from "@/constants/constants";

const StyledBox = styled(Box)<BoxProps>({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  // // backgroundColor: purple[500],
  // "&:hover": {
  //   backgroundColor: purple[700],
  // },
  minWidth: 160,
  minHeight: 80,
  fontSize: "2rem",
  "& .MuiButton-startIcon>*:nth-of-type(1)": {
    fontSize: 40,
  },
}));

const Label = styled(Box)({
  fontSize: 24,
});

export default function Stamping({
  date,
  text,
  editable = false,
  onClick,
  onClickEdit = () => {},
  startIcon,
  className,
}: {
  date: Date | null;
  text: string;
  editable?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  onClickEdit?: () => void;
  startIcon: ReactNode;
  className?: string;
}) {
  const handleClickEdit = () => {
    console.log("handleClickEdit");
    onClickEdit();
  };

  const getButton = (date: Date | null) => {
    const isEdit = date !== null;
    const disabled = date !== null;

    if (editable && isEdit) {
      return (
        <ColorButton
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={handleClickEdit}
        >
          編集
        </ColorButton>
      );
    }
    return (
      <ColorButton
        variant="outlined"
        startIcon={startIcon}
        disabled={disabled}
        onClick={onClick}
      >
        {text}
      </ColorButton>
    );
  };

  return (
    <StyledBox className={className}>
      {getButton(date)}
      <Label>
        {date
          ? datetimeUtil.getFormattedDatetime({ date, format: "HH:mm" })
          : CONSTANTS.INIT_TIME_DISPLAY}
      </Label>
    </StyledBox>
  );
}
