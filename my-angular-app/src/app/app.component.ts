// import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import * as L from 'leaflet';
// import { CommonModule } from '@angular/common';
// import { EllipseService } from './ellipse.service';

// interface EditablePolyline extends L.Polyline {
//   enableEdit?: () => void;
// }

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {
//   backendMessage: string = '';
//   backendResponse: string = '';

//   ellipseInput = {
//     semiMajor: 0,
//     semiMinor: 0,
//     centerX: 0,
//     centerY: 0,
//   };

//   map: L.Map | null = null;

//   options: L.MapOptions = {
//     layers: [
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; OpenStreetMap contributors',
//       }),
//     ],
//     zoom: 7,
//     center: L.latLng(20.5937, 78.9629),
//   };

//   constructor(private http: HttpClient, private ellipseService: EllipseService) {}

//   ngOnInit() {
//     this.loadLeafletEditableSafely();
//   }

//   loadLeafletEditableSafely() {
//     let attempts = 0;
//     const maxAttempts = 50;
//     const checkEditableLoaded = () => {
//       if ((L as any).Editable) {
//         console.log('✅ Leaflet.Editable is available.');
//       } else {
//         if (attempts < maxAttempts) {
//           attempts++;
//           console.warn(`⏳ Waiting for Leaflet.Editable... attempt ${attempts}`);
//           setTimeout(checkEditableLoaded, 200);
//         } else {
//           console.error('❌ Leaflet.Editable failed to load after max attempts.');
//         }
//       }
//     };
//     checkEditableLoaded();
//   }

//   onMapReady(mapInstance: L.Map) {
//     this.map = mapInstance;
//     (this.map as any).options.editable = true;
//     if (!(this.map as any).editTools && (L as any).Editable) {
//       (this.map as any).editTools = new (L as any).Editable(this.map);
//     }

//     if ((this.map as any).editTools) {
//       console.log('✅ editTools loaded:', (this.map as any).editTools);
//     } else {
//       console.warn('⚠️ editTools is still undefined. Check leaflet.editable.js inclusion.');
//     }
//   }

//   submitEllipse() {
//     this.http.post<any>('http://localhost:8081/bezier', this.ellipseInput).subscribe({
//       next: (response) => {
//         this.backendResponse = 'Bezier curve data received.';
//         const bezierSegments = response.bezierCurve;

//         console.log('Raw bezierCurve:', JSON.stringify(bezierSegments));
//         if (!this.map) return;

//         this.map.eachLayer((layer) => {
//           if ((layer as any)._path || (layer as any) instanceof L.Polyline) {
//             if (!(layer as any)._url) {
//               this.map!.removeLayer(layer);
//             }
//           }
//         });

//         const editTools = (this.map as any).editTools;
//         if (!editTools || typeof editTools.startPolyline !== 'function') {
//           console.error('❌ editTools or startPolyline not available.');
//           return;
//         }

//         const allLatLngs: L.LatLng[] = [];
//         const zoom = this.map.getZoom();
//         const steps = Math.max(4, Math.floor(zoom * 1.5));

//         bezierSegments.forEach((segment: any, index: number) => {
//           if (!Array.isArray(segment) || segment.length !== 4) {
//             console.warn(`Skipping invalid segment [${index}]`, segment);
//             return;
//           }

//           const interpolated = this.interpolateBezier(segment, steps);
//           const latLngs = interpolated.map(([x, y]) => L.latLng(y, x));
//           allLatLngs.push(...latLngs);

//           const line = editTools.startPolyline(latLngs, {
//             color: 'red',
//             weight: 2,
//           }) as EditablePolyline;

//           line.enableEdit?.();

//           latLngs.forEach((point) => this.checkElevation(point.lat, point.lng));
//         });

//         if (allLatLngs.length > 0) {
//           const bounds = L.latLngBounds(allLatLngs);
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
//     if (!this.map) return;

//     const { centerX, centerY, semiMajor, semiMinor } = this.ellipseInput;
//     const center = L.latLng(centerY, centerX);

//     // Step 1: Check center elevation before drawing
//     this.ellipseService.getElevationStatus(center.lat, center.lng).subscribe({
//       next: (res) => {
//         if (!this.map) return;

//         if (!res.isSafe) {
//           // Only show red marker at center if unsafe
//           L.circleMarker([center.lat, center.lng], {
//             radius: 8,
//             color: 'red',
//             fillColor: 'red',
//             fillOpacity: 0.9,
//           }).addTo(this.map!);

//           alert('❌ Elevation too high at center point! Ellipse not drawn.');
//           return;
//         }

//         // Step 2: Safe – clear map layers
//         this.map.eachLayer((layer) => {
//           if ((layer as any)._path || (layer as any) instanceof L.Polyline || (layer as any) instanceof L.CircleMarker) {
//             if (!(layer as any)._url) {
//               this.map!.removeLayer(layer);
//             }
//           }
//         });

//         // Step 3: Add green center marker
//         L.circleMarker([center.lat, center.lng], {
//           radius: 8,
//           color: 'green',
//           fillColor: 'green',
//           fillOpacity: 0.9,
//         }).addTo(this.map);

//         // Step 4: Draw ellipse shape
//         const ellipseLatLngs: L.LatLng[] = [];
//         for (let angle = 0; angle <= 360; angle += 5) {
//           const rad = (angle * Math.PI) / 180;
//           const dx = semiMajor * Math.cos(rad);
//           const dy = semiMinor * Math.sin(rad);

//           const lat = center.lat + (dy / 111000);
//           const lng = center.lng + (dx / (111000 * Math.cos(center.lat * Math.PI / 180)));

//           ellipseLatLngs.push(L.latLng(lat, lng));
//         }
//         ellipseLatLngs.push(ellipseLatLngs[0]);

//         const ellipsePolyline = L.polyline(ellipseLatLngs, {
//           color: 'blue',
//           weight: 2,
//           dashArray: '5,5',
//         }).addTo(this.map);

//         this.map.fitBounds(ellipsePolyline.getBounds());

//         // Step 5: Plot internal elevation points
//         this.plotInnerPoints(center, semiMajor, semiMinor, 30);
//       },
//       error: (err) => {
//         console.error(`Elevation check failed for center (${center.lat}, ${center.lng}):`, err);
//         alert('⚠️ Could not check elevation. Ellipse not drawn.');
//       },
//     });
//   }

//   plotInnerPoints(center: L.LatLng, semiMajor: number, semiMinor: number, numPoints: number) {
//     for (let i = 0; i < numPoints; i++) {
//       const theta = 2 * Math.PI * Math.random();
//       const r = Math.sqrt(Math.random());

//       const x = r * semiMajor * Math.cos(theta);
//       const y = r * semiMinor * Math.sin(theta);

//       const lat = center.lat + (y / 111000);
//       const lng = center.lng + (x / (111000 * Math.cos(center.lat * Math.PI / 180)));

//       this.checkElevation(lat, lng);
//     }
//   }

//   checkElevation(lat: number, lon: number) {
//     this.ellipseService.getElevationStatus(lat, lon).subscribe({
//       next: (res) => {
//         if (!this.map) return;

//         const color = res.isSafe ? 'green' : 'red';

//         L.circleMarker([lat, lon], {
//           radius: 6,
//           color,
//           fillColor: color,
//           fillOpacity: 0.9,
//         }).addTo(this.map!);
//       },
//       error: (err) => {
//         console.error(`Elevation check failed for (${lat}, ${lon}):`, err);
//       },
//     });
//   }

//   interpolateBezier(points: number[][], steps: number): number[][] {
//     const result: number[][] = [];
//     for (let i = 0; i <= steps; i++) {
//       const t = i / steps;
//       const x = this.cubicBezier(t, points[0][0], points[1][0], points[2][0], points[3][0]);
//       const y = this.cubicBezier(t, points[0][1], points[1][1], points[2][1], points[3][1]);
//       result.push([x, y]);
//     }
//     return this.filterClosePoints(result, 5000);
//   }

//   filterClosePoints(points: number[][], minDistMeters: number): number[][] {
//     if (points.length === 0) return [];

//     const filtered: number[][] = [points[0]];
//     let last = L.latLng(points[0][1], points[0][0]);

//     for (const [x, y] of points.slice(1)) {
//       const current = L.latLng(y, x);
//       if (last.distanceTo(current) >= minDistMeters) {
//         filtered.push([x, y]);
//         last = current;
//       }
//     }

//     return filtered;
//   }

//   cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
//     const oneMinusT = 1 - t;
//     return (
//       oneMinusT ** 3 * p0 +
//       3 * oneMinusT ** 2 * t * p1 +
//       3 * oneMinusT * t ** 2 * p2 +
//       t ** 3 * p3
//     );
//   }
// }



import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { EllipseService } from './ellipse.service';

interface EditablePolyline extends L.Polyline {
  enableEdit?: () => void;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  backendMessage: string = '';
  backendResponse: string = '';

  ellipseInput = {
    semiMajor: 0,
    semiMinor: 0,
    centerX: 0,
    centerY: 0,
  };

  map: L.Map | null = null;

  options: L.MapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
    ],
    zoom: 7,
    center: L.latLng(20.5937, 78.9629),
  };

  constructor(private http: HttpClient, private ellipseService: EllipseService) {}

  ngOnInit() {
    const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    this.loadLeafletEditableSafely();
  }

  loadLeafletEditableSafely() {
    let attempts = 0;
    const maxAttempts = 50;
    const checkEditableLoaded = () => {
      if ((L as any).Editable) {
        console.log('✅ Leaflet.Editable is available.');
      } else {
        if (attempts < maxAttempts) {
          attempts++;
          console.warn(`⏳ Waiting for Leaflet.Editable... attempt ${attempts}`);
          setTimeout(checkEditableLoaded, 200);
        } else {
          console.error('❌ Leaflet.Editable failed to load after max attempts.');
        }
      }
    };
    checkEditableLoaded();
  }

  onMapReady(mapInstance: L.Map) {
    this.map = mapInstance;
    (this.map as any).options.editable = true;
    if (!(this.map as any).editTools && (L as any).Editable) {
      (this.map as any).editTools = new (L as any).Editable(this.map);
    }

    if ((this.map as any).editTools) {
      console.log('✅ editTools loaded:', (this.map as any).editTools);
    } else {
      console.warn('⚠️ editTools is still undefined. Check leaflet.editable.js inclusion.');
    }
  }

  submitEllipse() {
    this.http.post<any>('http://localhost:8081/bezier', this.ellipseInput).subscribe({
      next: (response: any) => {
        this.backendResponse = 'Bezier curve data received.';
        const bezierSegments = response.bezierCurve;

        console.log('Raw bezierCurve:', JSON.stringify(bezierSegments));
        if (!this.map) return;

        this.map.eachLayer((layer) => {
          if ((layer as any)._path || (layer as any) instanceof L.Polyline) {
            if (!(layer as any)._url) {
              this.map!.removeLayer(layer);
            }
          }
        });

        const editTools = (this.map as any).editTools;
        if (!editTools || typeof editTools.startPolyline !== 'function') {
          console.error('❌ editTools or startPolyline not available.');
          return;
        }

        const allLatLngs: L.LatLng[] = [];
        const zoom = this.map.getZoom();
        const steps = Math.max(4, Math.floor(zoom * 1.5));

        bezierSegments.forEach((segment: any, index: number) => {
          if (!Array.isArray(segment) || segment.length !== 4) {
            console.warn(`Skipping invalid segment [${index}]`, segment);
            return;
          }

          const interpolated = this.interpolateBezier(segment, steps);
          const latLngs = interpolated.map(([x, y]) => L.latLng(y, x));
          allLatLngs.push(...latLngs);

          const line = editTools.startPolyline(latLngs, {
            color: 'red',
            weight: 2,
          }) as EditablePolyline;

          line.enableEdit?.();

          latLngs.forEach((point) => this.checkElevation(point.lat, point.lng));
        });

        if (allLatLngs.length > 0) {
          const bounds = L.latLngBounds(allLatLngs);
          this.map.fitBounds(bounds, { padding: [20, 20] });
        }
      },
      error: (err: any) => {
        console.error('Error fetching Bézier segments:', err);
        this.backendResponse = 'Failed to fetch Bézier segments.';
      },
    });
  }

  drawEllipse() {
    if (!this.map) return;

    const { centerX, centerY, semiMajor, semiMinor } = this.ellipseInput;
    const center = L.latLng(centerY, centerX);

    this.ellipseService.getElevationStatus(center.lat, center.lng).subscribe({
      next: (res: any) => {
        if (!this.map) return;

        if (!res.isSafe) {
          L.circleMarker([center.lat, center.lng], {
            radius: 8,
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.9,
          }).addTo(this.map!);

          alert('❌ Elevation too high at center point! Ellipse not drawn.');
          return;
        }

        this.map.eachLayer((layer) => {
          if ((layer as any)._path || (layer as any) instanceof L.Polyline || (layer as any) instanceof L.CircleMarker) {
            if (!(layer as any)._url) {
              this.map!.removeLayer(layer);
            }
          }
        });

        L.circleMarker([center.lat, center.lng], {
          radius: 8,
          color: 'green',
          fillColor: 'green',
          fillOpacity: 0.9,
        }).addTo(this.map);

        const ellipseLatLngs: L.LatLng[] = [];
        for (let angle = 0; angle <= 360; angle += 5) {
          const rad = (angle * Math.PI) / 180;
          const dx = semiMajor * Math.cos(rad);
          const dy = semiMinor * Math.sin(rad);

          const lat = center.lat + dy / 111000;
          const lng = center.lng + dx / (111000 * Math.cos(center.lat * Math.PI / 180));

          ellipseLatLngs.push(L.latLng(lat, lng));
        }
        ellipseLatLngs.push(ellipseLatLngs[0]);

        const ellipsePolyline = L.polyline(ellipseLatLngs, {
          color: 'blue',
          weight: 2,
          dashArray: '5,5',
        }).addTo(this.map);

        this.map.fitBounds(ellipsePolyline.getBounds());

        this.plotInnerPoints(center, semiMajor, semiMinor, 30);
      },
      error: (err: any) => {
        console.error(`Elevation check failed for center (${center.lat}, ${center.lng}):`, err);
        alert('⚠️ Could not check elevation. Ellipse not drawn.');
      },
    });
  }

  plotInnerPoints(center: L.LatLng, semiMajor: number, semiMinor: number, numPoints: number) {
    for (let i = 0; i < numPoints; i++) {
      const theta = 2 * Math.PI * Math.random();
      const r = Math.sqrt(Math.random());

      const x = r * semiMajor * Math.cos(theta);
      const y = r * semiMinor * Math.sin(theta);

      const lat = center.lat + y / 111000;
      const lng = center.lng + x / (111000 * Math.cos(center.lat * Math.PI / 180));

      this.checkElevation(lat, lng);
    }
  }

  checkElevation(lat: number, lon: number) {
    this.ellipseService.getElevationStatus(lat, lon).subscribe({
      next: (res: any) => {
        if (!this.map) return;

        const color = res.isSafe ? 'green' : 'red';

        L.circleMarker([lat, lon], {
          radius: 6,
          color,
          fillColor: color,
          fillOpacity: 0.9,
        }).addTo(this.map!);
      },
      error: (err: any) => {
        console.error(`Elevation check failed for (${lat}, ${lon}):`, err);
      },
    });
  }

  interpolateBezier(points: number[][], steps: number): number[][] {
    const result: number[][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = this.cubicBezier(t, points[0][0], points[1][0], points[2][0], points[3][0]);
      const y = this.cubicBezier(t, points[0][1], points[1][1], points[2][1], points[3][1]);
      result.push([x, y]);
    }
    return this.filterClosePoints(result, 5000);
  }

  filterClosePoints(points: number[][], minDistMeters: number): number[][] {
    if (points.length === 0) return [];

    const filtered: number[][] = [points[0]];
    let last = L.latLng(points[0][1], points[0][0]);

    for (const [x, y] of points.slice(1)) {
      const current = L.latLng(y, x);
      if (last.distanceTo(current) >= minDistMeters) {
        filtered.push([x, y]);
        last = current;
      }
    }

    return filtered;
  }

  cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const oneMinusT = 1 - t;
    return (
      oneMinusT ** 3 * p0 +
      3 * oneMinusT ** 2 * t * p1 +
      3 * oneMinusT * t ** 2 * p2 +
      t ** 3 * p3
    );
  }
}
