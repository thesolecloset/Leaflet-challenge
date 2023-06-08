
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var earthquakemap = L.map("map", 
{
    center: [37.09, -95.71],
    zoom: 5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Improve This Map</a> Improve This Map'
}).addTo(earthquakemap);

d3.json(url).then(function (data) 
{
    function mapStyle(feature) 
    {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    function mapColor(depth) 
    {
        switch (true) 
        {
            case depth > 90:
                return "red";
            case depth > 70:
                return "blue";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "brown";
            case depth > 10:
                return "yellow";
            default:
                return "green";
        }
    }

    function mapRadius(mag) 
    {
        if (mag === 0) 
        {
            return 1;
        }

        return mag * 5;
    }

    // Add earthquake data to the map
    L.geoJson(data, 
        {
        pointToLayer: function (feature, latlng) 
        {
            return L.circleMarker(latlng);
        },

        style: mapStyle,

        // Activate pop-up data when circles are clicked
        onEachFeature: function (feature, layer) 
        {
            layer.bindPopup("Magnitude - " + feature.properties.mag + "<br>Location - " + feature.properties.place + "<br>Depth - " + feature.geometry.coordinates[2]);

        }
    }).addTo(earthquakemap);

let legend = L.control({ position: "bottomright" });
legend.onAdd = function(earthquakemap) 
{
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<i style="background: lightgreen"></i><span>-10 - 10</span><br>';
    div.innerHTML += '<i style="background: yellow"></i><span>10 - 30</span><br>';
    div.innerHTML += '<i style="background: brown"></i><span>30 - 50</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>50 - 70</span><br>';
    div.innerHTML += '<i style="background: blue"></i><span>70 - 90</span><br>';
    div.innerHTML += '<i style="background: red"></i><span>90+</span><br>';
    return div;
};

legend.addTo(earthquakemap)
});