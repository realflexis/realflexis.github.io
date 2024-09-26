const canvas = document.getElementById('ballCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

let ballColor = "rgb(0,0,255)";
let circleColor = "rgb(255,255,255)";
let glowEffect = "none";
let bounceEffect = "growBall";

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    dx: 2,
    dy: 2,
    color: ballColor,
    glow: false
};

let circle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 150,
    color: circleColor,
    glow: false
};

let soundPlaying = false;
const bounceSound = document.getElementById('bounceSound');

document.getElementById('ballColor').addEventListener('change', (e) => {
    ballColor = e.target.value;
});

document.getElementById('circleColor').addEventListener('change', (e) => {
    circleColor = e.target.value;
});

document.getElementById('glowEffect').addEventListener('change', (e) => {
    glowEffect = e.target.value;
});

document.getElementById('bounceEffect').addEventListener('change', (e) => {
    bounceEffect = e.target.value;
});

document.getElementById('musicUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            bounceSound.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('startGame').addEventListener('click', startGame);

function startGame() {
    ball.radius = 20; // Reset ball size
    circle.radius = 150; // Reset circle size
    requestAnimationFrame(draw);
}

function applyGlowEffect() {
    if (glowEffect === 'ballOnly') {
        ball.glow = true;
        circle.glow = false;
    } else if (glowEffect === 'circleOnly') {
        ball.glow = false;
        circle.glow = true;
    } else if (glowEffect === 'both') {
        ball.glow = true;
        circle.glow = true;
    } else {
        ball.glow = false;
        circle.glow = false;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    applyGlowEffect();

    // Draw circle
    if (circle.glow) {
        ctx.save();
        ctx.shadowColor = circleColor;
        ctx.shadowBlur = 20;
    }
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = circleColor;
    ctx.fill();
    ctx.closePath();
    if (circle.glow) ctx.restore();

    // Draw ball
    if (ball.glow) {
        ctx.save();
        ctx.shadowColor = ballColor;
        ctx.shadowBlur = 20;
    }
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
    if (ball.glow) ctx.restore();

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Ball collision with circle
    const distance = Math.hypot(ball.x - circle.x, ball.y - circle.y);
    if (distance < circle.radius) {
        playSound();
        if (bounceEffect === "growBall") {
            ball.radius += 1;
        } else if (bounceEffect === "shrinkCircle") {
            circle.radius -= 2;
        }
    } else {
        stopSound();
    }

    requestAnimationFrame(draw);
}

function playSound() {
    if (!soundPlaying) {
        bounceSound.play();
        soundPlaying = true;
    }
}

function stopSound() {
    if (soundPlaying) {
        bounceSound.pause();
        soundPlaying = false;
    }
}
