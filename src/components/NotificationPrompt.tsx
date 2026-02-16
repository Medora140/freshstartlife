import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { MOTIVATION_QUOTES } from "@/lib/freshstart-data";

const NotificationPrompt = () => {
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
    
    // Show prompt after 3 seconds if not granted/denied
    if (Notification.permission === "default") {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      scheduleReminders();
    }
    setShow(false);
  };

  if (!show || permission !== "default") return null;

  return (
    <div className="glass-card p-4 animate-fade-up">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <p className="font-semibold text-sm text-foreground">Enable daily reminders?</p>
          <p className="text-xs text-muted-foreground">
            Get gentle check-in reminders and motivational messages to keep you on track.
          </p>
          <div className="flex gap-2">
            <button
              onClick={requestPermission}
              className="px-4 py-2 rounded-xl gradient-hero text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all"
            >
              Enable
            </button>
            <button
              onClick={() => setShow(false)}
              className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-all"
            >
              Not now
            </button>
          </div>
        </div>
        <button onClick={() => setShow(false)} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export function scheduleReminders() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  // Check-in reminder — schedule for later today or next opening
  const lastReminder = localStorage.getItem("freshstart-last-reminder");
  const today = new Date().toISOString().split("T")[0];

  if (lastReminder !== today) {
    localStorage.setItem("freshstart-last-reminder", today);

    // Show a motivational notification when app is opened
    const quote = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
    
    setTimeout(() => {
      new Notification("🌿 FreshStart Daily Reminder", {
        body: `"${quote.text}" — ${quote.author}`,
        icon: "/pwa-icon-512.png",
        badge: "/pwa-icon-512.png",
        tag: "daily-motivation",
      });
    }, 2000);

    // Check-in reminder after 8 hours if still in app
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("✅ Time to check in!", {
          body: "How was your day? Take a moment to log your daily check-in.",
          icon: "/pwa-icon-512.png",
          badge: "/pwa-icon-512.png",
          tag: "daily-checkin",
        });
      }
    }, 8 * 60 * 60 * 1000);
  }
}

export default NotificationPrompt;
