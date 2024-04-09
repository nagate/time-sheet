"use client";

import NormalLayout from "@/components/organisms/layouts/nomalLayout";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const title = dayjs(id, "YYYYMMDD").format("YYYY年M月DD日");

  return <NormalLayout title={title}>{children}</NormalLayout>;
}
