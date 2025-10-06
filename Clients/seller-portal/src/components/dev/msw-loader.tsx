"use client";

import { useEffect } from 'react';

import { initMocking } from '@/lib/mocks/init-browser';

export function MswLoader() {
  useEffect(() => {
    initMocking();
  }, []);

  return null;
}
