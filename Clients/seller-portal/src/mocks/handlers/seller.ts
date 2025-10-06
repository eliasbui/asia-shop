import { HttpResponse, delay, http } from 'msw';

import { productSchema } from '@/lib/api/seller/types';

const products = productSchema.array().parse([
  {
    id: 'prod_1',
    sku: 'ASIA-001',
    slug: 'wireless-earbuds',
    title: 'Wireless Earbuds',
    brand: 'AsiaSound',
    category: 'Audio',
    price: 129,
    discountPrice: 99,
    stock: 240
  },
  {
    id: 'prod_2',
    sku: 'ASIA-002',
    slug: 'smartwatch-pro',
    title: 'Smartwatch Pro',
    brand: 'AsiaWear',
    category: 'Wearables',
    price: 199,
    discountPrice: null,
    stock: 120
  }
]);

const orders = [
  {
    id: 'ord_1',
    orderNumber: '100045',
    status: 'shipped',
    customerName: 'Linh Nguyen',
    total: 398,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    storeId: 'store-1',
    items: [
      { id: 'item_1', productId: 'prod_1', title: 'Wireless Earbuds', quantity: 2, unitPrice: 99, variant: null }
    ]
  }
];

export const sellerHandlers = [
  http.get('https://mock.api.local/seller/products', async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const filtered = status ? products.filter(() => status === 'active') : products;
    return HttpResponse.json(filtered);
  }),
  http.get('https://mock.api.local/seller/orders', async () => {
    await delay();
    return HttpResponse.json(orders);
  }),
  http.get('https://mock.api.local/seller/payouts', async () => {
    await delay(200);
    return HttpResponse.json([
      {
        id: 'pay_1',
        amount: 5820,
        status: 'pending',
        scheduledFor: new Date(Date.now() + 86400000).toISOString(),
        account: 'ACB Bank ••5921',
        reference: 'PAYOUT-2024-10-05'
      }
    ]);
  }),
  http.get('https://mock.api.local/seller/reports/revenue', async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const period = url.searchParams.get('period') ?? 'monthly';
    return HttpResponse.json({
      period,
      gross: 12890,
      net: 11234,
      fees: 1656
    });
  })
];
