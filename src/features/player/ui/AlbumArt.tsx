"use client";

import Image from "next/image";
import { cx } from "@/shared/lib/cx";

const AlbumArt = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  return (
    <span className={cx("relative block overflow-hidden bg-neutral-200", className)}>
      <Image src={src} alt={alt} fill sizes="(max-width: 640px) 90px, 140px" className="object-cover" />
    </span>
  );
};

export default AlbumArt;
