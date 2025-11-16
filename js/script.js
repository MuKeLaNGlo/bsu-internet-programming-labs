// Минималистичный JavaScript для портфолио
document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Заглушка для аватара
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        avatar.addEventListener('error', function() {
            this.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = '<span style="font-size: 2rem; color: white;">М</span>';
        });
    }
});