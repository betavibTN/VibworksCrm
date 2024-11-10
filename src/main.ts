import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PrimeNGConfig } from 'primeng/api';

import 'zone.js';
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
