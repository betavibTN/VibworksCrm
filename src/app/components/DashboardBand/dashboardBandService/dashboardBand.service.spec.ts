/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DashboardBandService } from './dashboardBand.service';

describe('Service: DashboardBand', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardBandService]
    });
  });

  it('should ...', inject([DashboardBandService], (service: DashboardBandService) => {
    expect(service).toBeTruthy();
  }));
});
