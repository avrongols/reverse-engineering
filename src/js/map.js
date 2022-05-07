if (document.querySelector('.map')) {
    const featureGeojson = 
    {
        "type": "Feature",
        "id": 1,
        "properties": {
            "orbis_id": 1
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
                36.242496,
                54.516233
            ]
        }
    }
    
    const pointImage = new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
            color: 'rgb(0, 124, 158)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 124, 158, 0.2)',
            width: 6,
        }),
    });
    
    const styles = {
        'Point': new  ol.style.Style({
            image: pointImage
        }),
    };
    
    const styleFunction = (feature) => {
        return styles[feature.getGeometry().getType()];
    };
    
    const map = new ol.Map({
        target: 'map',
        controls: ol.control.defaults({ attribution: false, zoom: false })
    });
    
    const osmLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
    map.addLayer(osmLayer);
    
    if (featureGeojson.geometry && featureGeojson.geometry.type && featureGeojson.geometry.coordinates) {
        const feature = new ol.format.GeoJSON().readFeature(featureGeojson);
        feature.setGeometry(feature.getGeometry().transform('EPSG:4326', 'EPSG:3857'));
    
        if (feature.getGeometry().getType() !== 'GeometryCollection') {
            const layerSource = new ol.source.Vector({
                features: [ feature ]
            });
    
            map.addLayer(new ol.layer.Vector({
                source: layerSource,
                style: styleFunction
            }));
    
            map.getView().fit(layerSource.getExtent(), { padding: [20, 50, 20, 50], maxZoom: 15 });
        } else {
            const features = new ol.format.GeoJSON().readFeatures(featureGeojson);
            features.forEach(feature => {
                feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
            });
    
            const layerSource = new ol.source.Vector({
                features: features
            });
    
            map.addLayer(new ol.layer.Vector({
                source: layerSource,
                style: styleFunction
            }));
    
            map.getView().fit(layerSource.getExtent(), { padding: [20, 50, 20, 50], maxZoom: 15 });
        }
    } else {
        document.querySelector('.section-footer__map').style.display = 'none';
    }
}