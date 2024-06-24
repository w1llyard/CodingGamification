"use client";

import React, { useState } from "react";
import "./globals.css";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/cn";
import SideNavbar from "@/Components/Dashboard/SideNavbar";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/contexts/authContext";
import { UserProvider } from "@/contexts/userDataContext";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  const pathname = usePathname();
  const isGame = pathname && pathname.startsWith("/Game");
  const isLow = pathname && pathname.startsWith("/LowcodeGame");

  return (
    <body>
      <AuthProvider>
        <UserProvider>
          <NextUIProvider>
            {isGame ? (
              <div className={cn('flex min-h-screen w-full bg-bgGame  text-white ')}>
                {/* sidebar */}
                <SideNavbar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
                {/* main page */}
                <div className={`px-8 w-full ml-[80px]  bg-bgGame  `}>
                  {children}
                </div>
              </div>
            ) : isLow ? (
              <div className={cn('flex min-h-screen w-full bg-bgGame  text-white ')}>
                {children}
              </div>
            ) :
              (
                <div className="min-h-screen w-full bg-custom-bg bg-cover bg-center ">
                  {children}
                </div>
              )}
          </NextUIProvider>
        </UserProvider>
      </AuthProvider>
    </body>
  );
}
