import { Cigarette, Wine, Pill, Smartphone, Gamepad2, Cookie } from "lucide-react";

export type AddictionType = "smoking" | "alcohol" | "drugs" | "social_media" | "porn_gaming" | "sugar_junk";

export interface AddictionCategory {
  id: AddictionType;
  label: string;
  icon: typeof Cigarette;
  emoji: string;
  costPerDay: number;
  unit: string;
  healthMilestones: { days: number; message: string }[];
}

export const ADDICTION_CATEGORIES: AddictionCategory[] = [
  {
    id: "smoking",
    label: "Smoking",
    icon: Cigarette,
    emoji: "🚭",
    costPerDay: 12,
    unit: "cigarettes",
    healthMilestones: [
      { days: 1, message: "Heart rate and blood pressure begin to drop" },
      { days: 3, message: "Nicotine fully leaves your body" },
      { days: 7, message: "Breathing becomes easier" },
      { days: 14, message: "Circulation improves significantly" },
      { days: 30, message: "Lung function increases up to 30%" },
      { days: 90, message: "Risk of heart attack starts decreasing" },
      { days: 365, message: "Risk of heart disease is halved" },
    ],
  },
  {
    id: "alcohol",
    label: "Alcohol",
    icon: Wine,
    emoji: "🍷",
    costPerDay: 15,
    unit: "drinks",
    healthMilestones: [
      { days: 1, message: "Blood sugar levels stabilize" },
      { days: 3, message: "Detox symptoms peak and begin fading" },
      { days: 7, message: "Sleep quality dramatically improves" },
      { days: 14, message: "Stomach lining begins to heal" },
      { days: 30, message: "Liver fat reduces by up to 15%" },
      { days: 90, message: "Mental clarity and focus sharpen" },
      { days: 365, message: "Risk of liver disease significantly reduced" },
    ],
  },
  {
    id: "drugs",
    label: "Substances",
    icon: Pill,
    emoji: "💊",
    costPerDay: 25,
    unit: "doses",
    healthMilestones: [
      { days: 1, message: "Your body starts the healing process" },
      { days: 3, message: "Acute withdrawal symptoms begin to fade" },
      { days: 7, message: "Sleep patterns start normalizing" },
      { days: 14, message: "Energy levels begin returning" },
      { days: 30, message: "Brain chemistry starts rebalancing" },
      { days: 90, message: "Neural pathways are rewiring" },
      { days: 365, message: "Major reduction in relapse risk" },
    ],
  },
  {
    id: "social_media",
    label: "Social Media",
    icon: Smartphone,
    emoji: "📱",
    costPerDay: 0,
    unit: "hours saved",
    healthMilestones: [
      { days: 1, message: "FOMO anxiety starts to lessen" },
      { days: 3, message: "You notice more present-moment awareness" },
      { days: 7, message: "Sleep quality noticeably improves" },
      { days: 14, message: "Attention span begins expanding" },
      { days: 30, message: "Self-esteem and comparison habits improve" },
      { days: 90, message: "Deep focus and creativity return" },
      { days: 365, message: "Completely rewired relationship with technology" },
    ],
  },
  {
    id: "porn_gaming",
    label: "Porn / Gaming",
    icon: Gamepad2,
    emoji: "🎮",
    costPerDay: 0,
    unit: "hours saved",
    healthMilestones: [
      { days: 1, message: "First step toward rewiring your brain" },
      { days: 7, message: "Dopamine sensitivity starts recovering" },
      { days: 14, message: "Motivation and drive begin returning" },
      { days: 30, message: "Emotional regulation improves" },
      { days: 60, message: "Real-world connections feel more rewarding" },
      { days: 90, message: "Significant neurological rewiring achieved" },
      { days: 180, message: "New healthy habits fully established" },
    ],
  },
  {
    id: "sugar_junk",
    label: "Sugar / Junk Food",
    icon: Cookie,
    emoji: "🍬",
    costPerDay: 8,
    unit: "servings",
    healthMilestones: [
      { days: 1, message: "Blood sugar spikes begin stabilizing" },
      { days: 3, message: "Sugar cravings start to weaken" },
      { days: 7, message: "Energy levels become more consistent" },
      { days: 14, message: "Skin clarity begins improving" },
      { days: 30, message: "Taste buds reset — real food tastes better" },
      { days: 60, message: "Inflammation markers decrease" },
      { days: 90, message: "Metabolic health significantly improved" },
    ],
  },
];

export const MOTIVATION_QUOTES = [
  { text: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.", author: "Socrates" },
  { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
  { text: "You don't have to be perfect. You just have to keep going.", author: "Unknown" },
  { text: "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought.", author: "Unknown" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger" },
  { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { text: "One day at a time. One step at a time. One breath at a time.", author: "Unknown" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your addiction is not your identity. Your recovery is your superpower.", author: "Unknown" },
];

export const BREATHING_STEPS = [
  { label: "Breathe In", duration: 4, instruction: "Slowly inhale through your nose" },
  { label: "Hold", duration: 4, instruction: "Gently hold your breath" },
  { label: "Breathe Out", duration: 6, instruction: "Slowly exhale through your mouth" },
  { label: "Rest", duration: 2, instruction: "Pause and be still" },
];

export const MOOD_OPTIONS = [
  { emoji: "😊", label: "Great", value: 5 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "😔", label: "Tough", value: 2 },
  { emoji: "😢", label: "Struggling", value: 1 },
];

export interface UserData {
  name: string;
  addiction: AddictionType;
  startDate: string;
  checkins: { date: string; clean: boolean; mood: number }[];
}
