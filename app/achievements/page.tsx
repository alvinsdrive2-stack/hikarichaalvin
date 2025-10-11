import { AchievementSystem } from "@/components/achievements/achievement-system";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements - HikariCha Forum",
  description: "View your achievements, track progress, and unlock exclusive rewards on HikariCha Forum.",
};

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AchievementSystem />
    </div>
  );
}