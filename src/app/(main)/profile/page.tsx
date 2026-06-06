import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { IdentityCard } from '@/components/profile/IdentityCard';
import { RankShowcase } from '@/components/profile/RankShowcase';
import { AchievementShowcase } from '@/components/profile/AchievementShowcase';
import { StatsOverview } from '@/components/profile/StatsOverview';
import { SocialShare } from '@/components/profile/SocialShare';
import { Personalization } from '@/components/profile/Personalization';
import { SettingsShortcut } from '@/components/profile/SettingsShortcut';
import { LogoutSection } from '@/components/profile/LogoutSection';

export default function ProfilePage() {
  return (
    <ScreenContainer>
      <div className="flex flex-col gap-4 pb-6">
        <ProfileHeader />
        <IdentityCard />
        <RankShowcase />
        <AchievementShowcase />
        <div>
          <StatsOverview />
        </div>
        <SocialShare />
        <Personalization />
        <SettingsShortcut />
        <LogoutSection />
      </div>
    </ScreenContainer>
  );
}
