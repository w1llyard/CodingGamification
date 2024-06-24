"use client";

import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { doSignOut } from "@/firebaseConfig/auth";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/contexts/authContext";
import { useUserContext } from "@/contexts/userDataContext";

export default function Nav() {
  const router = useRouter();
  // const auth = useAuth();
  const userData = useUserContext();
  const journeyStarted = userData.journeyStarted;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      position="static"
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="bg-navbarColors rounded-xl mt-5 text-white"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>
      <NavbarBrand>
        <p className="font-semibold text-inherit">Coding Maniacs</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          {journeyStarted ? (
            <div className="button blue">
              <button
                onClick={() => {
                  router.push("/Game/scene");
                }}
              >
                Continue Coding
              </button>
            </div>
          ) : (
            <div className="button green">
              <button
                onClick={() => {
                  router.push("/Game/scene");
                }}
              >
                New Journey
              </button>
            </div>
          )}
        </NavbarItem>
        <NavbarItem>
          <div className="button red">
            <button
              onClick={() => {
                doSignOut();
                router.push("/");
              }}
            >
              Log Out
            </button>
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
