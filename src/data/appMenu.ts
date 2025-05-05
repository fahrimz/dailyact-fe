import type { Role } from "@/lib/api";

export type TAppLink = {
  href: string;
  label: string;
  roles?: Role[];
}

export const appMenu: TAppLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/activities",
    label: "Activities",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/users",
    label: "Users",
    roles: ["admin", "superadmin"],
  }
];

export const getAppMenuLink = () => {
  return appMenu.filter((x) => x.href.includes("/"));
};
