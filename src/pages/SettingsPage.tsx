import { useState } from "react";
import { Moon, Sun, Volume2, VolumeX, Smartphone, Trash2, Palette } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [sound, setSound] = useState(() => localStorage.getItem("calc-sound") !== "off");
  const [vibration, setVibration] = useState(() => localStorage.getItem("calc-vibration") !== "off");

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    localStorage.setItem("calc-sound", next ? "on" : "off");
  };

  const toggleVibration = () => {
    const next = !vibration;
    setVibration(next);
    localStorage.setItem("calc-vibration", next ? "on" : "off");
  };

  const clearHistory = () => {
    localStorage.removeItem("calc-history");
    toast.success("History cleared!");
  };

  return (
    <div className="max-w-lg mx-auto pb-24">
      <PageHeader title="Settings" subtitle="Customize your calculator" />

      <div className="px-5 space-y-2">
        <SettingItem
          icon={theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          label="Dark Mode"
          description={theme === "dark" ? "Currently dark" : "Currently light"}
          toggle
          checked={theme === "dark"}
          onToggle={toggle}
        />
        <SettingItem
          icon={sound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          label="Sound"
          description="Button press sounds"
          toggle
          checked={sound}
          onToggle={toggleSound}
        />
        <SettingItem
          icon={<Smartphone className="w-5 h-5" />}
          label="Vibration"
          description="Haptic feedback"
          toggle
          checked={vibration}
          onToggle={toggleVibration}
        />
        <SettingItem
          icon={<Trash2 className="w-5 h-5" />}
          label="Clear History"
          description="Remove all saved calculations"
          onClick={clearHistory}
        />
        <SettingItem
          icon={<Palette className="w-5 h-5" />}
          label="App Theme"
          description="Orange accent"
          disabled
        />
      </div>

      <div className="px-5 mt-8 text-center">
        <p className="text-xs text-muted-foreground">CalcPro v1.0</p>
        <p className="text-xs text-muted-foreground">Made with ❤️</p>
      </div>
    </div>
  );
}

function SettingItem({ icon, label, description, toggle, checked, onToggle, onClick, disabled }: {
  icon: React.ReactNode; label: string; description: string;
  toggle?: boolean; checked?: boolean; onToggle?: () => void;
  onClick?: () => void; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick || onToggle}
      disabled={disabled}
      className="w-full flex items-center gap-4 bg-card rounded-2xl border border-border p-4 btn-bounce text-left disabled:opacity-50"
    >
      <div className="p-2.5 rounded-xl bg-secondary text-foreground">{icon}</div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {toggle && (
        <div className={`w-11 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-secondary"} relative`}>
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${checked ? "translate-x-5.5 left-0.5" : "left-0.5"}`}
            style={{ transform: checked ? "translateX(22px)" : "translateX(0)" }}
          />
        </div>
      )}
    </button>
  );
}
