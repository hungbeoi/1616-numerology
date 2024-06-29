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

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const phone = document.getElementById('phonenumber').value;
        const birthday = document.getElementById('birthday').value;

        fetch('https://script.google.com/macros/s/AKfycbzKzRtfDhIqoJqBZ0ZYee6TCCfIBKeHTrmkIesnMYdurPfAiUzjv2aiuyQrKecTSB2V/exec', {  // Replace YOUR_WEB_APP_URL with the URL from the Apps Script deployment
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message, phone, birthday })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
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

    // Generate QR Code
    const qrCode = new QRCode(qrCodeContainer, {
        text: "https://zalo.me/g/dclxhb456",
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
});
