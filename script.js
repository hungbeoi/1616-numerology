document.addEventListener('DOMContentLoaded', function() {
    const faders = document.querySelectorAll('.fade-in');
    const boxes = document.querySelectorAll('.box');
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const qrCodeContainer = document.getElementById('qr-code');

    const appearOptions = {
        threshold: 0,
        rootMargin: "0px 0px -200px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    boxes.forEach(box => {
        appearOnScroll.observe(box);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const phone = document.getElementById('phone').value;  // ✅ Sửa lại đúng ID
        const birthday = document.getElementById('birthday').value;

        fetch("http://localhost:3001/send", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
                name: nameValue,
                email: emailValue,
                phone: phoneValue,
                birthday: birthdayValue
             })
            })

        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            if (data.result === 'success') {  // ✅ Sửa lại key đúng với Apps Script
                showSuccessMessage();
                form.reset();
            } else {
                showErrorMessage();
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            showErrorMessage();
        });
    });

    function showSuccessMessage() {
        formMessage.innerHTML = '<div class="success-message">Đăng ký thành công!</div>';
        setTimeout(() => {
            formMessage.innerHTML = '';
        }, 3000);
    }

    function showErrorMessage() {
        formMessage.innerHTML = '<div class="error-message">Đăng ký thất bại, vui lòng thử lại.</div>';
        setTimeout(() => {
            formMessage.innerHTML = '';
        }, 3000);
    }

    // ✅ Thêm thư viện QRCode trước khi gọi đoạn này (trong index.html)
    if (typeof QRCode !== 'undefined') {
        new QRCode(qrCodeContainer, {
            text: "https://zalo.me/g/dclxhb456",
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    } else {
        console.warn("⚠️ QRCode library chưa được load — kiểm tra lại script CDN trong index.html.");
    }
});
