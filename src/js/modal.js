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
    document.addEventListener('keydown', (e) => {
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

    // Отправка ajax запроса по URL из атрибута формы action
    $(function() {
        $('#form').on('submit', function(e) {
            e.preventDefault();

            let $that = $(this);
            let actionUrl = $that.attr('action');
            let formData = new FormData($that.get(0));

            $.ajax({
                url: actionUrl,
                method: 'POST',
                dataType: 'json',
                contentType: false,
                processData: false,
                data: formData,
                success: (json) => {
                    if (json) {
                        alert('Данные успешно отправлены.');
                    }
                },
                error: (json) => {
                    if (json) {
                        alert('Ошибка. Данные не отправлены.');
                    }
                }
            });
        });
    });
}
