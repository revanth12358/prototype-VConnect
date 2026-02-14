import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Message = {
  id: string;
  sender_name: string;
  content: string;
  is_auto_reply: boolean;
  is_outgoing: boolean;
  sent_at: string;
};

const RecentMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", user.id)
        .order("sent_at", { ascending: false })
        .limit(10);
      if (data) setMessages(data);
    };
    fetch();
  }, [user]);

  // Seed demo data if empty
  useEffect(() => {
    if (!user || messages.length > 0) return;
    const seed = async () => {
      const demoMessages = [
        { user_id: user.id, sender_name: "Priya Patel", content: "Hey, are you free to chat?", is_outgoing: false, is_auto_reply: false },
        { user_id: user.id, sender_name: "You", content: "I'm taking some time for myself right now. I'll get back to you soon!", is_outgoing: true, is_auto_reply: true },
        { user_id: user.id, sender_name: "Maria Garcia", content: "Can we discuss the project?", is_outgoing: false, is_auto_reply: false },
        { user_id: user.id, sender_name: "You", content: "I'm in focus mode at the moment. Will reply when available.", is_outgoing: true, is_auto_reply: true },
        { user_id: user.id, sender_name: "David Kim", content: "Just checking in!", is_outgoing: false, is_auto_reply: false },
      ];
      const { data } = await supabase.from("messages").insert(demoMessages).select();
      if (data) setMessages(data);
    };
    seed();
  }, [user, messages.length]);

  return (
    <div className="space-y-3">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Recent Messages
      </span>
      <div className="space-y-1">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
            <MessageCircle className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{msg.sender_name}</span>
                {msg.is_auto_reply && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Auto</Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto shrink-0">
                  {formatDistanceToNow(new Date(msg.sent_at), { addSuffix: false })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{msg.content}</p>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No messages yet</p>
        )}
      </div>
    </div>
  );
};

export default RecentMessages;
