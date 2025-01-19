import { School } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
const Navbar = () => {
  const user = false;
  return (
    <div className=" h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="w-[90%]   max-w-7xl mx-auto hidden  md:flex justify-between items-center gap-10 h-full">
        <div className=" flex items-center gap-2 text-gray-700">
          <School size={"30"} />
          <h1 className="hidden md:block font-extrabold text-2xl font-body">
            E-Learning
          </h1>
        </div>
        <div className=" flex gap-5">
          {/* user icon and dark mode icon */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTr igger asChild>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTr>
              <DropdownMenuContent className="w-52 mr-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>My Learning</DropdownMenuItem>
                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className=" flex gap-2 ">
              <Button variant="outline">Login</Button>
              <Button>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
