export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender: "visitor" | "admin";
  content: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  visitor_session: string;
  visitor_name: string | null;
  visitor_email: string | null;
  last_message_at: string;
  created_at: string;
};

export type ConversationWithPreview = Conversation & {
  last_message?: string;
  message_count?: number;
};
