"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import {
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Share2,
  UploadCloud,
} from "lucide-react";

const navItems = [
  {
    href: "/home",
    label: "Home Page",
    icon: LayoutDashboard,
  },
  {
    href: "/social-share",
    label: "Social Share",
    icon: Share2,
  },
  {
    href: "/video-upload",
    label: "Video Upload",
    icon: UploadCloud,
  },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="drawer lg:drawer-open">
        <input id="app-sidebar" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/90 backdrop-blur">
            <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="app-sidebar"
                  className="btn btn-ghost btn-square lg:hidden"
                  aria-label="Open navigation"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </label>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  MediaDock
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <UserButton />
                <span className="hidden max-w-56 truncate text-sm font-medium text-base-content/70 sm:block">
                  {user?.primaryEmailAddress?.emailAddress || "Signed in"}
                </span>
                <SignOutButton>
                  <button
                    type="button"
                    className="btn btn-ghost btn-square"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </SignOutButton>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
        </div>

        <aside className="drawer-side z-40">
          <label
            htmlFor="app-sidebar"
            aria-label="Close navigation"
            className="drawer-overlay"
          />
          <div className="flex min-h-full w-72 flex-col border-r border-base-300 bg-base-100 p-6">
            <Link href="/home" className="mb-10 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-content shadow-lg shadow-primary/20">
                <ImageIcon className="h-7 w-7" />
              </span>
              <span className="text-lg font-bold">Cloudinary</span>
            </Link>

            <nav className="flex flex-1 flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`btn h-12 justify-start rounded-lg border-0 ${
                      isActive
                        ? "btn-primary shadow-lg shadow-primary/20"
                        : "btn-ghost text-base-content/70 hover:bg-base-200"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="rounded-lg border border-base-300 bg-base-200 p-4">
              <p className="text-sm font-semibold">Media workspace</p>
              <p className="mt-1 text-xs text-base-content/60">
                Manage uploads, social crops, and optimized video exports.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
