"use client";
import NormalLayout from "@/components/organisms/layouts/nomalLayout";
import { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <NormalLayout title={""}>{children}</NormalLayout>;
}
