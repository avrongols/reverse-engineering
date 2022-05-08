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
if (document.querySelector(".lightbox__modal")) {

    const modal = document.querySelector(".lightbox__modal");
    const modalContent = document.querySelector(".lightbox__modal-content");
    const btnClose = document.querySelector(".lightbox__btn-close");
    const btnPrev = document.querySelector(".lightbox__btn-prev");
    const btnNext = document.querySelector(".lightbox__btn-next");

    const previews = document.querySelectorAll(".button-open-form");
    const slides = document.querySelectorAll(".lightbox__slide");

    let currentSlideIndex;
    let element, bbox, startX, deltaX, raf;

    function isModalActive() {
        return modal.classList.contains('lightbox__modal_active');
    }

    function openModal() {
        modal.classList.add('lightbox__modal_active');
    }

    function closeModal() {
        modal.classList.remove('lightbox__modal_active');
        slides[currentSlideIndex].classList.remove('lightbox__slide_active');
    }

    function setCurrentSlide(n) {
        showSlides(currentSlideIndex = n);
    }

    function plusCurrentSlide(n) {
        if (slides.length > 1) {
            showSlides(currentSlideIndex += n);
        } else {
            closeModal();
        }
    }

    function showSlides(n) {
        if (n > slides.length - 1) { currentSlideIndex = 0 }
        if (n < 0) { currentSlideIndex = slides.length - 1 }
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('lightbox__slide_active');
        }
        slides[currentSlideIndex].classList.add('lightbox__slide_active');
    }

    previews.forEach((preview, i) => {
        preview.addEventListener('click', () => {
            openModal();
            setCurrentSlide(i);
        });
    });

    slides.forEach(slide => {
        slide.ondragstart = () => { return false };
    })

    btnClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) {
        if (isModalActive() && e.key === "Escape") {
            closeModal();
        }
    });

    btnPrev.addEventListener('click', () => { plusCurrentSlide(-1) });
    document.addEventListener('keydown', function(e) {
        if (isModalActive() && e.key === "ArrowLeft") {
            plusCurrentSlide(-1);
        }
    });

    btnNext.addEventListener('click', () => { plusCurrentSlide(1) });
    document.addEventListener('keydown', function(e) {
        if (isModalActive() && e.key === "ArrowRight") {
            plusCurrentSlide(1);
        }
    });

    function userPressed(e) {
        element = e.target;
        if (element.classList.contains('lightbox__slide')) {
            startX = e.clientX;
            bbox = element.getBoundingClientRect();
            modalContent.addEventListener('pointermove', userMoved, { passive: true });
            modalContent.addEventListener('pointerup', userReleased, { passive: true });
            modalContent.addEventListener('pointercancel', userReleased, { passive: true });
        };
    };
      
    function userMoved(e) {
        if (!raf) {
            deltaX = e.clientX - startX;
            raf = requestAnimationFrame(userMovedRaf);
        }
    };
      
    function userMovedRaf() {
        element.style.transform = "translate3d(" + deltaX + "px, 0px, 0px)";
        raf = null;
    };
      
    function userReleased() {
        modalContent.removeEventListener('pointermove', userMoved);
        modalContent.removeEventListener('pointerup', userReleased);
        modalContent.removeEventListener('pointercancel', userReleased);
        if (raf) {
            cancelAnimationFrame(raf);
            raf = null;
        };
        element.style.left = bbox.left + deltaX + "px";
        element.style.transform = "translate3d(0px, 0px, 0px)";
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                plusCurrentSlide(-1);
            } else {
                plusCurrentSlide(1);
            }
        }
        deltaX = null;
    };

    modalContent.addEventListener('pointerdown', userPressed, { passive: true });
}
