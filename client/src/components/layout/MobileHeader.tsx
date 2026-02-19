import { Menu, School } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="lg:hidden h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
          <School className="w-5 h-5" />
        </div>
        <span className="font-display font-bold text-lg">EduNexus</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
            <Menu className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
           {/* Reusing sidebar content structure but adapted for Sheet */}
           <div className="h-full overflow-y-auto">
             <Sidebar />
           </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
