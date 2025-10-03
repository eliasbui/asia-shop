import { ShippingStep } from '@/components/checkout/steps/ShippingStep';
import { useCheckoutData, useCheckoutNavigation } from '@/lib/state/checkoutStore';

export default function ShippingPage() {
  const { data, updateData } = useCheckoutData();
  const { nextStep, previousStep } = useCheckoutNavigation();

  const handleChange = (newData: any) => {
    updateData(newData);
  };

  return (
    <ShippingStep
      data={data}
      onChange={handleChange}
      onNext={nextStep}
      onPrevious={previousStep}
    />
  );
}