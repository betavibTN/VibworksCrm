import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';

import { CommonModule } from '@angular/common';
import { MeasurementService } from '../measurementServices/measurement.service';
interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-Measurement',
  templateUrl: './Measurement.component.html',
  styleUrls: ['./Measurement.component.css'],
  standalone: true,
  imports: [FormsModule, ListboxModule, CommonModule],
})
export class MeasurementComponent implements OnInit {
  cities!: City[];
  measDates: any[] = [];
  selectedDate: any;
  selectedCity!: City;
  constructor(private measurementService: MeasurementService) {}
  ngOnInit() {
    this.loadMeasDates('54789352-1bb1-4f27-b14f-105b1097a2f7', 'AX');
  }
  loadMeasDates(PtID: string, dir: string): void {
    this.measurementService.getMeasDates(PtID, dir).subscribe({
      next: (data) => {
        this.measDates = data;
        console.log('this.measDates', this.measDates);
      },
      error: (err) => {
        console.error('Error loading measurement dates:', err);
      },
    });
  }

  onRowSelected(date: any): void {
    console.log('Selected date:', date);
    this.selectedDate = date;
  }
}
