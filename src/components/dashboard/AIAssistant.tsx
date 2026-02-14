import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useState } from "react";

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setResult("AI analysis coming soon — this feature will analyze tone, intent, and suggest improvements for your messages.");
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Message Clarity Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          AI will analyze tone, intent, and suggest improvements
        </p>
        <Textarea
          placeholder="Paste a message to analyze..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
        />
        <Button onClick={handleAnalyze} className="w-full gap-2">
          <Sparkles className="h-4 w-4" /> Analyze
        </Button>
        {result && (
          <div className="bg-accent/50 rounded-lg p-3">
            <p className="text-sm">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
