"use client";
import React, { ReactNode } from "react";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import NormalAppBar from "../appBars/nomalAppBar";
import NormalBottomNavigation from "../bottomNavigations/nomalBottomNavigation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// グローバルなスタイルやテーマ設定を行う
const theme = createTheme();

const StyledContainer = styled(Container)({
  backgroundColor: "#fff",
  minHeight: "100vh",
});

export default function NormalLayout({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NormalAppBar title={title}></NormalAppBar>
      <StyledContainer maxWidth="lg">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {children}
        </LocalizationProvider>
        {/* {children} */}
        <NormalBottomNavigation></NormalBottomNavigation>
      </StyledContainer>
    </ThemeProvider>
  );
}
