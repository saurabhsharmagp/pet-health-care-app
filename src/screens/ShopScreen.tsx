import ComingSoon from '../components/ComingSoon';
import ScreenContainer from '../components/ScreenContainer';

export default function ShopScreen() {
  return (
    <ScreenContainer scroll={false}>
      <ComingSoon
        icon="bag-handle-outline"
        title="Pet Shop"
        description="Order medicine, food, and toys for your pets, delivered to your door."
        bullets={[
          'Prescription & OTC medicine',
          'Prescription refill reminders',
          'Toys, food & grooming supplies',
          'Same-day delivery in select cities',
        ]}
      />
    </ScreenContainer>
  );
}
