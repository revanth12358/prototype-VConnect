import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RestrictedContact = {
  id: string;
  contact_name: string;
};

const RestrictedContacts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<RestrictedContact[]>([]);
  const [newName, setNewName] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("restricted_contacts")
        .select("id, contact_name")
        .eq("user_id", user.id);
      if (data) setContacts(data);
    };
    fetch();
  }, [user]);

  const addContact = async () => {
    if (!user || !newName.trim()) return;
    const { data, error } = await supabase
      .from("restricted_contacts")
      .insert({ user_id: user.id, contact_name: newName.trim() })
      .select()
      .single();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    if (data) setContacts([...contacts, data]);
    setNewName("");
    setShowInput(false);
  };

  const removeContact = async (id: string) => {
    await supabase.from("restricted_contacts").delete().eq("id", id);
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Restricted Contacts
        </span>
        <button
          onClick={() => setShowInput(!showInput)}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <UserPlus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {showInput && (
        <div className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Contact name"
            className="text-sm h-8"
            onKeyDown={(e) => e.key === "Enter" && addContact()}
          />
          <Button size="sm" onClick={addContact} className="h-8">Add</Button>
        </div>
      )}
      {contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-2">No contacts restricted</p>
      ) : (
        <div className="space-y-1">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2">
              <span className="text-sm">{c.contact_name}</span>
              <button onClick={() => removeContact(c.id)} className="text-muted-foreground hover:text-destructive">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestrictedContacts;
