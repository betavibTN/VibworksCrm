import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MachineService } from '../machineServices/machine.service';

interface City {
  name: string;
  code: string;
}

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-Machine',
  templateUrl: './Machine.component.html',
  styleUrls: ['./Machine.component.css'],
  standalone: true,
  imports: [
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    AutoCompleteModule,
    ListboxModule,
    DropdownModule,
    CommonModule,
  ],
})
export class MachineComponent implements OnInit {
  // Initialize cities and other properties
  cities: City[] = [];
  machineData: any[] = [];
  selectedDate: any;
  selectedCities: City[] = [];
  items: any[] = [];
  suggestions: any[] = [];
  selectedCity: City | undefined;
  selectedItem: any;
  cbxDates: { name: string; value: Date }[] = []; // Initialize cbxDates as an empty array
  cbxDatesValue: Date | null = null; // For storing the selected date

  constructor(private machineService: MachineService) {}

  // Function to fetch suggestions based on the user's input
  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(
      (item) => event.query + '-' + item
    );
  }

  ngOnInit(): void {
    this.loadMachineData();
    this.fetchCbxDates('d76218da-3cbb-4d70-9b4f-98395e837de5');
  }

  loadMachineData(): void {
    const currentRoute = 'Fire Pumps'; // Replace with actual route
    const dateInput1 = '2024-11-09'; // Replace with actual date value
    const dateInput2 = '2020-11-08'; // Replace with actual date value

    // Call the service to get machine data
    this.machineService
      .getMachineColorsUsingRouteName(currentRoute, dateInput1, dateInput2)
      .subscribe({
        next: (data) => {
          this.machineData = data; // Bind the fetched data to machineData
        },
        error: (err) => {
          console.error('Error fetching machine data:', err); // Handle errors
        },
      });
  }
  private fetchCbxDates(machineID: string): void {
    this.machineService.getCbxDates(machineID).subscribe(
      (response: any) => {
        // Format dates as "dd/mm/yyyy"
        this.cbxDates = response.map((dateStr: string) => ({
          name: this.formatDateToDDMMYYYY(new Date(dateStr)), // Display formatted date
          value: new Date(dateStr), // Store original Date object
        }));
        console.log('this.cbxDates:', this.cbxDates); // Debug output
      },
      (error: any) => {
        console.error('Error fetching cbxDates:', error);
      }
    );
  }

  private formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onCbxDatesChange(cbxDate: any): void {
    this.cbxDatesValue = cbxDate;
  }
}
