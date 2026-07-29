import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  const image = (
    <Image
      src="/images/logo/logos.png"
      alt="Albimaq, Lda."
      width={1567}
      height={631}
      priority
      className="h-10 w-auto sm:h-11"
    />
  );

  return (
    <Link href="/" className={cn("flex shrink-0 items-center", className)}>
      {dark ? (
        <span className="rounded-lg bg-white px-3 py-2 shadow-sm">{image}</span>
      ) : (
        image
      )}
    </Link>
  );
}
