"use client";

import { Suspense, type ReactNode } from "react";
import { Navbar } from "@/shared/Navbar";
import { Footer } from "@/shared/Footer";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <Suspense>
        <main className="flex-1">{children}</main>
      </Suspense>
      <Footer />
    </>
  );
}
