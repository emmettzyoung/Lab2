mapboxgl.accessToken = 'pk.eyJ1IjoiZW1tZXR0eW91bmciLCJhIjoiY21rNGI3Y3Z4MDV3ZjNrcHk2MXFrYTlpeSJ9.nhnMjjZj_o1eyXtp_Y8Svw';

const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/emmettyoung/cmlh2534n006s01qv686sadry',
    center: [-79.38, 43.65],
    zoom: 12
});


map.on('load', () => {

    // Add a data source containing GeoJSON data
    map.addSource('neighbourhoods', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/emmettzyoung/Lab2/main/data/Neighbourhoods.geojson'
    }
    );
    map.addSource('OutdoorArtificialIceRinks', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/emmettzyoung/Lab2/main/data/OutdoorArtificialIceRinks.geojson'
    }
    );
    map.addSource('IndoorIceRinks', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/emmettzyoung/Lab2/main/data/IndoorIceRinks.geojson'
    }
    );
    // Visualize data layer on map
    map.addLayer({
        'id': 'neighbourhoods-fill',
        'type': 'fill',
        'source': 'neighbourhoods',
        'paint': {
            'fill-color': 'white',
            'fill-opacity': 0.5
        }
    });
    map.addLayer({
        'id': 'neighbourhoods-outline',
        'type': 'line',
        'source': 'neighbourhoods',
        'paint': {
            'line-color': '#ff668c',
            'line-width': 3
        }
    });
    map.addLayer({
        'id': 'OutdoorArtificialIceRinks',
        'type': 'circle',
        'source': 'OutdoorArtificialIceRinks',
        'paint': {
            'circle-color': 'royalblue',
            'circle-radius': 5
        }
    });
    map.addLayer({
        'id': 'IndoorIceRinks',
        'type': 'circle',
        'source': 'IndoorIceRinks',
        'paint': {
            'circle-color': 'darkblue',
            'circle-radius': 5
        }
    });
});