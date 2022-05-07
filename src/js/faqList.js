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
