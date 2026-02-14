import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link2, MessageSquare, Instagram, Phone, Send } from "lucide-react";

type AppConnection = {
  id: string;
  provider: string;
  is_connected: boolean;
  features: string[];
};

const providers = [
  { name: "WhatsApp", icon: <MessageSquare className="h-5 w-5" />, features: ["Auto-reply", "Busy mode", "Tone analysis"] },
  { name: "Instagram", icon: <Instagram className="h-5 w-5" />, features: ["Auto-reply", "Tone analysis"] },
  { name: "Messages", icon: <Phone className="h-5 w-5" />, features: ["Auto-reply", "Busy mode", "Tone analysis"] },
  { name: "Telegram", icon: <Send className="h-5 w-5" />, features: ["Auto-reply", "Busy mode"] },
];

const ConnectApps = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<AppConnection[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("app_connections")
        .select("*")
        .eq("user_id", user.id);
      if (data) {
        setConnections(data.map((d) => ({ ...d, features: (d.features as string[]) || [] })));
      }
    };
    fetch();
  }, [user]);

  // Seed default connections
  useEffect(() => {
    if (!user || connections.length > 0) return;
    const seed = async () => {
      const defaults = [
        { user_id: user.id, provider: "WhatsApp", is_connected: true, features: JSON.stringify(["Auto-reply", "Busy mode", "Tone analysis"]) },
        { user_id: user.id, provider: "Instagram", is_connected: true, features: JSON.stringify(["Auto-reply", "Tone analysis"]) },
        { user_id: user.id, provider: "Messages", is_connected: false, features: JSON.stringify(["Auto-reply", "Busy mode", "Tone analysis"]) },
        { user_id: user.id, provider: "Telegram", is_connected: false, features: JSON.stringify(["Auto-reply", "Busy mode"]) },
      ];
      const { data } = await supabase.from("app_connections").insert(defaults).select();
      if (data) setConnections(data.map((d) => ({ ...d, features: (d.features as string[]) || [] })));
    };
    seed();
  }, [user, connections.length]);

  const connectedCount = connections.filter((c) => c.is_connected).length;

  const toggleConnection = async (id: string, currentState: boolean) => {
    await supabase.from("app_connections").update({ is_connected: !currentState }).eq("id", id);
    setConnections(connections.map((c) => (c.id === id ? { ...c, is_connected: !currentState } : c)));
  };

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Connect Apps
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          {connectedCount} / {connections.length || providers.length} connected
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Link your messaging apps to enable auto-replies, busy mode, and AI tone analysis.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(connections.length > 0 ? connections : providers.map((p) => ({ id: p.name, provider: p.name, is_connected: false, features: p.features }))).map((conn) => {
            const prov = providers.find((p) => p.name === conn.provider);
            return (
              <div key={conn.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">{prov?.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{conn.provider}</span>
                      {conn.is_connected && (
                        <span className="flex items-center gap-1 text-xs text-success">
                          <span className="h-1.5 w-1.5 rounded-full bg-success" /> Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {conn.features.map((f) => (
                    <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                  ))}
                </div>
                <Button
                  variant={conn.is_connected ? "outline" : "default"}
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => toggleConnection(conn.id, conn.is_connected)}
                >
                  {conn.is_connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectApps;
