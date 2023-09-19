import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import appRouting from './app/app-routing';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRouting)]
}).catch(console.error);
