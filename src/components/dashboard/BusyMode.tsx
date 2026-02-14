import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Moon, Pencil } from "lucide-react";

const BusyMode = () => {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [template, setTemplate] = useState(
    "I'm taking some time for myself right now. I'll get back to you when I'm ready."
  );
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("busy_mode_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setEnabled(data.enabled);
        if (data.auto_reply_template) setTemplate(data.auto_reply_template);
      }
    };
    fetch();
  }, [user]);

  const toggleBusy = async (val: boolean) => {
    setEnabled(val);
    if (!user) return;
    await supabase
      .from("busy_mode_settings")
      .update({ enabled: val })
      .eq("user_id", user.id);
  };

  const saveTemplate = async () => {
    setEditing(false);
    if (!user) return;
    await supabase
      .from("busy_mode_settings")
      .update({ auto_reply_template: template })
      .eq("user_id", user.id);
  };

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <Moon className="h-5 w-5 text-primary" />
          Busy Mode
        </CardTitle>
        <Switch checked={enabled} onCheckedChange={toggleBusy} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Auto-Reply Template
            </span>
            <button onClick={() => editing ? saveTemplate() : setEditing(true)} className="text-muted-foreground hover:text-primary transition-colors">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          {editing ? (
            <Textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              onBlur={saveTemplate}
              className="text-sm italic"
              rows={3}
            />
          ) : (
            <div className="bg-accent/50 rounded-lg p-3">
              <p className="text-sm italic text-foreground">&ldquo;{template}&rdquo;</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusyMode;
