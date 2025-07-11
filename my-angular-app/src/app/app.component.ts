//drawing just bezier curve
//10 JULY 2025


// import { Component, AfterViewInit } from '@angular/core';
// import * as L from 'leaflet';
// import { HttpClient } from '@angular/common/http';
// import { EllipseService } from './ellipse.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent implements AfterViewInit {
//   ellipseInput = {
//     semiMajor: 0,
//     semiMinor: 0,
//     centerX: 0,
//     centerY: 0,
//   };

//   backendResponse: string = '';
//   map: L.Map | undefined;
//   bezierBoundaryPoints: L.LatLng[] = [];
//   readonly elevationThreshold = 3000; // meters

//   constructor(private http: HttpClient, private ellipseService: EllipseService) {}

//   ngAfterViewInit(): void {
//     this.initMap();
//   }

//   private initMap(): void {
//     this.map = L.map('map').setView([20.5937, 78.9629], 5); // Default to India

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: 'Map data © OpenStreetMap contributors',
//     }).addTo(this.map);
//   }

//   submitEllipse() {
//     this.http.post<any>('http://localhost:8081/bezier', this.ellipseInput).subscribe({
//       next: (response) => {
//         this.backendResponse = 'Bézier curve received.';
//         const bezierSegments = response.bezierCurve;
//         if (!this.map) return;

//         // Clear previous layers
//         this.map.eachLayer((layer) => {
//           if ((layer as any)._path || layer instanceof L.CircleMarker || layer instanceof L.Polyline) {
//             if (!(layer as any)._url) {
//               this.map!.removeLayer(layer);
//             }
//           }
//         });

//         this.bezierBoundaryPoints = []; // Reset

//         const zoom = this.map.getZoom();
//         const steps = Math.max(4, Math.floor(zoom * 1.5));

//         bezierSegments.forEach((segment: any) => {
//           if (!Array.isArray(segment) || segment.length !== 4) return;

//           const interpolated = this.interpolateBezier(segment, steps);
//           const latLngs = interpolated.map(([x, y]) => L.latLng(y, x));
//           this.bezierBoundaryPoints.push(...latLngs);

//           // Draw curve on map
//           L.polyline(latLngs, {
//             color: 'blue',
//             weight: 2,
//             smoothFactor: 1,
//           }).addTo(this.map!);
//         });

//         if (this.bezierBoundaryPoints.length > 0) {
//           const bounds = L.latLngBounds(this.bezierBoundaryPoints);
//           this.map.fitBounds(bounds, { padding: [20, 20] });
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching Bézier segments:', err);
//         this.backendResponse = 'Failed to fetch Bézier segments.';
//       },
//     });
//   }

//   drawEllipse() {
//     if (!this.map || this.bezierBoundaryPoints.length === 0) {
//       alert('Please generate the ellipse before checking elevation.');
//       return;
//     }

//     this.backendResponse = 'Checking elevation...';

//     this.bezierBoundaryPoints.forEach((point) => {
//       this.ellipseService.getElevationStatus(point.lat, point.lng).subscribe({
//         next: (res) => {
//           const color = res.elevation > this.elevationThreshold ? 'red' : 'green';

//           L.circleMarker([point.lat, point.lng], {
//             radius: 5,
//             color,
//             fillColor: color,
//             fillOpacity: 0.9,
//           }).addTo(this.map!);
//         },
//         error: (err) => {
//           console.error(`Elevation check failed at (${point.lat}, ${point.lng})`, err);
//         },
//       });
//     });

//     this.backendResponse = 'Elevation check complete.';
//   }

//   interpolateBezier(segment: any[], steps: number): number[][] {
//     const [p0, p1, p2, p3] = segment;
//     const points = [];

//     for (let t = 0; t <= 1; t += 1 / steps) {
//       const x =
//         Math.pow(1 - t, 3) * p0[0] +
//         3 * Math.pow(1 - t, 2) * t * p1[0] +
//         3 * (1 - t) * t * t * p2[0] +
//         t * t * t * p3[0];

//       const y =
//         Math.pow(1 - t, 3) * p0[1] +
//         3 * Math.pow(1 - t, 2) * t * p1[1] +
//         3 * (1 - t) * t * t * p2[1] +
//         t * t * t * p3[1];

//       points.push([x, y]);
//     }

//     return points;
//   }
// }





// import { Component, AfterViewInit } from '@angular/core';
// import * as L from 'leaflet';
// import 'leaflet-editable';
// import { HttpClient } from '@angular/common/http';
// import { EllipseService } from './ellipse.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent implements AfterViewInit {
//   ellipseInput = {
//     semiMajor: 0,
//     semiMinor: 0,
//     centerX: 0,
//     centerY: 0,
//   };

//   backendResponse: string = '';
//   map!: L.Map;
//   editablePolygon!: L.Polygon;
//   bezierBoundaryPoints: L.LatLng[] = [];
//   readonly elevationThreshold = 3000; // meters

//   constructor(private http: HttpClient, private ellipseService: EllipseService) {}

//   ngAfterViewInit(): void {
//     this.initMap();
//   }

//   private initMap(): void {
//     this.map = L.map('map', {
//   // any other default options here
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
// } as any).setView([20.5937, 78.9629], 5);

// // Enable editing explicitly (needed by leaflet-editable)
// (this.map as any).editable = true;

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: 'Map data © OpenStreetMap contributors',
//     }).addTo(this.map);
//   }

//   submitEllipse(): void {
//     this.http.post<any>('http://localhost:8081/bezier', this.ellipseInput).subscribe({
//       next: (response) => {
//         this.backendResponse = 'Bézier curve received.';
//         const bezierSegments = response.bezierCurve;
//         if (!this.map) return;

//         // Remove previous curve and editable polygon if any
//         this.map.eachLayer((layer) => {
//           if ((layer as any)._path || layer instanceof L.CircleMarker || layer instanceof L.Polyline || layer instanceof L.Polygon) {
//             if (!(layer as any)._url) {
//               this.map!.removeLayer(layer);
//             }
//           }
//         });

//         this.bezierBoundaryPoints = [];

//         const zoom = this.map.getZoom();
//         const steps = Math.max(16, Math.floor(zoom * 3)); // smooth

//         bezierSegments.forEach((segment: any) => {
//           if (!Array.isArray(segment) || segment.length !== 4) return;

//           const interpolated = this.interpolateBezier(segment, steps);
//           const latLngs = interpolated.map(([x, y]) => L.latLng(y, x));
//           this.bezierBoundaryPoints.push(...latLngs);
//         });

//         // Create editable polygon with smooth boundary
//         this.editablePolygon = L.polygon(this.bezierBoundaryPoints, {
//           color: 'purple',
//           weight: 2,
//         }).addTo(this.map);

//         this.editablePolygon.enableEdit();

//         this.editablePolygon.on('editable:vertex:dragend', () => {
//           const updatedPoints = this.editablePolygon!.getLatLngs()[0] as L.LatLng[];
//           console.log('Updated points:', updatedPoints);
//         });

//         if (this.bezierBoundaryPoints.length > 0) {
//           const bounds = L.latLngBounds(this.bezierBoundaryPoints);
//           this.map.fitBounds(bounds, { padding: [20, 20] });
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching Bézier segments:', err);
//         this.backendResponse = 'Failed to fetch Bézier segments.';
//       },
//     });
//   }

//   drawEllipse(): void {
//     if (!this.map || this.bezierBoundaryPoints.length === 0) {
//       alert('Please generate the ellipse before checking elevation.');
//       return;
//     }

//     this.backendResponse = 'Checking elevation...';

//     this.bezierBoundaryPoints.forEach((point) => {
//       this.ellipseService.getElevationStatus(point.lat, point.lng).subscribe({
//         next: (res) => {
//           const color = res.elevation > this.elevationThreshold ? 'red' : 'green';

//           L.circleMarker([point.lat, point.lng], {
//             radius: 5,
//             color,
//             fillColor: color,
//             fillOpacity: 0.9,
//           }).addTo(this.map!);
//         },
//         error: (err) => {
//           console.error(`Elevation check failed at (${point.lat}, ${point.lng})`, err);
//         },
//       });
//     });

//     this.backendResponse = 'Elevation check complete.';
//   }

//   interpolateBezier(segment: any[], steps: number): number[][] {
//     const [p0, p1, p2, p3] = segment;
//     const points = [];

//     for (let t = 0; t <= 1; t += 1 / steps) {
//       const x =
//         Math.pow(1 - t, 3) * p0[0] +
//         3 * Math.pow(1 - t, 2) * t * p1[0] +
//         3 * (1 - t) * t * t * p2[0] +
//         t * t * t * p3[0];

//       const y =
//         Math.pow(1 - t, 3) * p0[1] +
//         3 * Math.pow(1 - t, 2) * t * p1[1] +
//         3 * (1 - t) * t * t * p2[1] +
//         t * t * t * p3[1];

//       points.push([x, y]);
//     }

//     return points;
//   }
// }






//with editable vertices

// import { Component, AfterViewInit } from '@angular/core';
// import * as L from 'leaflet';
// import { HttpClient } from '@angular/common/http';
// import { EllipseService } from './ellipse.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent implements AfterViewInit {
//   ellipseInput = {
//     semiMajor: 0,
//     semiMinor: 0,
//     centerX: 0,
//     centerY: 0,
//   };

//   backendResponse: string = '';
//   map!: L.Map;
//   ellipsePolygon!: L.Polygon;
//   bezierBoundaryPoints: L.LatLng[] = [];
//   controlMarkers: L.CircleMarker[] = [];
//   readonly elevationThreshold = 3000; // meters

//   constructor(private http: HttpClient, private ellipseService: EllipseService) {}

//   ngAfterViewInit(): void {
//     this.initMap();
//   }

//   private initMap(): void {
//     this.map = L.map('map').setView([20.5937, 78.9629], 5);
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: 'Map data © OpenStreetMap contributors',
//     }).addTo(this.map);
//   }

//   submitEllipse(): void {
//     this.http.post<any>('http://localhost:8081/bezier', this.ellipseInput).subscribe({
//       next: (response) => {
//         this.backendResponse = 'Bézier curve received.';

//         const bezierSegments = response.bezierCurve;
//         if (!this.map) return;

//         // Remove previous polygon and control markers
//         if (this.ellipsePolygon) this.map.removeLayer(this.ellipsePolygon);
//         this.controlMarkers.forEach(marker => this.map.removeLayer(marker));
//         this.controlMarkers = [];

//         this.bezierBoundaryPoints = [];

//         const zoom = this.map.getZoom();
//         const steps = Math.max(16, Math.floor(zoom * 3)); // smooth

//         bezierSegments.forEach((segment: any) => {
//           if (!Array.isArray(segment) || segment.length !== 4) return;

//           const interpolated = this.interpolateBezier(segment, steps);
//           const latLngs = interpolated.map(([x, y]) => L.latLng(y, x));
//           this.bezierBoundaryPoints.push(...latLngs);
//         });

//         this.ellipsePolygon = L.polygon(this.bezierBoundaryPoints, {
//           color: 'purple',
//           weight: 2,
//           fillColor: 'violet',
//           fillOpacity: 0.4,
//         }).addTo(this.map);

//         // Add draggable control points (circle markers)
//         this.bezierBoundaryPoints.forEach((point, index) => {
//           const marker = L.circleMarker(point, {
//             radius: 5,
//             color: 'blue',
//             fillColor: 'white',
//             fillOpacity: 1,
//             weight: 2,
//           }).addTo(this.map);

//           marker.on('mousedown', (e: any) => {
//             const moveHandler = (event: any) => {
//               marker.setLatLng(event.latlng);
//               this.bezierBoundaryPoints[index] = event.latlng;
//               this.ellipsePolygon.setLatLngs([this.bezierBoundaryPoints]);
//             };

//             const upHandler = () => {
//               this.map.off('mousemove', moveHandler);
//               this.map.off('mouseup', upHandler);
//             };

//             this.map.on('mousemove', moveHandler);
//             this.map.on('mouseup', upHandler);
//           });

//           this.controlMarkers.push(marker);
//         });

//         if (this.bezierBoundaryPoints.length > 0) {
//           const bounds = L.latLngBounds(this.bezierBoundaryPoints);
//           this.map.fitBounds(bounds, { padding: [20, 20] });
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching Bézier segments:', err);
//         this.backendResponse = 'Failed to fetch Bézier segments.';
//       },
//     });
//   }

//   drawEllipse(): void {
//     if (!this.map || this.bezierBoundaryPoints.length === 0) {
//       alert('Please generate the ellipse before checking elevation.');
//       return;
//     }

//     this.backendResponse = 'Checking elevation...';

//     this.bezierBoundaryPoints.forEach((point) => {
//       this.ellipseService.getElevationStatus(point.lat, point.lng).subscribe({
//         next: (res) => {
//           const color = res.elevation > this.elevationThreshold ? 'red' : 'green';

//           L.circleMarker([point.lat, point.lng], {
//             radius: 5,
//             color,
//             fillColor: color,
//             fillOpacity: 0.9,
//           }).addTo(this.map!);
//         },
//         error: (err) => {
//           console.error(`Elevation check failed at (${point.lat}, ${point.lng})`, err);
//         },
//       });
//     });

//     this.backendResponse = 'Elevation check complete.';
//   }

//   interpolateBezier(segment: any[], steps: number): number[][] {
//     const [p0, p1, p2, p3] = segment;
//     const points = [];

//     for (let t = 0; t <= 1; t += 1 / steps) {
//       const x =
//         Math.pow(1 - t, 3) * p0[0] +
//         3 * Math.pow(1 - t, 2) * t * p1[0] +
//         3 * (1 - t) * t * t * p2[0] +
//         t * t * t * p3[0];

//       const y =
//         Math.pow(1 - t, 3) * p0[1] +
//         3 * Math.pow(1 - t, 2) * t * p1[1] +
//         3 * (1 - t) * t * t * p2[1] +
//         t * t * t * p3[1];

//       points.push([x, y]);
//     }

//     return points;
//   }
// }






// import { Component, AfterViewInit } from '@angular/core';
// import * as L from 'leaflet';
// import { HttpClient } from '@angular/common/http';
// import { EllipseService } from './ellipse.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent implements AfterViewInit {
//   ellipseInput = {
//     semiMajor: 0,
//     semiMinor: 0,
//     centerX: 0,
//     centerY: 0,
//   };

//   backendResponse: string = '';
//   map!: L.Map;
//   ellipsePolygon!: L.Polygon;
//   bezierBoundaryPoints: L.LatLng[] = [];
//   controlMarkers: L.Marker[] = [];
//   readonly elevationThreshold = 3000; // meters

//   constructor(private http: HttpClient, private ellipseService: EllipseService) {}

//   ngAfterViewInit(): void {
//     this.initMap();
//   }

//   private initMap(): void {
//     this.map = L.map('map').setView([20.5937, 78.9629], 5);
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: 'Map data © OpenStreetMap contributors',
//     }).addTo(this.map);
//   }

//   submitEllipse(): void {
//     this.http.post<any>('http://localhost:8081/bezier', this.ellipseInput).subscribe({
//       next: (response) => {
//         this.backendResponse = 'Bézier curve received.';

//         const bezierSegments = response.bezierCurve;
//         if (!this.map) return;

//         // Remove previous polygon and control markers
//         if (this.ellipsePolygon) this.map.removeLayer(this.ellipsePolygon);
//         this.controlMarkers.forEach(marker => this.map.removeLayer(marker));
//         this.controlMarkers = [];

//         this.bezierBoundaryPoints = [];

//         const zoom = this.map.getZoom();
//         const steps = Math.max(16, Math.floor(zoom * 3)); // smooth

//         bezierSegments.forEach((segment: any) => {
//           if (!Array.isArray(segment) || segment.length !== 4) return;

//           const interpolated = this.interpolateBezier(segment, steps);
//           const latLngs = interpolated.map(([x, y]) => L.latLng(y, x));
//           this.bezierBoundaryPoints.push(...latLngs);
//         });

//         this.ellipsePolygon = L.polygon(this.bezierBoundaryPoints, {
//           color: 'purple',
//           weight: 2,
//           fillColor: 'violet',
//           fillOpacity: 0.4,
//         }).addTo(this.map);

//         // Add draggable control points using L.Marker with divIcon
//         this.bezierBoundaryPoints.forEach((point, index) => {
//           const marker = L.marker(point, {
//             draggable: true,
//             icon: L.divIcon({
//               className: 'control-point',
//               iconSize: [12, 12],
//             }),
//           }).addTo(this.map);

//           marker.on('drag', (event) => {
//             const newLatLng = event.target.getLatLng();
//             this.bezierBoundaryPoints[index] = newLatLng;
//             this.ellipsePolygon.setLatLngs([this.bezierBoundaryPoints]);
//           });

//           this.controlMarkers.push(marker);
//         });

//         if (this.bezierBoundaryPoints.length > 0) {
//           const bounds = L.latLngBounds(this.bezierBoundaryPoints);
//           this.map.fitBounds(bounds, { padding: [20, 20] });
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching Bézier segments:', err);
//         this.backendResponse = 'Failed to fetch Bézier segments.';
//       },
//     });
//   }

//   drawEllipse(): void {
//     if (!this.map || this.bezierBoundaryPoints.length === 0) {
//       alert('Please generate the ellipse before checking elevation.');
//       return;
//     }

//     this.backendResponse = 'Checking elevation...';

//     this.bezierBoundaryPoints.forEach((point) => {
//       this.ellipseService.getElevationStatus(point.lat, point.lng).subscribe({
//         next: (res) => {
//           const color = res.elevation > this.elevationThreshold ? 'red' : 'green';

//           L.circleMarker([point.lat, point.lng], {
//             radius: 5,
//             color,
//             fillColor: color,
//             fillOpacity: 0.9,
//           }).addTo(this.map!);
//         },
//         error: (err) => {
//           console.error(`Elevation check failed at (${point.lat}, ${point.lng})`, err);
//         },
//       });
//     });

//     this.backendResponse = 'Elevation check complete.';
//   }

//   interpolateBezier(segment: any[], steps: number): number[][] {
//     const [p0, p1, p2, p3] = segment;
//     const points = [];

//     for (let t = 0; t <= 1; t += 1 / steps) {
//       const x =
//         Math.pow(1 - t, 3) * p0[0] +
//         3 * Math.pow(1 - t, 2) * t * p1[0] +
//         3 * (1 - t) * t * t * p2[0] +
//         t * t * t * p3[0];

//       const y =
//         Math.pow(1 - t, 3) * p0[1] +
//         3 * Math.pow(1 - t, 2) * t * p1[1] +
//         3 * (1 - t) * t * t * p2[1] +
//         t * t * t * p3[1];

//       points.push([x, y]);
//     }

//     return points;
//   }
// }


// 11 JULY 2025 (EDITABLE BEZIER CURVE)










import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { EllipseService } from './ellipse.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  ellipseInput = {
    semiMajor: 0,
    semiMinor: 0,
    centerX: 0,
    centerY: 0,
  };

  backendResponse: string = '';
  map!: L.Map;
  ellipsePolygon!: L.Polygon;
  bezierBoundaryPoints: L.LatLng[] = [];
  controlMarkers: L.Marker[] = [];
  readonly elevationThreshold = 3000; // meters

  constructor(private http: HttpClient, private ellipseService: EllipseService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
    }).addTo(this.map);
  }

  submitEllipse(): void {
    this.http.post<any>('http://localhost:8081/bezier', this.ellipseInput).subscribe({
      next: (response) => {
        this.backendResponse = 'Bézier curve received.';

        const bezierSegments = response.bezierCurve;
        if (!this.map) return;

        if (this.ellipsePolygon) this.map.removeLayer(this.ellipsePolygon);
        this.controlMarkers.forEach(marker => this.map.removeLayer(marker));
        this.controlMarkers = [];

        this.bezierBoundaryPoints = [];

        const zoom = this.map.getZoom();
        const steps = Math.max(16, Math.floor(zoom * 3));

        bezierSegments.forEach((segment: any) => {
          if (!Array.isArray(segment) || segment.length !== 4) return;

          const interpolated = this.interpolateBezier(segment, steps);
          const latLngs = interpolated.map(([x, y]) => L.latLng(y, x));
          this.bezierBoundaryPoints.push(...latLngs);
        });

        this.ellipsePolygon = L.polygon(this.bezierBoundaryPoints, {
          color: 'purple',
          weight: 2,
          fillColor: 'violet',
          fillOpacity: 0.4,
        }).addTo(this.map);

        this.bezierBoundaryPoints.forEach((point, index) => {
          const marker = L.marker(point, {
            draggable: true,
            icon: L.divIcon({
              className: 'control-point',
              iconSize: [12, 12],
            }),
          }).addTo(this.map);

          marker.on('drag', (event) => {
            const newLatLng = event.target.getLatLng();
            this.bezierBoundaryPoints[index] = newLatLng;
            this.ellipsePolygon.setLatLngs([this.bezierBoundaryPoints]);
          });

          this.controlMarkers.push(marker);
        });

        if (this.bezierBoundaryPoints.length > 0) {
          const bounds = L.latLngBounds(this.bezierBoundaryPoints);
          this.map.fitBounds(bounds, { padding: [20, 20] });
        }
      },
      error: (err) => {
        console.error('Error fetching Bézier segments:', err);
        this.backendResponse = 'Failed to fetch Bézier segments.';
      },
    });
  }

  async drawEllipse(): Promise<void> {
    if (!this.map || this.bezierBoundaryPoints.length === 0) {
      alert('Please generate the ellipse before checking elevation.');
      return;
    }

    this.backendResponse = 'Distorting ellipse based on elevation...';

    const centerLat = this.ellipseInput.centerY;
    const centerLng = this.ellipseInput.centerX;
    const adjustedPoints: L.LatLng[] = [];

    for (const point of this.bezierBoundaryPoints) {
      try {
        const res: any = await this.ellipseService.getElevationStatus(point.lat, point.lng).toPromise();

        if (res.elevation > this.elevationThreshold) {
          const adjusted = await this.adjustPointInward(point.lat, point.lng, centerLat, centerLng);
          adjustedPoints.push(adjusted);

          L.circleMarker([adjusted.lat, adjusted.lng], {
            radius: 4,
            color: 'red',
            fillOpacity: 1,
          }).addTo(this.map!);
        } else {
          adjustedPoints.push(point);

          L.circleMarker([point.lat, point.lng], {
            radius: 4,
            color: 'green',
            fillOpacity: 1,
          }).addTo(this.map!);
        }

      } catch (err) {
        console.error(`Elevation check failed at (${point.lat}, ${point.lng})`, err);
        adjustedPoints.push(point); // fallback
      }
    }

    if (this.ellipsePolygon) this.map.removeLayer(this.ellipsePolygon);
    this.ellipsePolygon = L.polygon(adjustedPoints, {
      color: 'blue',
      weight: 2,
      fillColor: 'lightblue',
      fillOpacity: 0.4,
    }).addTo(this.map);

    this.backendResponse = 'Curve adjusted based on elevation.';
  }

  async adjustPointInward(lat: number, lng: number, centerLat: number, centerLng: number): Promise<L.LatLng> {
    const steps = 50;
    for (let i = 1; i <= steps; i++) {
      const factor = i / steps;
      const newLat = lat + (centerLat - lat) * factor;
      const newLng = lng + (centerLng - lng) * factor;

      try {
        const res: any = await this.ellipseService.getElevationStatus(newLat, newLng).toPromise();
        if (res.elevation <= this.elevationThreshold) {
          return L.latLng(newLat, newLng);
        }
      } catch (error) {
        console.error(`Error checking elevation for (${newLat}, ${newLng})`, error);
      }
    }

    return L.latLng(lat, lng); // fallback if no valid point found
  }

  interpolateBezier(segment: any[], steps: number): number[][] {
    const [p0, p1, p2, p3] = segment;
    const points = [];

    for (let t = 0; t <= 1; t += 1 / steps) {
      const x =
        Math.pow(1 - t, 3) * p0[0] +
        3 * Math.pow(1 - t, 2) * t * p1[0] +
        3 * (1 - t) * t * t * p2[0] +
        t * t * t * p3[0];

      const y =
        Math.pow(1 - t, 3) * p0[1] +
        3 * Math.pow(1 - t, 2) * t * p1[1] +
        3 * (1 - t) * t * t * p2[1] +
        t * t * t * p3[1];

      points.push([x, y]);
    }

    return points;
  }
}
