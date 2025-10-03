import { AddressStep } from '@/components/checkout/steps/AddressStep';
import { useCheckoutData, useCheckoutNavigation } from '@/lib/state/checkoutStore';

export default function AddressPage() {
  const { data, updateData } = useCheckoutData();
  const { nextStep } = useCheckoutNavigation();

  const handleChange = (newData: any) => {
    updateData(newData);
  };

  return (
    <AddressStep
      data={data}
      onChange={handleChange}
      onNext={nextStep}
    />
  );
}