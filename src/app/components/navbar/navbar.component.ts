import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { KnobModule } from 'primeng/knob';

import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ThemeService } from '../../services/Theme.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MenubarModule,
    DialogModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    CommonModule,
    KnobModule,
    IconFieldModule,
    InputIconModule,
  ],
  styles: [
    `
      :host ::ng-deep .card-container {
        .card {
          width: 75px;
          height: 75px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          user-select: none;
          padding: 0;

          &.primary-box {
            background-color: var(--primary-color);
            padding: 0;
            color: var(--primary-color-text);
          }

          &.styled-box-green {
            .p-ink {
              background: rgba(#4baf50, 0.3);
            }
          }

          &.styled-box-orange {
            .p-ink {
              background: rgba(#ffc106, 0.3);
            }
          }

          &.styled-box-purple {
            .p-ink {
              background: rgba(#9c27b0, 0.3);
            }
          }

          &:last-child {
            margin-right: 0;
          }
        }
      }
    `,
  ],
})
export class NavbarComponent implements OnInit {
  showModal: boolean = false;
  items: MenuItem[] | undefined;
  visible: boolean = false;
  databaseDialogVisible: boolean = false; // For Open Database dialog
  isDarkMode = false;
  value: number = 60;
  constructor(private themeService: ThemeService) {}

  showDialog() {
    this.visible = true;
  }
  showDatabaseDialog() {
    this.databaseDialogVisible = true;
  }
  ngOnInit() {
    this.items = [
      {
        label: 'Options',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Settings',
            command: () => {
              this.showDialog();
            },
          },
          {
            separator: true,
          },
        ],
      },
      {
        label: 'Open DataBase',
        icon: 'pi pi-database',
        command: () => {
          this.showDatabaseDialog();
        },
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        badge: '3',
      },
    ];
    this.isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    this.themeService.applyTheme(this.isDarkMode);
  }
  toggleTheme() {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    this.themeService.applyTheme(!isDarkMode); // Toggle theme
  }
}
