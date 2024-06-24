/** @format */
"use client";

import { useWindowWidth } from "@react-hook/window-size";
import { Nav } from "./ui/nav";
import {
  LayoutDashboard,
  Gamepad2,
  Swords
} from "lucide-react";

type SideNavbarProps = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
};

export default function SideNavbar({ isCollapsed, toggleSidebar }: SideNavbarProps) {
  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 7680;

  return (
    <div className={`bg-navbarColors fixed top-0 left-0 h-full ${isCollapsed || mobileWidth ? "min-w-[80px]" : "min-w-[200px]"}  px-3 pb-10 pt-9`}>


      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: "Home",
            href: "/Game",
            icon: LayoutDashboard,
            variant: "ghost"
          },
          {
            title: "Explore",
            href: "/Game/levels",
            icon: Gamepad2,
            variant: "ghost"
          },
          {
            title: "Explore",
            href: "/Game/Quiz",
            icon: Swords,
            variant: "ghost"
          },

        ]}
      />
    </div>
  );
}
