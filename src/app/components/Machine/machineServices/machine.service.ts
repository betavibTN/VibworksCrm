import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../Login/authServices/auth.service';


@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private readonly baseUrl: string = 'https://localhost:7259/api/TreeView';


  constructor(private http: HttpClient, private authService: AuthService) { }

getMachineColorsUsingRouteName(currentRoute: string, dateInput1: string, dateInput2: string): Observable<any[]> {
  const requestBody = { currentRoute, dateInput1, dateInput2 };
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.post<any[]>(`${this.baseUrl}/GetMachineColorsUsingRouteNameAsync`,  requestBody,{ headers });
}
getCbxDates(machineID: string): Observable<any> {
  const params = { machineID };
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any>(`${this.baseUrl}/CbxDates`, { params,headers });
}
}
