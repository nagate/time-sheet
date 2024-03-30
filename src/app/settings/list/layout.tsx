"use client";
import NormalLayout from "@/components/organisms/layouts/nomalLayout";
import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <NormalLayout title={"設定"}>{children}</NormalLayout>;
}
