import ComingSoon from '../components/ComingSoon';
import ScreenContainer from '../components/ScreenContainer';

export default function WalkingScreen() {
  return (
    <ScreenContainer scroll={false}>
      <ComingSoon
        icon="paw-outline"
        title="Dog Walking & Sitting"
        description="Book trusted, background-checked walkers and sitters near you."
        bullets={[
          'On-demand & scheduled walks',
          'Live GPS tracking during walks',
          'Verified, background-checked walkers',
          'Pet sitting & boarding options',
        ]}
      />
    </ScreenContainer>
  );
}
