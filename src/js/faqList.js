if (document.querySelector('.faq-list')) {

    const showHideContent = (content, isExpanded) => {
        content.style.height = content.scrollHeight + 'px';
        content.classList.toggle('faq-list__content_collapsed', !isExpanded);

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

    function onParentItemClick(item) {
        let button = item.querySelector('.faq-list__btn-collapse');
        let contentToCollapse = item.nextElementSibling;

        if (item.getAttribute('aria-expanded') && item.getAttribute('aria-expanded') === 'true') {
            item.setAttribute('aria-expanded', 'false');
            button.classList.add('faq-list__btn-collapse_collapsed');
            showHideContent(contentToCollapse, false);
        } else {
            item.setAttribute('aria-expanded', 'true');
            button.classList.remove('faq-list__btn-collapse_collapsed');
            showHideContent(contentToCollapse, true);
        }
    }

    document.querySelectorAll('.faq-list__item').forEach(item => {
        let button = item.querySelector('.faq-list__btn-collapse');
        let contentToCollapse = item.nextElementSibling;

        console.log(contentToCollapse);

        if (item.getAttribute('aria-expanded') && item.getAttribute('aria-expanded') === 'true') {
            button.classList.remove('faq-list__btn-collapse_collapsed');
            showHideContent(contentToCollapse, true);
        } else {
            button.classList.add('faq-list__btn-collapse_collapsed');
            showHideContent(contentToCollapse, false);
        }

        item.addEventListener('click', () => onParentItemClick(item));
    });
}
