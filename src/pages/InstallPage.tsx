import { useState, useEffect } from "react";
import { Download, Share, Check, Smartphone } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || installed) {
    return (
      <div className="max-w-lg mx-auto pb-24">
        <PageHeader title="Installed!" subtitle="CalcPro is ready" />
        <div className="px-5 flex flex-col items-center py-16">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-success" />
          </div>
          <p className="text-lg font-semibold text-foreground">App Installed ✅</p>
          <p className="text-sm text-muted-foreground mt-2 text-center">CalcPro aapke phone pe install ho chuka hai. Home screen se open karo!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-24">
      <PageHeader title="Install App" subtitle="Phone pe install karo" />

      <div className="px-5 space-y-4">
        {/* App Card */}
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">CalcPro</h2>
          <p className="text-sm text-muted-foreground mt-1">Smart Calculator • Currency • Units</p>
          <p className="text-xs text-muted-foreground mt-3">📱 App install karo — offline bhi chalega, fast open hoga!</p>
        </div>

        {/* Install Button (Android/Desktop) */}
        {deferredPrompt && (
          <button
            onClick={handleInstall}
            className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 rounded-2xl font-semibold text-lg btn-bounce shadow-lg"
          >
            <Download className="w-6 h-6" />
            Install App
          </button>
        )}

        {/* iOS Instructions */}
        {isIOS && !deferredPrompt && (
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Share className="w-5 h-5 text-primary" />
              iPhone pe kaise install karein?
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1️⃣ Safari browser mein ye page kholo</p>
              <p>2️⃣ Neeche <strong>Share</strong> button (📤) dabao</p>
              <p>3️⃣ <strong>"Add to Home Screen"</strong> select karo</p>
              <p>4️⃣ <strong>"Add"</strong> dabao — Done! ✅</p>
            </div>
          </div>
        )}

        {/* Generic Instructions */}
        {!deferredPrompt && !isIOS && (
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Kaise install karein?
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1️⃣ Chrome/Edge browser mein ye page kholo</p>
              <p>2️⃣ Browser menu (⋮) dabao</p>
              <p>3️⃣ <strong>"Install app"</strong> ya <strong>"Add to Home Screen"</strong> select karo</p>
              <p>4️⃣ Install karo — Done! ✅</p>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-3">Install ke baad milega:</p>
          <div className="space-y-2">
            {[
              "⚡ Instant open — browser se tez",
              "📴 Offline bhi chalega",
              "🏠 Home screen pe app icon",
              "📱 Full screen — browser bar nahi dikhega",
            ].map((f) => (
              <p key={f} className="text-sm text-foreground">{f}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
