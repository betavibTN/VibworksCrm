import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../Login/authServices/auth.service';



@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private readonly baseUrl: string = 'https://localhost:7259/api/Measure';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getMeasDates(PtID: string, dir: string): Observable<any[]> {
    const params = new HttpParams()
      .set('PtID', PtID)
      .set('dir', dir);

    // Retrieve token from AuthService
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.baseUrl}/getmeasuresdata`, { params, headers });
  }
}
