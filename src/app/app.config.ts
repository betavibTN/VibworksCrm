import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient , HTTP_INTERCEPTORS} from "@angular/common/http";

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Message, MessageService } from 'primeng/api';
import { authInterceptorServiceInterceptor } from './interceptors/auth-interceptor-service.interceptor';
import { AuthService } from './components/Login/authServices/auth.service';
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync(),provideHttpClient(),MessageService, AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: authInterceptorServiceInterceptor, multi: true }]
};
