import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Dash } from '../dashboardBandModels/Dash';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-DashboardBand',
  templateUrl: './DashboardBand.component.html',
  styleUrls: ['./DashboardBand.component.css'],
  standalone: true,
  imports: [TableModule, CommonModule,SelectButtonModule,DialogModule, ButtonModule]

})
export class DashboardBandComponent implements OnInit {

  products!: Dash[];
  dialogVisible: boolean = false;
  sizes!: any[];

  selectedSize: any = '';

  constructor() {}

  ngOnInit() {
    // Example: Initialize the 'products' array with some mock data
    this.products = [
      {
        point: 'MOB',
        dir: 'RH',
        date: '10/27/20 4:40 PM',
        velocity: '0.02',
        peak: '1.21',
        rms: '0.25',
        ku: '0.25',
        cf: '0.25',
        unbalance: '0.25',
        alignment: '0.25',
        bearings: '0.25',
        bearingHarmonics: '0.25',
        highFqs1: '0.25',
        highFq2: '0.25'
      },
      {
        point: 'MOB',
        dir: 'RH',
        date: '10/27/20 4:40 PM',
        velocity: '0.02',
        peak: '1.21',
        rms: '0.25',
        ku: '0.25',
        cf: '0.25',
        unbalance: '0.25',
        alignment: '0.25',
        bearings: '0.25',
        bearingHarmonics: '0.25',
        highFqs1: '0.25',
        highFq2: '0.25'
      },
      {
        point: 'MOB',
        dir: 'RH',
        date: '10/27/20 4:40 PM',
        velocity: '0.02',
        peak: '1.21',
        rms: '0.25',
        ku: '0.25',
        cf: '0.25',
        unbalance: '0.25',
        alignment: '0.25',
        bearings: '0.25',
        bearingHarmonics: '0.25',
        highFqs1: '0.25',
        highFq2: '0.25'
      },
      {
        point: 'MOB',
        dir: 'RH',
        date: '10/27/20 4:40 PM',
        velocity: '0.02',
        peak: '1.21',
        rms: '0.25',
        ku: '0.25',
        cf: '0.25',
        unbalance: '0.25',
        alignment: '0.25',
        bearings: '0.25',
        bearingHarmonics: '0.25',
        highFqs1: '0.25',
        highFq2: '0.25'
      },
      {
        point: 'MOB',
        dir: 'RH',
        date: '10/27/20 4:40 PM',
        velocity: '0.02',
        peak: '1.21',
        rms: '0.25',
        ku: '0.25',
        cf: '0.25',
        unbalance: '0.25',
        alignment: '0.25',
        bearings: '0.25',
        bearingHarmonics: '0.25',
        highFqs1: '0.25',
        highFq2: '0.25'
      },
      {
        point: 'MOB',
        dir: 'RH',
        date: '10/27/20 4:40 PM',
        velocity: '0.02',
        peak: '1.21',
        rms: '0.25',
        ku: '0.25',
        cf: '0.25',
        unbalance: '0.25',
        alignment: '0.25',
        bearings: '0.25',
        bearingHarmonics: '0.25',
        highFqs1: '0.25',
        highFq2: '0.25'
      },
      // Add more objects to this array as needed
    ];

    this.sizes = [
      { name: 'Small', class: 'p-datatable-sm' },
      { name: 'Normal', class: '' },
      { name: 'Large', class: 'p-datatable-lg' }
    ];
  }

  showDialog() {
    this.dialogVisible = true;
}
getColorClass(value: number) {
  if (value < 50) {
    return 'high-value'; // Red
  } else if (value >= 50 && value < 150) {
    return 'medium-value'; // Yellow
  } else if (value >= 150 && value < 250) {
    return 'low-value'; // Green
  } else {
    return 'very-high-value'; // Orange
  }
}
}
