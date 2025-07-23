import TabsSection from "@/components/TabsSection";
import { BookOpen, Calendar, Shield } from "lucide-react";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Resource Booking System</h1>
              <p className="text-muted-foreground">
                Book shared resources with intelligent conflict detection
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              10-minute buffer protection
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Real-time conflict detection
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Smart scheduling
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <TabsSection />

      {/* Footer */}
      <div className="border-t bg-background/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Built with conflict detection and 10-minute buffer logic
          </p>
        </div>
      </div>
    </div>
  );
}
