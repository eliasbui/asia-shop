import { setupServer } from 'msw/node';

import { sellerHandlers } from './handlers/seller';

export const server = setupServer(...sellerHandlers);
