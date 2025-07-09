import StudioLayout from "@/modules/Studio/layouts/StudioLayout";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return <StudioLayout>{children}</StudioLayout>;
}
