"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/shared/lib/cx";

const NavButton = ({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}) => {
  return (
    <Link
      href={href}
      className={cx(
        "flex w-full items-center justify-between border-b border-mp3-border-soft px-3 py-2.5 text-left transition last:border-b-0",
        active
          ? "bg-mp3-primary text-white"
          : "bg-white text-mp3-text active:bg-mp3-primary-soft",
      )}
    >
      <span className="flex items-center gap-2">
        {icon} {label}
      </span>
      <span className={cx("text-lg leading-none", active ? "text-white" : "text-mp3-arrow")}>›</span>
    </Link>
  );
};

export default NavButton;
