import { Component, OnInit } from '@angular/core';


import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { Annoation } from '../components/DashboardBand/dashboardBandModels/Dash';
@Component({
  selector: 'app-Annoation',
  templateUrl: './Annoation.component.html',
  styleUrls: ['./Annoation.component.css'],
  standalone: true,

  imports: [TableModule, CommonModule, SelectButtonModule]
})
export class AnnoationComponent implements OnInit {
  annotation !: Annoation[];

  sizes!: any[];

  selectedSize: any = '';
  constructor() { }

  ngOnInit() {
    this.annotation = [
      {
        point: 'MOB',
        dir: 'RH',
        date: '10/27/20 4:40 PM',
        velocity: '0.02',
        peak: '1.21',
        rms: '0.25',
        ku: '0.25',
        cf: '0.25',

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

      }

      // Add more objects to this array as needed
    ];
  }

}
