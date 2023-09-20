import { InjectionToken, inject } from '@angular/core';

import { WINDOW } from './window';

export const NAVIGATOR = new InjectionToken<Navigator>('Window Navigator', {
  factory: () => inject(WINDOW).navigator
});
