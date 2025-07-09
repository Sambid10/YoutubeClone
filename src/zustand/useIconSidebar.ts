"use client"; // if you're using Next.js

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
  openSideBar: "main" | "icon";
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      openSideBar: "main",
      toggleSidebar: () => {
        const current = get().openSideBar;
        set({
          openSideBar: current === "main" ? "icon" : "main",
        });
      },
    }),
    {
      name: "sidebar",
      skipHydration: true,
    }
  )
);
