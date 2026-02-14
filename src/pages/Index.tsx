import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import StressMonitor from "@/components/dashboard/StressMonitor";
import BusyMode from "@/components/dashboard/BusyMode";
import RestrictedContacts from "@/components/dashboard/RestrictedContacts";
import RecentMessages from "@/components/dashboard/RecentMessages";
import ConnectApps from "@/components/dashboard/ConnectApps";
import AIAssistant from "@/components/dashboard/AIAssistant";
import TrustedContactAlerts from "@/components/dashboard/TrustedContactAlerts";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor your stress, manage communications, and send mindful messages.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <StressMonitor />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <BusyMode />
            <div className="bg-card border border-border rounded-lg p-5 space-y-4">
              <RestrictedContacts />
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <RecentMessages />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <ConnectApps />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <AIAssistant />
          <TrustedContactAlerts />
        </div>
      </main>
    </div>
  );
};

export default Index;
