import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkTheme = 'lara-dark-blue';
  private lightTheme = 'lara-light-blue';

  constructor() {
    // Get saved theme preference from local storage
    const savedTheme = localStorage.getItem('isDarkMode') === 'true';
    this.applyTheme(savedTheme);
  }

  applyTheme(isDarkMode: boolean) {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = `node_modules/primeng/resources/themes/${
        isDarkMode ? this.darkTheme : this.lightTheme
      }/theme.css`;
      localStorage.setItem('isDarkMode', isDarkMode.toString());
    }
  }
}
