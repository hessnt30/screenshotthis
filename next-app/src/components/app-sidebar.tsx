"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  CalendarPlus,
  Camera,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  HomeIcon,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "./theme-switcher";
import { useAuth } from "@/context/auth-context";
import { useLoading } from "@/context/loading-context";
import Login from "./google-login";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Feed",
      url: "#",
      icon: Home,
    },
    {
      title: "Daily Challenge",
      url: "#",
      icon: CalendarPlus,
    },
  ],
};

interface NavUserObject {
  user: {
    name: string | undefined;
    email: string | undefined;
    avatar: string | undefined;
  };
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const { isLoading, setIsLoading } = useLoading();

  const userHolder = {
    user: {
      name: "unknown",
      email: "unknown@example.com",
      avatar: "unknown",
    },
  };

  const [userObject, setUserObject] = useState<NavUserObject>(userHolder);

  useEffect(() => {
    const setNavUserObject = () => {
      if (user) {
        const navUserObj: NavUserObject = {
          user: {
            name: user.displayName || "",
            email: user.email || "",
            avatar: user.photoURL || "",
          },
        };
        setUserObject(navUserObj);
      }

      // console.log("NavUserObject being set:", navUserObj);
    };

    setNavUserObject();
  }, [user]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Camera className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">ScreenshotThis</span>
            <span className="truncate text-xs">Share your Screenshots!</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenuButton tooltip={"Feed"}>
          <HomeIcon /> <span>Feed</span>
        </SidebarMenuButton>
        <SidebarMenuButton tooltip={"Daily Challenge"}>
          <CalendarPlus /> <span>Daily Challenge</span>
        </SidebarMenuButton>
      </SidebarContent>
      <SidebarFooter>
        <ThemeSwitcher />
        {user ? <NavUser user={userObject?.user} /> : <Login />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
