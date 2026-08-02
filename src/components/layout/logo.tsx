import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex shrink-0 items-center", className)}>
      <Image
        src="/images/logo/logos.png"
        alt="Albimaq, Lda."
        width={1567}
        height={631}
        priority
        className="h-10 w-auto sm:h-11"
      />
    </Link>
  );
}
