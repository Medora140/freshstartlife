import { useState, useEffect } from "react";
import { Download, X, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSTip, setShowIOSTip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    if (sessionStorage.getItem("freshstart-install-dismissed")) {
      setDismissed(true);
      return;
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isIOS && !isStandalone) {
      setTimeout(() => setShowIOSTip(true), 5000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
    dismiss();
  };

  const dismiss = () => {
    setDismissed(true);
    setShowIOSTip(false);
    sessionStorage.setItem("freshstart-install-dismissed", "true");
  };

  if (dismissed) return null;

  // Android / Desktop install prompt
  if (deferredPrompt) {
    return (
      <div className="glass-card p-4 animate-fade-up">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <p className="font-semibold text-sm text-foreground">Install FreshStart</p>
            <p className="text-xs text-muted-foreground">
              Add to your home screen for quick access, offline support, and a native app experience.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="px-4 py-2 rounded-xl gradient-warm text-accent-foreground text-xs font-semibold hover:opacity-90 transition-all"
              >
                Install
              </button>
              <button
                onClick={dismiss}
                className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-all"
              >
                Not now
              </button>
            </div>
          </div>
          <button onClick={dismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // iOS install tip
  if (showIOSTip) {
    return (
      <div className="glass-card p-4 animate-fade-up">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center shrink-0">
            <Share className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="font-semibold text-sm text-foreground">Install FreshStart</p>
            <p className="text-xs text-muted-foreground">
              Tap the <strong>Share</strong> button in Safari, then <strong>"Add to Home Screen"</strong> for the best experience.
            </p>
          </div>
          <button onClick={dismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default InstallPrompt;
