"use client";

import { useEffect, useRef, useState } from "react";
import { replyToConversation } from "@/app/admin/actions";
import type { ChatMessage, ConversationWithPreview } from "@/lib/chat-types";

export function AdminMessagesClient({
  conversations,
  initialConversationId,
  initialMessages,
}: {
  conversations: ConversationWithPreview[];
  initialConversationId: string | null;
  initialMessages: ChatMessage[];
}) {
  const [selectedId, setSelectedId] = useState(initialConversationId);
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    async function refresh() {
      const response = await fetch(`/api/admin/chat?conversationId=${selectedId}`, {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = await response.json();
      setMessages(data.messages ?? []);
    }

    refresh();
    const interval = setInterval(refresh, 4000);
    return () => clearInterval(interval);
  }, [selectedId]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !content.trim()) return;

    setSending(true);
    const formData = new FormData();
    formData.set("conversation_id", selectedId);
    formData.set("content", content);

    try {
      await replyToConversation(formData);
      setContent("");
      const response = await fetch(`/api/admin/chat?conversationId=${selectedId}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages ?? []);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="surface-card max-h-[70vh] overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <p className="p-4 text-sm text-ink-muted">No messages yet.</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={async () => {
                setSelectedId(conv.id);
                const response = await fetch(
                  `/api/admin/chat?conversationId=${conv.id}`,
                  { cache: "no-store" },
                );
                if (response.ok) {
                  const data = await response.json();
                  setMessages(data.messages ?? []);
                }
              }}
              className={`w-full rounded-xl px-3 py-3 text-left transition ${
                selectedId === conv.id ? "bg-bg-soft" : "hover:bg-bg-soft/60"
              }`}
            >
              <p className="font-medium text-navy-deep">
                {conv.visitor_name || "Anonymous visitor"}
              </p>
              <p className="mt-1 truncate text-xs text-ink-muted">
                {conv.last_message || "No messages"}
              </p>
              <p className="mt-1 text-[0.7rem] text-ink-muted/80">
                {new Date(conv.last_message_at).toLocaleString()}
              </p>
            </button>
          ))
        )}
      </div>

      <div className="surface-card flex min-h-[420px] flex-col">
        {selected ? (
          <>
            <div className="border-b border-[var(--line)] p-4">
              <p className="font-display font-bold text-navy-deep">
                {selected.visitor_name || "Anonymous visitor"}
              </p>
              {selected.visitor_email ? (
                <p className="text-sm text-ink-muted">{selected.visitor_email}</p>
              ) : null}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.sender === "admin"
                        ? "bg-navy text-btn-fg"
                        : "border border-[var(--line)] bg-[var(--surface)]"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleReply} className="border-t border-[var(--line)] p-4">
              <div className="flex gap-2">
                <input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your reply..."
                  className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm outline-none focus:border-accent/50"
                />
                <button
                  type="submit"
                  disabled={sending || !content.trim()}
                  className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-btn-fg disabled:opacity-50"
                >
                  Reply
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-ink-muted">
            Select a conversation to reply.
          </div>
        )}
      </div>
    </div>
  );
}
