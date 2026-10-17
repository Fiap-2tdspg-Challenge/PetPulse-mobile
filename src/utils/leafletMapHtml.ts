/**
 * HTML de um mapa Leaflet com tiles do OpenStreetMap, pra rodar dentro de um
 * WebView. Sem chave, sem custo — evita a exigência de billing do Maps SDK
 * nativo do Google (ver services/geocodingApi.ts pro mesmo raciocínio
 * aplicado ao endereço reverso).
 *
 * Expõe window.atualizarPosicao(lat, lng) pra mover o marcador sem recarregar
 * a página inteira — chamado via WebView.injectJavaScript a cada atualização
 * de GPS, pra não re-renderizar o mapa do zero toda hora.
 */
export function gerarHtmlMapaLeaflet(latitude: number, longitude: number, corMarcador: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
    .leaflet-control-attribution { font-size: 9px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    }).setView([${latitude}, ${longitude}], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    var marcador = L.circleMarker([${latitude}, ${longitude}], {
      radius: 10,
      color: '#ffffff',
      weight: 3,
      fillColor: '${corMarcador}',
      fillOpacity: 1,
    }).addTo(map);

    window.atualizarPosicao = function (lat, lng) {
      var novaPos = [lat, lng];
      marcador.setLatLng(novaPos);
      map.flyTo(novaPos, map.getZoom(), { duration: 0.5 });
    };
  </script>
</body>
</html>`;
}
