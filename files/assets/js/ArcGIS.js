define([
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
    center: [122.9763, 10.8003], // Center on Silay City
    zoom: 12
  });

  // 3️⃣ Load Silay City Boundary
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

  // 4️⃣ Barangay data with approximate coordinates
  const barangays = [
    { name: "Bagtic", lat: 10.7686, lon: 123.0409 },
    { name: "Balaring", lat: 10.8225, lon: 122.9601 },
    { name: "Barangay I (Poblacion)", lat: 10.7985, lon: 122.9732 },
    { name: "Barangay II (Poblacion)", lat: 10.7995, lon: 122.9721 },
    { name: "Barangay III (Cinco de Noviembre)", lat: 10.8002, lon: 122.9711 },
    { name: "Barangay IV (Poblacion)", lat: 10.8010, lon: 122.9710 },
    { name: "Barangay V (Poblacion)", lat: 10.8022, lon: 122.9708 },
    { name: "Barangay VI (Hawaiian)", lat: 10.8035, lon: 122.9695 },
    { name: "Eustaquio Lopez", lat: 10.8195, lon: 123.0412 },
    { name: "Guimbala-on", lat: 10.7550, lon: 123.0854 },
    { name: "Guinhalaran", lat: 10.7811, lon: 122.9666 },
    { name: "Kapitan Ramon", lat: 10.7602, lon: 123.1148 },
    { name: "Lantad", lat: 10.8153, lon: 122.9699 },
    { name: "Mambulac", lat: 10.7975, lon: 122.9678 },
    { name: "Patag", lat: 10.8120, lon: 123.1450 },
    { name: "Rizal", lat: 10.8212, lon: 122.9780 }
  ];

  // 5️⃣ Add Barangay markers to the map
  barangays.forEach(b => {
    const point = {
      type: "point",
      longitude: b.lon,
      latitude: b.lat
    };

    const markerSymbol = {
      type: "simple-marker",
      color: [0, 120, 255, 0.9], // Blue
      size: "10px",
      outline: { color: "white", width: 1 }
    };

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
      attributes: { name: b.name },
      popupTemplate: {
        title: "{name}",
        content: "Barangay center of {name} in Silay City."
      }
    });

    view.graphics.add(pointGraphic);
  });

  // 6️⃣ Load villages dynamically from backend
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
          color: "orange",
          size: "8px",
          outline: { color: "white", width: 1 }
        };

        const pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: { name: v.name },
          popupTemplate: {
            title: "{name}",
            content: "Village location: {name}"
          }
        });

        view.graphics.add(pointGraphic);
      });
    })
    .catch(err => console.error("Error loading villages:", err));

  // 7️⃣ Debugging helper: log clicked coordinates
  view.on("click", (event) => {
    const lat = event.mapPoint.latitude.toFixed(6);
    const lon = event.mapPoint.longitude.toFixed(6);
    console.log(`Clicked at Lat: ${lat}, Lon: ${lon}`);
  });

});
