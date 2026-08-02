import { ShieldCheck, Truck, Wrench } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink-900 p-10 text-white lg:flex">
        <Logo />
        <div>
          <h2 className="text-2xl font-bold">Peças que mantêm a sua obra a funcionar.</h2>
          <ul className="mt-6 space-y-4 text-sm text-ink-300">
            <li className="flex items-center gap-3">
              <Truck size={18} className="text-brand-500" /> Entrega em todo Moçambique
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-brand-500" /> Peças testadas e com garantia
            </li>
            <li className="flex items-center gap-3">
              <Wrench size={18} className="text-brand-500" /> Suporte técnico especializado
            </li>
          </ul>
        </div>
        <p className="text-xs text-ink-500">© {new Date().getFullYear()} Albimaq, Lda.</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
          <p className="mt-1.5 mb-6 text-sm text-ink-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
