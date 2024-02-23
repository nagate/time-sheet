"use client";
import React from "react";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/system";

// グローバルなスタイルやテーマ設定を行う
const theme = createTheme();

const StyledContainer = styled(Container)({
  backgroundColor: "#fff", // 背景色を白に設定
  minHeight: "100vh",
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledContainer maxWidth="lg">{children}</StyledContainer>
    </ThemeProvider>
  );
}
