// Access token for Mapbox API
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1tZXR0eW91bmciLCJhIjoiY21rNGI3Y3Z4MDV3ZjNrcHk2MXFrYTlpeSJ9.nhnMjjZj_o1eyXtp_Y8Svw';

// Initialize the map to a const variable so that it cannot be reassigned later on in the code
const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/emmettyoung/cmlh2534n006s01qv686sadry',
    center: [-79.38, 43.65],
    zoom: 12,
    maxBounds: [
        [-80.110931, 43.425996],
        [-78.857117, 44.085612]],
});

// Add geocoder control to the map with a bounding box that limits search results to Toronto
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        region: 'Ontario',
        placeholder: 'Search for a location in Toronto',
        bbox: [-79.6393, 43.5810, -79.1158, 43.8554]
    })
);

// Add zoom and rotation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Load the GeoJSON data for the ice rinks (both indoor and outdoor) and the neighbourhoods, and add them as 
// sources and layers to the map
map.on('load', () => {
    // Add sources for the neighbourhoods and ice rinks, promoting the _id property to be used as a unique 
    // identifier for each feature
    map.addSource('neighbourhoods', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/emmettzyoung/Lab2/main/data/Neighbourhoods.geojson',
        promoteId: '_id'
    });

    map.addSource('OutdoorArtificialIceRinks', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/emmettzyoung/Lab2/main/data/OutdoorArtificialIceRinks.geojson',
        promoteId: '_id'
    });

    map.addSource('IndoorIceRinks', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/emmettzyoung/Lab2/main/data/IndoorIceRinks.geojson',
        promoteId: '_id'
    });
    // Add layers for the neighbourhoods and ice rinks, using the feature state to change the opacity 
    // and size of the features when they are hovered over
    map.addLayer({
        'id': 'neighbourhoods-fill',
        'type': 'fill',
        'source': 'neighbourhoods',
        'paint': {
            'fill-color': '#FFC4C4',
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.7,
                0.2
            ]
        }
    });

    map.addLayer({
        'id': 'neighbourhoods-boundaries',
        'type': 'line',
        'source': 'neighbourhoods',
        'paint': {
            'line-color': 'black',
            'line-width': 2
        }
    });

    map.addLayer({
        'id': 'outdoor-ice-rinks',
        'type': 'circle',
        'source': 'OutdoorArtificialIceRinks',
        'paint': {
            'circle-color': '#c23529',
            'circle-radius': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                16,
                7
            ]
        }
    });

    map.addLayer({
        'id': 'indoor-ice-rinks',
        'type': 'circle',
        'source': 'IndoorIceRinks',
        'paint': {
            'circle-color': '#c23529',
            'circle-radius': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                16,
                7
            ]
        }
    });
});

// Assign variables to keep track of the currently hovered 
// neighbourhood and rink, so that we can reset their feature state when the mouse leaves them
let hoveredNeighbourhoodId = null;
let hoveredRinkId = null;

// Neighbourhood hover
map.on('mousemove', 'neighbourhoods-fill', (e) => {
    if (e.features.length > 0) {
        if (hoveredNeighbourhoodId !== null) {
            map.setFeatureState(
                { source: 'neighbourhoods', id: hoveredNeighbourhoodId },
                { hover: false }
            );
        }
    }

    hoveredNeighbourhoodId = e.features[0].id;
    map.setFeatureState(
        { source: 'neighbourhoods', id: hoveredNeighbourhoodId },
        { hover: true }
    );
});

map.on('mouseleave', 'neighbourhoods-fill', () => {
    if (hoveredNeighbourhoodId !== null) {
        map.setFeatureState(
            { source: 'neighbourhoods', id: hoveredNeighbourhoodId },
            { hover: false }
        );
    }
    hoveredNeighbourhoodId = null;
});

// Indoor rink hover
map.on('mousemove', 'indoor-ice-rinks', (e) => {
    if (e.features.length > 0) {
        if (hoveredRinkId !== null) {
            map.setFeatureState(
                { source: 'IndoorIceRinks', id: hoveredRinkId },
                { hover: false }
            );
        }
    }
    hoveredRinkId = e.features[0].id;
    map.setFeatureState(
        { source: 'IndoorIceRinks', id: hoveredRinkId },
        { hover: true }
    );
});

map.on('mouseleave', 'indoor-ice-rinks', () => {
    if (hoveredRinkId !== null) {
        map.setFeatureState(
            { source: 'IndoorIceRinks', id: hoveredRinkId },
            { hover: false }
        );
    }
    hoveredRinkId = null;
});

// Outdoor rink hover
map.on('mousemove', 'outdoor-ice-rinks', (e) => {
    if (e.features.length > 0) {
        if (hoveredRinkId !== null) {
            map.setFeatureState(
                { source: 'OutdoorArtificialIceRinks', id: hoveredRinkId },
                { hover: false }
            );
        }
    }
    hoveredRinkId = e.features[0].id;
    map.setFeatureState(
        { source: 'OutdoorArtificialIceRinks', id: hoveredRinkId },
        { hover: true }
    );
});

map.on('mouseleave', 'outdoor-ice-rinks', () => {
    if (hoveredRinkId !== null) {
        map.setFeatureState(
            { source: 'OutdoorArtificialIceRinks', id: hoveredRinkId },
            { hover: false }
        );
    }
    hoveredRinkId = null;
});

// Add click event listeners to the neighbourhood and rink layers to show popups with 
// information about the clicked feature
map.on('click', 'neighbourhoods-fill', (e) => {
    new mapboxgl.Popup() // Declare new popup object on each click
        .setLngLat(e.lngLat) // Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Neighbourhood Name:</b> " + e.features[0].properties.AREA_NAME)
        .addTo(map); // Show popup on map
});

map.on('click', 'indoor-ice-rinks', (e) => {
    new mapboxgl.Popup() // Declare new popup object on each click
        .setLngLat(e.lngLat) // Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Indoor Ice Rink:</b> " + e.features[0].properties["Asset Name"])
        .addTo(map); // Show popup on map
});

map.on('click', 'outdoor-ice-rinks', (e) => {
    new mapboxgl.Popup() // Declare new popup object on each click
        .setLngLat(e.lngLat) // Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Outdoor Ice Rink:</b> " + e.features[0].properties["Asset Name"])
        .addTo(map); // Show popup on map
});

// Add event listeners to the radio buttons to toggle the visibility of the indoor and outdoor rink 
// layers based on user preference, ensuring that only one layer is visible at a time to avoid 
// confusion and clutter on the map
document.getElementById('btnoutdoor').addEventListener('change', () => {
    const outdoorLayer = map.getLayer('outdoor-ice-rinks');
    const indoorLayer = map.getLayer('indoor-ice-rinks');

    if (outdoorLayer) map.setLayoutProperty('outdoor-ice-rinks', 'visibility', 'visible');
    if (indoorLayer) map.setLayoutProperty('indoor-ice-rinks', 'visibility', 'none');
});

document.getElementById('btnindoor').addEventListener('change', () => {
    const outdoorLayer = map.getLayer('outdoor-ice-rinks');
    const indoorLayer = map.getLayer('indoor-ice-rinks');

    if (outdoorLayer) map.setLayoutProperty('outdoor-ice-rinks', 'visibility', 'none');
    if (indoorLayer) map.setLayoutProperty('indoor-ice-rinks', 'visibility', 'visible');
});