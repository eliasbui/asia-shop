/* eslint-disable @typescript-eslint/no-var-requires */
const { setupServer } = require('msw/node');
const { HttpResponse, delay, http } = require('msw');

const handlers = [
  http.get('https://mock.api.local/seller/products', async () => {
    await delay();
    return HttpResponse.json([
      {
        id: 'prod_1',
        sku: 'ASIA-001',
        slug: 'wireless-earbuds',
        title: 'Wireless Earbuds',
        category: 'Audio',
        price: 129,
        discountPrice: 99,
        stock: 240
      }
    ]);
  })
];

const server = setupServer(...handlers);

server.listen();
console.log('Mock server running at https://mock.api.local');
