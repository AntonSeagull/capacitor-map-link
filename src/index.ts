import { registerPlugin } from '@capacitor/core';
import type { CapMapLinkPlugin } from './definitions';

const CapMapLink = registerPlugin<CapMapLinkPlugin>('CapMapLink', {
  web: () => import('./web').then(m => new m.CapMapLinkWeb()),
  ios: () => import('./web').then(m => new m.CapMapLinkWeb()),
  android: () => import('./web').then(m => new m.CapMapLinkWeb()),
});

export * from './definitions';
export { CapMapLink };
