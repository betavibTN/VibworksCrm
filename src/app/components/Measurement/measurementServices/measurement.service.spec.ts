/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MeasurementService } from './measurement.service';

describe('Service: Measurement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeasurementService]
    });
  });

  it('should ...', inject([MeasurementService], (service: MeasurementService) => {
    expect(service).toBeTruthy();
  }));
});
