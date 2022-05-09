if (document.querySelector('.faq-list')) {

    const showHideContent = (content, isExpanded) => {
        content.style.height = content.scrollHeight + 'px';
        content.classList.toggle('faq-list__content_expanded', isExpanded);

        if (isExpanded) {
            content.addEventListener('transitionend', () => {
                content.style.removeProperty('height');
            }, {
                once: true
            });
        } else {
            window.setTimeout(() => {
                content.style.removeProperty('height');
            });
        }
    }

    function onItemClick(item) {
        let button = item.querySelector('.faq-list__btn-expand');
        let contentToExpand = item.nextElementSibling;

        if (item.getAttribute('aria-expanded') && item.getAttribute('aria-expanded') === 'false') {
            item.setAttribute('aria-expanded', 'true');
            button.classList.add('faq-list__btn-expand_expanded');
            showHideContent(contentToExpand, true);
        } else {
            item.setAttribute('aria-expanded', 'false');
            button.classList.remove('faq-list__btn-expand_expanded');
            showHideContent(contentToExpand, false);
        }
    }

    document.querySelectorAll('.faq-list__item').forEach(item => {
        item.setAttribute('aria-expanded', 'false');
        item.addEventListener('click', () => onItemClick(item));
    });
}

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
if (document.querySelector(".modal")) {

    const openButtons = document.querySelectorAll(".button-open-form");

    const modal = document.querySelector(".modal");
    const modalContent = document.querySelector(".modal__content");


    const isModalActive = (e) => {
        return modal.classList.contains('modal_active');
    }

    const openModal = (e) => {
        modal.classList.add('modal_active');
        document.documentElement.style.overflow = 'hidden';
    }

    const closeModal = (e) => {
        modal.classList.remove('modal_active');
        document.documentElement.style.overflow = 'auto'
    }

    openButtons.forEach((button) => {
        button.addEventListener('click', () => {
            openModal();
        });
    });

    modal.addEventListener('click', (e) => {
        if (!modalContent.contains(e.target)) {
            closeModal();
        }
    });
    document.addEventListener('keydown', function(e) {
        if (isModalActive() && e.key === "Escape") {
            closeModal();
        }
    });

    // Динамическое отображение количества прикреплённых файлов
    let inputs = document.querySelectorAll('.modal__input-files');
        Array.prototype.forEach.call(inputs, function(input) {
            let label = input.nextElementSibling,
    		labelVal = label.innerHTML;

    	input.addEventListener('change', function(e) {
    		let fileName = '';
            if (this.files && this.files.length > 0) {
                fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
            }
    		// if (this.files && this.files.length > 1) {
            //     fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
            //     label.style.whiteSpace = 'nowrap';
            // } else {
            //     fileName = e.target.value.split("\\").pop();
            //     label.style.whiteSpace = 'normal';
            // }
    		if (fileName) {
                label.innerHTML = fileName;
            } else {
                label.innerHTML = labelVal;
            }
    	});
    });

    
}
