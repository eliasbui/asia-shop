import { PromotionForm } from '@/components/seller/promotions/promotion-form';
import { CouponTable } from '@/components/seller/promotions/coupon-table';

const coupons = [
  { id: 'coupon-1', code: 'WELCOME10', usageLimit: 100, used: 62, expiresAt: '2024-12-30' },
  { id: 'coupon-2', code: 'FLASH50', usageLimit: 20, used: 5 }
];

export default function PromotionsPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Promotions</h1>
          <p className="text-sm text-muted-foreground">Manage tiered discounts, flash sales, and vouchers.</p>
        </div>
        <PromotionForm onSubmit={async () => undefined} />
      </div>
      <CouponTable coupons={coupons} onGenerate={() => undefined} />
    </div>
  );
}
