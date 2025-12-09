// Interception Observer
const animatedElements = document.querySelectorAll(
	".show-up, .show-down, .show-left, .show-right, .bounce-in, .rotate-left, .rotate-right"
);

const observer = new IntersectionObserver(
	(entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("animated");
				observer.unobserve(entry.target);
			}
		});
	},
	{ root: null, rootMargin: "0px", threshold: 0.2 }
);

animatedElements.forEach((el) => observer.observe(el));

// Configuración de partículas
const canvas = document.getElementById("particles-bg");
const ctx = canvas.getContext("2d");

// Ajustar canvas al tamaño de la ventana
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Estilos
const particleColor = "#006dff";
const lineColor = "rgba(0, 109, 255, 0.15)";
const particleCount = 80;
const maxDistance = 150;
const speed = 0.5;

// Array de partículas
let particles = [];

class Particle {
	constructor() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.size = Math.random() * 3 + 1;
		this.speedX = (Math.random() - 0.5) * speed;
		this.speedY = (Math.random() - 0.5) * speed;
	}

	update() {
		this.x += this.speedX;
		this.y += this.speedY;

		// Rebote en bordes
		if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
		if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = particleColor;
		ctx.shadowBlur = 8;
		ctx.shadowColor = particleColor;
		ctx.fill();
	}
}

// Crear partículas
function init() {
	particles = [];
	for (let i = 0; i < particleCount; i++) {
		particles.push(new Particle());
	}
}

// Animación
function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	particles.forEach((p) => {
		p.update();
		p.draw();
	});

	// Dibujar líneas entre partículas cercanas
	for (let i = 0; i < particles.length; i++) {
		for (let j = i + 1; j < particles.length; j++) {
			const dx = particles[i].x - particles[j].x;
			const dy = particles[i].y - particles[j].y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < maxDistance) {
				ctx.beginPath();
				ctx.moveTo(particles[i].x, particles[i].y);
				ctx.lineTo(particles[j].x, particles[j].y);
				ctx.strokeStyle = lineColor;
				ctx.lineWidth = 1 - distance / maxDistance;
				ctx.stroke();
			}
		}
	}

	requestAnimationFrame(animate);
}

// Iniciar
init();
animate();

// Responsive: reiniciar partículas al redimensionar
window.addEventListener("resize", () => {
	resizeCanvas();
	init();
});
