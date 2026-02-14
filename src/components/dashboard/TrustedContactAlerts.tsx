import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Phone, Heart } from "lucide-react";

type TrustedContact = {
  id: string;
  contact_name: string;
  contact_email: string | null;
  alert_enabled: boolean;
  created_at: string;
};

const TrustedContactAlerts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<TrustedContact[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("trusted_contacts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setContacts(data);
    };
    fetch();
  }, [user]);

  // Seed demo trusted contacts
  useEffect(() => {
    if (!user || contacts.length > 0) return;
    const seed = async () => {
      const demos = [
        { user_id: user.id, contact_name: "Sarah Miller", contact_email: "sarah@example.com" },
        { user_id: user.id, contact_name: "James Lee", contact_email: "james@example.com" },
        { user_id: user.id, contact_name: "Alex Chen", contact_email: "alex@example.com" },
      ];
      const { data } = await supabase.from("trusted_contacts").insert(demos).select();
      if (data) setContacts(data);
    };
    seed();
  }, [user, contacts.length]);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  const alertMessages = [
    "Stress alert: High stress level detected",
    "Sent you a calm message",
    "Requested a quick check-in call",
  ];
  const timeLabels = ["Just now", "5 min ago", "15 min ago"];

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Trusted Contact Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contacts.map((contact, i) => (
          <div key={contact.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {getInitials(contact.contact_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{contact.contact_name}</span>
                <span className="text-xs text-muted-foreground">{timeLabels[i] || ""}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {alertMessages[i] || "Connected as trusted contact"}
              </p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Heart className="h-3 w-3" /> Send Calm
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Phone className="h-3 w-3" /> Quick Call
                </Button>
              </div>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No trusted contacts yet. Add some in the Contacts page.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TrustedContactAlerts;
