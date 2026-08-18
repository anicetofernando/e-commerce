"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Trash2, Mail, MailOpen } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { markMessageRead, deleteMessage } from "@/actions/admin-messages";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export function MessageRow({ message }: { message: Message }) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className={cn("rounded-xl border bg-white", message.isRead ? "border-ink-100" : "border-brand-200 bg-brand-50/20")}>
      <button type="button" onClick={() => setExpanded((v) => !v)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {!message.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600" />}
            <p className={cn("truncate", message.isRead ? "font-medium text-ink-700" : "font-bold text-ink-900")}>{message.subject}</p>
          </div>
          <p className="mt-0.5 truncate text-sm text-ink-500">
            {message.name} · {message.email}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs text-ink-400">{formatDateTime(message.createdAt)}</span>
          {expanded ? <ChevronUp size={16} className="text-ink-400" /> : <ChevronDown size={16} className="text-ink-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-ink-100 px-5 py-4">
          <p className="text-sm whitespace-pre-wrap text-ink-700">{message.message}</p>
          {message.phone && <p className="mt-3 text-sm text-ink-500">Telefone: {message.phone}</p>}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => startTransition(() => markMessageRead(message.id, !message.isRead))}
              className="flex items-center gap-1.5 rounded-md border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-50"
            >
              {message.isRead ? <Mail size={14} /> : <MailOpen size={14} />}
              {message.isRead ? "Marcar como não lida" : "Marcar como lida"}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (confirm("Eliminar esta mensagem?")) {
                  startTransition(() => deleteMessage(message.id));
                }
              }}
              className="flex items-center gap-1.5 rounded-md border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              <Trash2 size={14} /> Eliminar
            </button>
            <a
              href={`mailto:${message.email}`}
              className="ml-auto text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Responder por email →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
