import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EllipseService {
 private elevationUrl = 'http://localhost:8081/api/check-elevation';



  constructor(private http: HttpClient) {}

  getElevationStatus(lat: number, lon: number, threshold: number = 2000): Observable<any> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('threshold', threshold.toString());

    return this.http.get(this.elevationUrl, { params });
  }
}