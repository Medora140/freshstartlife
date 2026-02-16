import { useState } from "react";
import { Phone, X, Heart, MessageCircle, Globe, ChevronDown, ChevronUp } from "lucide-react";

const HOTLINES = [
  { name: "SAMHSA Helpline", number: "1-800-662-4357", description: "Free 24/7 substance abuse & mental health referral", emoji: "🇺🇸" },
  { name: "Crisis Text Line", number: "Text HOME to 741741", description: "Free 24/7 crisis counseling via text", emoji: "💬" },
  { name: "988 Suicide & Crisis Lifeline", number: "988", description: "Call or text 24/7 for emotional distress", emoji: "🆘" },
  { name: "Alcoholics Anonymous", number: "1-212-870-3400", description: "AA general service office", emoji: "🍷" },
  { name: "Narcotics Anonymous", number: "1-818-773-9999", description: "NA world services helpline", emoji: "💊" },
];

const COPING_STRATEGIES = [
  { title: "5-4-3-2-1 Grounding", instruction: "Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste.", emoji: "🧠" },
  { title: "Cold Water Reset", instruction: "Splash cold water on your face or hold ice cubes. It activates your dive reflex and calms your nervous system.", emoji: "🧊" },
  { title: "Move Your Body", instruction: "Do 20 jumping jacks, push-ups, or run in place for 60 seconds. Physical motion breaks the mental loop.", emoji: "🏃" },
  { title: "Call Someone Now", instruction: "Call a friend, family member, or sponsor. You don't have to do this alone. Even a 2-minute conversation helps.", emoji: "📞" },
  { title: "Write It Out", instruction: "Grab paper and write exactly what you're feeling. No filter. Getting it out of your head takes away its power.", emoji: "✍️" },
  { title: "Change Your Environment", instruction: "Leave the room. Go outside. Walk to a different space. A change of scenery disrupts the craving cycle.", emoji: "🚶" },
];

interface EmergencySupportProps {
  onClose: () => void;
}

const EmergencySupport = ({ onClose }: EmergencySupportProps) => {
  const [showAllHotlines, setShowAllHotlines] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto bg-foreground/40 backdrop-blur-sm">
      <div className="glass-card w-full max-w-sm p-6 space-y-5 animate-fade-up mb-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-destructive" />
            <h3 className="text-xl font-serif text-foreground">Emergency Support</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          You are not alone. Help is available right now.
        </p>

        {/* Hotlines */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-destructive">
            <Phone className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Crisis Hotlines</span>
          </div>

          {(showAllHotlines ? HOTLINES : HOTLINES.slice(0, 3)).map((h, i) => (
            <a
              key={i}
              href={h.number.startsWith("Text") ? undefined : `tel:${h.number.replace(/[^0-9]/g, "")}`}
              className="block glass-card p-3 hover:shadow-glow transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{h.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-foreground">{h.name}</div>
                  <div className="text-sm text-primary font-semibold">{h.number}</div>
                  <div className="text-xs text-muted-foreground">{h.description}</div>
                </div>
              </div>
            </a>
          ))}

          <button
            onClick={() => setShowAllHotlines(!showAllHotlines)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
          >
            {showAllHotlines ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showAllHotlines ? "Show less" : `Show ${HOTLINES.length - 3} more`}
          </button>
        </div>

        {/* Coping strategies */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Instant Coping Strategies</span>
          </div>

          {COPING_STRATEGIES.map((s, i) => (
            <div key={i} className="glass-card p-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{s.emoji}</span>
                <span className="font-semibold text-sm text-foreground">{s.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-8">{s.instruction}</p>
            </div>
          ))}
        </div>

        {/* Global resources */}
        <div className="glass-card p-4 border-dashed">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">International</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Find your local crisis line at{" "}
            <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
              findahelpline.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencySupport;
