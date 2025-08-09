require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GeoJSONLayer",
  "esri/Graphic"
], function(Map, MapView, GeoJSONLayer, Graphic) {

  // 1️⃣ Create the base map
  const map = new Map({
    basemap: "streets-vector"
  });

  // 2️⃣ Create the view
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [122.9763, 10.8003], // Silay City center
    zoom: 12
  });

  // 3️⃣ Load Silay City Boundary from backend
  fetch("/silay-boundary")
    .then(res => res.json())
    .then(geojson => {
      const blob = new Blob([JSON.stringify(geojson)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const boundaryLayer = new GeoJSONLayer({
        url: url,
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: [227, 139, 79, 0.2],
            outline: { color: [255, 69, 0], width: 2 }
          }
        }
      });

      map.add(boundaryLayer);
    })
    .catch(err => console.error("Error loading boundary:", err));

  // 4️⃣ Load Villages from backend
  fetch("/villages")
    .then(res => res.json())
    .then(villages => {
      villages.forEach(v => {
        const point = {
          type: "point",
          longitude: v.lon,
          latitude: v.lat
        };

        const markerSymbol = {
          type: "simple-marker",
          color: "blue",
          outline: { color: "white", width: 1 }
        };

        const pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: { name: v.name },
          popupTemplate: {
            title: "{name}"
          }
        });

        view.graphics.add(pointGraphic);
      });
    })
    .catch(err => console.error("Error loading villages:", err));

});
