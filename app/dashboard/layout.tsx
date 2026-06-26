// "use client"

import { Metadata } from "next/dist/types";
import MainLayout from "./components/MainLayout";

export const metadata: Metadata = {
  title: "dashboard"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
      <div className=" relative min-h-screen w-full grid grid-cols-5 bg-zinc-50">

        {/* left-section */}
        <div className="left sticky top-0 left-0 w-full flex h-screen col-span-1"><MainLayout/></div>

        {/* right-section */}
        <div className="right w-full col-span-4">{children}</div>
      </div>

  );
}
