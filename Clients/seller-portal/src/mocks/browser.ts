import { setupWorker } from 'msw/browser';

import { sellerHandlers } from './handlers/seller';

export const worker = setupWorker(...sellerHandlers);
