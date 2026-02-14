import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Wind, Thermometer, Activity, AlertTriangle } from "lucide-react";

type StressReading = {
  stress_score: number;
  heart_rate: number | null;
  hrv: number | null;
  respiratory_rate: number | null;
  skin_temp: number | null;
};

const StressMonitor = () => {
  const { user } = useAuth();
  const [reading, setReading] = useState<StressReading>({
    stress_score: 78,
    heart_rate: 99,
    hrv: 54,
    respiratory_rate: 19,
    skin_temp: 97.6,
  });

  useEffect(() => {
    if (!user) return;
    const fetchLatest = async () => {
      const { data } = await supabase
        .from("stress_readings")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .single();
      if (data) setReading(data);
    };
    fetchLatest();
  }, [user]);

  const stressLevel = reading.stress_score >= 70 ? "High" : reading.stress_score >= 40 ? "Medium" : "Low";
  const stressColor = reading.stress_score >= 70 ? "stress-high" : reading.stress_score >= 40 ? "stress-medium" : "stress-low";

  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (reading.stress_score / 100) * circumference;

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Stress Monitoring
        </CardTitle>
        <span className={`text-sm font-semibold text-${stressColor}`}>
          {stressLevel}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <svg width="120" height="120" className="transform -rotate-90">
            <circle cx="60" cy="60" r="45" fill="none" strokeWidth="8" className="stroke-muted" />
            <circle
              cx="60" cy="60" r="45" fill="none" strokeWidth="8"
              className={stressColor === "stress-high" ? "stress-ring-high" : stressColor === "stress-medium" ? "stress-ring-medium" : "stress-ring-low"}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute mt-8">
            <span className={`text-3xl font-heading font-bold text-${stressColor}`}>
              {reading.stress_score}
            </span>
            <p className="text-xs text-muted-foreground text-center">Stress Score</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricCard icon={<Heart className="h-4 w-4 text-destructive" />} label="Heart Rate" value={`${reading.heart_rate ?? '--'}`} unit="bpm" />
          <MetricCard icon={<Activity className="h-4 w-4 text-primary" />} label="HRV" value={`${reading.hrv ?? '--'}`} unit="ms" />
          <MetricCard icon={<Wind className="h-4 w-4 text-primary" />} label="Respiratory" value={`${reading.respiratory_rate ?? '--'}`} unit="/min" />
          <MetricCard icon={<Thermometer className="h-4 w-4 text-warning" />} label="Skin Temp" value={`${reading.skin_temp ?? '--'}`} unit="°F" />
        </div>

        {reading.stress_score >= 70 && (
          <div className="mt-4 flex items-center gap-2 bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">
            <AlertTriangle className="h-4 w-4" />
            Alert sent to trusted contacts!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MetricCard = ({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit: string }) => (
  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
    {icon}
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">
        {value}<span className="text-xs text-muted-foreground ml-0.5">{unit}</span>
      </p>
    </div>
  </div>
);

export default StressMonitor;
