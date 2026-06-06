import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { CompetitiveHeader } from '@/components/leaderboard/CompetitiveHeader';
import { LeagueShowcase } from '@/components/leaderboard/LeagueShowcase';
import { LeaderboardList } from '@/components/leaderboard/LeaderboardList';
import { UserRankSpotlight } from '@/components/leaderboard/UserRankSpotlight';
import { PromoDemotionZone } from '@/components/leaderboard/PromoDemotionZone';
import { FriendCompetition } from '@/components/leaderboard/FriendCompetition';
import { TopPlayerShowcase } from '@/components/leaderboard/TopPlayerShowcase';
import { RewardPreview } from '@/components/leaderboard/RewardPreview';
import { WeeklyCountdown } from '@/components/leaderboard/WeeklyCountdown';
import { MotivationFooter } from '@/components/leaderboard/MotivationFooter';

export default function SocialPage() {
  return (
    <ScreenContainer>
      <div className="flex flex-col gap-4 pb-6">
        <CompetitiveHeader />
        <LeagueShowcase />
        <LeaderboardList />
        <UserRankSpotlight />
        <PromoDemotionZone />
        <FriendCompetition />
        <TopPlayerShowcase />
        <RewardPreview />
        <WeeklyCountdown />
        <MotivationFooter />
      </div>
    </ScreenContainer>
  );
}
