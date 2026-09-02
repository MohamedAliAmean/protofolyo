import { MarkAdminSeen } from "@/components/admin/MarkAdminSeen";
import { requireAdmin } from "@/lib/admin-auth";
import { getConversationMessages, listConversations } from "@/lib/chat";
import { AdminMessagesClient } from "@/components/admin/AdminMessagesClient";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const conversations = await listConversations();
  const selectedId = params.id ?? conversations[0]?.id ?? null;

  const initialMessages = selectedId
    ? (await getConversationMessages(selectedId)).messages
    : [];

  return (
    <div>
      <MarkAdminSeen target="messages" />
      <h1 className="font-display text-3xl font-bold text-navy-deep">Messages</h1>
      <p className="mt-2 text-ink-muted">
        Reply to visitors who message you from the portfolio chat.
      </p>

      <div className="mt-8">
        <AdminMessagesClient
          conversations={conversations}
          initialConversationId={selectedId}
          initialMessages={initialMessages}
        />
      </div>
    </div>
  );
}
