import { Component, OnInit } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { AnnoationComponent } from '../../../Annoation/Annoation.component';
import { ChartsComponent } from '../../../Charts/Charts.component';
import { DashboardBandComponent } from '../../DashboardBand/dashboardBand/DashboardBand.component';
import { MachineComponent } from '../../Machine/machine/Machine.component';
import { MeasurementComponent } from '../../Measurement/measurement/Measurement.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { TimeIndicatorsComponent } from '../../TimeIndicators/timeIndicators/TimeIndicators.component';
import { TreeViewComponent } from '../../TreeView/treeview/TreeView.component';






@Component({
  selector: 'app-Dashboard',
  templateUrl: './Dashboard.component.html',
  styleUrls: ['./Dashboard.component.css'],
  standalone: true,
  imports: [SplitterModule, TreeViewComponent, MeasurementComponent, MachineComponent, TimeIndicatorsComponent, DashboardBandComponent, AnnoationComponent, ChartsComponent, NavbarComponent]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
