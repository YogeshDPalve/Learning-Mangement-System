import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";

// -------------------------------------------------------------------------
const Navbar = () => {
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const user = true;

  const logOutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess]);
  return (
    <div className=" h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 left-0 right-0 duration-300 z-10">
      {/* // ! Desktop */}
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
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 mr-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to={"my-learning"}>My Learning</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to={"profile"}> Edit Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logOutHandler}>
                  Log out{" "}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
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
      {/* //! Mobile navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className=" font-extrabold tracking-wider text-2xl">E-Learning</h1>
        <MobileNavbar />
      </div>
    </div>
  );
};

export default Navbar;

// --------------------------------------------------------------------------
const MobileNavbar = () => {
  const role = "instructor";
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className=" rounded-full bg-gray-200 hover:bg-gray-400"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col ">
        <SheetHeader className="flex flex-row  items-center justify-between mt-2">
          <SheetTitle>E-Learning</SheetTitle>
          <DarkMode />
        </SheetHeader>
        <DropdownMenuSeparator />
        <nav className="flex flex-col space-y-4">
          <span>My Learning</span>
          <span>Edit Profile</span>
          <p>Log out</p>
        </nav>
        {role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button className="mt-5" type="submit">
                Dashboard
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
