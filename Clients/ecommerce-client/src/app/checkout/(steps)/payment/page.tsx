import { PaymentStep } from '@/components/checkout/steps/PaymentStep';
import { useCheckoutData, useCheckoutNavigation } from '@/lib/state/checkoutStore';

export default function PaymentPage() {
  const { data, updateData } = useCheckoutData();
  const { nextStep, previousStep } = useCheckoutNavigation();

  const handleChange = (newData: any) => {
    updateData(newData);
  };

  return (
    <PaymentStep
      data={data}
      onChange={handleChange}
      onNext={nextStep}
      onPrevious={previousStep}
    />
  );
}