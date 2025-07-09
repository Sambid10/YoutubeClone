"use client";
import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { Dialog, DialogContent, DialogHeader,DialogTitle } from "../ui/dialog";


interface Props {
  children: React.ReactNode;
  open: boolean;
  title: string;
  openChange: (open: boolean) => void;
}

export default function ResponsiveDialog({
  children,
  open,
  openChange,
  title
}: Props) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={openChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center font-semibold">{title}</DrawerTitle>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-semibold -mt-1">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
