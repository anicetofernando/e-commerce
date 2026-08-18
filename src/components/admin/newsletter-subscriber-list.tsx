"use client";

import { useTransition } from "react";
import { Trash2, Mail } from "lucide-react";
import { deleteNewsletterSubscriber } from "@/actions/newsletter";
import { formatDateTime } from "@/lib/utils";

type Subscriber = { id: string; email: string; createdAt: Date };

export function NewsletterSubscriberList({ subscribers }: { subscribers: Subscriber[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
      {subscribers.map((s) => (
        <div key={s.id} className="flex items-center justify-between gap-3 border-t border-ink-50 px-5 py-3.5 first:border-t-0">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
              <Mail size={16} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-ink-900">{s.email}</p>
              <p className="text-xs text-ink-400">Subscrito em {formatDateTime(s.createdAt)}</p>
            </div>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (confirm("Remover este subscritor?")) startTransition(() => deleteNewsletterSubscriber(s.id));
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      {subscribers.length === 0 && <p className="py-10 text-center text-sm text-ink-500">Ainda não há subscritores.</p>}
    </div>
  );
}
