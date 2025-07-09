import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StudiSidebarProps {
  studioSidebar: "icon" | "fullmenu";
  setstudioSidebar: () => void;
}

export const useStudioSidebarStore = create<StudiSidebarProps>()(
  persist(
    (set, get) => ({
      studioSidebar: "icon",
      setstudioSidebar: () => {
        const current = get().studioSidebar;
        set({
          studioSidebar: current === "fullmenu" ? "icon" : "fullmenu",
        });
      },
    }),
    {
      name: "studio-sidebar", // localStorage key
    }
  )
);
