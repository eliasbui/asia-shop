"use client";

export async function initMocking() {
  if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') return;
  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}
