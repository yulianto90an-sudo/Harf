import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { ProgressHeader } from '@/components/progress/ProgressHeader';
import { RankCard } from '@/components/progress/RankCard';
import { XpSection } from '@/components/progress/XpSection';
import { StreakCalendar } from '@/components/progress/StreakCalendar';
import { WeeklyChart } from '@/components/progress/WeeklyChart';
import { AchievementGrid } from '@/components/progress/AchievementGrid';
import { StatCards } from '@/components/progress/StatCards';
import { SkillBreakdown } from '@/components/progress/SkillBreakdown';
import { LeaderboardCard } from '@/components/progress/LeaderboardCard';
import { MotivationCard } from '@/components/progress/MotivationCard';
import { ShareCTA } from '@/components/progress/ShareCTA';

export default function ProgressPage() {
  return (
    <ScreenContainer>
      <div className="flex flex-col gap-4 pb-6">
        <ProgressHeader />
        <RankCard />
        <XpSection />
        <StreakCalendar />
        <WeeklyChart />
        <StatCards />
        <SkillBreakdown />
        <AchievementGrid />
        <LeaderboardCard />
        <MotivationCard />
        <ShareCTA />
      </div>
    </ScreenContainer>
  );
}
