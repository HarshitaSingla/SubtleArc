(function(factory) {
  if (typeof window !== 'undefined' && window.L) {
    factory(window.L);
  } else {
    console.error("❌ Leaflet must be loaded before Leaflet.Editable.");
  }
})(function(L) {

  // Core editable handler
  L.Editable = L.Handler.extend({
    initialize: function (map, options) {
      this._map = map;
      L.setOptions(this, options);
    },
    addHooks: function () {},
    removeHooks: function () {},

    startPolyline: function (latlngs, options) {
      const poly = L.polyline(latlngs, options).addTo(this._map);
      poly.enableEdit();
      return poly;
    },

    startPolygon: function (latlngs, options) {
      const poly = L.polygon(latlngs, options).addTo(this._map);
      poly.enableEdit();
      return poly;
    },

    addEditableMarker: function (latlng, options) {
      const marker = L.marker(latlng, Object.assign({ draggable: true }, options)).addTo(this._map);
      marker.on('dragend', e => {
        console.log('📍 Marker moved to', e.target.getLatLng());
      });
      return marker;
    }
  });

  // Register as editTools on map
  L.Map.addInitHook('addHandler', 'editTools', L.Editable);

  // Polyline + Polygon editing
  [L.Polyline, L.Polygon].forEach(Shape => {
    Shape.include({
      enableEdit: function () {
        if (!this._map || !this._map.editTools) return;

        const latlngs = this.getLatLngs();
        const flat = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;

        this._editorMarkers = flat.map((latlng, idx) => {
          const marker = L.circleMarker(latlng, {
            radius: 5,
            color: 'blue',
            weight: 1,
            fillColor: '#08f',
            fillOpacity: 0.7,
            draggable: true
          }).addTo(this._map);

          marker.on('drag', e => {
            flat[idx] = e.target.getLatLng();
            this.setLatLngs([flat]);
          });

          marker.on('dblclick', () => {
            flat.splice(idx, 1);
            this.setLatLngs([flat]);
            this._map.removeLayer(marker);
            if (this._editorMarkers) {
              this._editorMarkers = this._editorMarkers.filter(m => m !== marker);
            }
          });

          return marker;
        });
      },

      disableEdit: function () {
        if (this._editorMarkers) {
          this._editorMarkers.forEach(m => this._map.removeLayer(m));
          this._editorMarkers = null;
        }
      }
    });
  });

});


//with draggable vertices enabled 


// (function(factory) {
//   if (typeof window !== 'undefined' && window.L) {
//     factory(window.L);
//   } else {
//     console.error("❌ Leaflet must be loaded before Leaflet.Editable.");
//   }
// })(function(L) {

//   // Core editable handler
//   L.Editable = L.Handler.extend({
//     initialize: function (map, options) {
//       this._map = map;
//       L.setOptions(this, options);
//     },
//     addHooks: function () {},
//     removeHooks: function () {},

//     startPolyline: function (latlngs, options) {
//       const poly = L.polyline(latlngs, options).addTo(this._map);
//       poly.enableEdit();
//       return poly;
//     },

//     startPolygon: function (latlngs, options) {
//       const poly = L.polygon(latlngs, options).addTo(this._map);
//       poly.enableEdit();
//       return poly;
//     },

//     addEditableMarker: function (latlng, options) {
//       const marker = L.marker(latlng, Object.assign({ draggable: true }, options)).addTo(this._map);
//       marker.on('dragend', e => {
//         console.log('📍 Marker moved to', e.target.getLatLng());
//       });
//       return marker;
//     }
//   });

//   // Register as editTools on map
//   L.Map.addInitHook('addHandler', 'editTools', L.Editable);

//   // Polyline + Polygon editing
//   [L.Polyline, L.Polygon].forEach(Shape => {
//     Shape.include({
//       enableEdit: function () {
//         if (!this._map || !this._map.editTools) return;

//         const shape = this;
//         const latlngs = this.getLatLngs();
//         const flat = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;

//         this._editorMarkers = flat.map((latlng, idx) => {
//           const marker = L.marker(latlng, {
//             draggable: true,
//             icon: L.divIcon({
//               className: 'vertex-marker',
//               iconSize: [10, 10]
//             })
//           }).addTo(this._map);

//           // Update polyline/polygon on drag
//           marker.on('drag', e => {
//             flat[idx] = e.target.getLatLng();
//             shape.setLatLngs([flat]);
//           });

//           // Remove vertex on double-click
//           marker.on('dblclick', () => {
//             flat.splice(idx, 1);
//             shape.setLatLngs([flat]);
//             shape._map.removeLayer(marker);
//             if (shape._editorMarkers) {
//               shape._editorMarkers = shape._editorMarkers.filter(m => m !== marker);
//             }
//           });

//           return marker;
//         });
//       },

//       disableEdit: function () {
//         if (this._editorMarkers) {
//           this._editorMarkers.forEach(m => this._map.removeLayer(m));
//           this._editorMarkers = null;
//         }
//       }
//     });
//   });

// });

//draggable enabled(up code)





//draggable vertices(better than before, but needs error rectification (down))

// (function(factory) {
//   if (typeof window !== 'undefined' && window.L) {
//     factory(window.L);
//   } else {
//     console.error("❌ Leaflet must be loaded before Leaflet.Editable.");
//   }
// })(function(L) {

//   // Core editable handler
//   L.Editable = L.Handler.extend({
//     initialize: function (map, options) {
//       this._map = map;
//       L.setOptions(this, options);
//     },
//     addHooks: function () {},
//     removeHooks: function () {},

//     startPolyline: function (latlngs, options) {
//       const poly = L.polyline(latlngs, options).addTo(this._map);
//       poly.enableEdit();
//       return poly;
//     },

//     startPolygon: function (latlngs, options) {
//       const poly = L.polygon(latlngs, options).addTo(this._map);
//       poly.enableEdit();
//       return poly;
//     },

//     addEditableMarker: function (latlng, options) {
//       const marker = L.marker(latlng, Object.assign({ draggable: true }, options)).addTo(this._map);
//       marker.on('dragend', e => {
//         console.log('📍 Marker moved to', e.target.getLatLng());
//       });
//       return marker;
//     }
//   });

//   // Register as editTools on map
//   L.Map.addInitHook('addHandler', 'editTools', L.Editable);

//   // Polyline + Polygon editing
//   [L.Polyline, L.Polygon].forEach(Shape => {
//     Shape.include({
//       enableEdit: function () {
//         if (!this._map || !this._map.editTools) return;

//         const shape = this;
//         const latlngs = this.getLatLngs();
//         const flat = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;

//         this._editorMarkers = flat.map((latlng, idx) => {
//           const marker = L.marker(latlng, {
//             draggable: true,
//             icon: L.divIcon({
//               className: 'vertex-marker',
//               iconSize: [10, 10]
//             })
//           }).addTo(this._map);

//           // 🟦 Drag handler to update shape
//           marker.on('drag', e => {
//             flat[idx] = e.target.getLatLng();
//             shape.setLatLngs([flat]);
//           });

//           // 🗑️ Safe delete on double-click
//           marker.on('dblclick', () => {
//             flat.splice(idx, 1);
//             shape.setLatLngs([flat]);

//             if (marker._map) {
//               marker._map.removeLayer(marker);
//             }

//             if (shape._editorMarkers) {
//               shape._editorMarkers = shape._editorMarkers.filter(m => m !== marker);
//             }
//           });

//           return marker;
//         });
//       },

//       disableEdit: function () {
//         if (this._editorMarkers) {
//           this._editorMarkers.forEach(m => {
//             if (m._map) m._map.removeLayer(m);
//           });
//           this._editorMarkers = null;
//         }
//       }
//     });
//   });

// });