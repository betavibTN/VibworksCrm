import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InplaceModule } from 'primeng/inplace';
interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-TimeIndicators',
  templateUrl: './TimeIndicators.component.html',
  styleUrls: ['./TimeIndicators.component.css'],
  standalone: true,
  imports: [FormsModule, CalendarModule,DropdownModule,CheckboxModule,InplaceModule]
})
export class TimeIndicatorsComponent implements OnInit {
  date: Date[] | undefined;
  cities: City[] | undefined;
  pizza: string[] = [];
    selectedCity: City | undefined;
    constructor() { }
    ngOnInit() {
        this.cities = [
            { name: '1 Year', code: 'NY' },
            { name: '2 Year', code: 'RM' },
            { name: '3 Year', code: 'LDN' },
            { name: '4 Year', code: 'IST' },

        ];
    }




}
