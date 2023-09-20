import { inject, InjectionToken } from '@angular/core';

import { NAVIGATOR } from './navigator';

export const CLIPBOARD = new InjectionToken<Navigator['clipboard']>(
  'Window Navigator Clipboard',
  {
    factory: () => inject(NAVIGATOR).clipboard
  }
);
