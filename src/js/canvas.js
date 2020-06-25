import utils, { distance } from './utils';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: 10,
  y: 10
}

const colors = ['#2185C5', '#7ECEFD', '#FF7F66'];

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
})

addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
})

// Objects
class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: (Math.random() - 0.5) * 7,
      y: (Math.random() - 0.5) * 7
    }
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  }

  update(particles) {
    this.draw();

    //Particle coliision and rebounce
    particles.forEach(particle => {
      if(this === particle) {}
      else{
        if(distance(this.x,this.y, particle.x,particle.y) - (this.radius * 2) <= 0){
          utils.resolveCollision(this, particle);
        }
      }
    });

    if(this.x - this.radius <= 0 || this.x + this.radius >= innerWidth){
      this.velocity.x = -this.velocity.x;
    }
    if(this.y - this.radius <= 0 || this.y + this.radius >= innerHeight){
      this.velocity.y = -this.velocity.y;
    }

    //mouse collision detection
    if(distance(mouse.x,mouse.y, this.x,this.y) <= 150 && this.opacity < 0.4){
      this.opacity += 0.02;
    } else if (this.opacity > 0){
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;

  }
}

// Implementation
let particles;
function init() {
  particles = [];
  for (let i = 0; i < 200; i++) {
    const radius = 20 ;
    let x = utils.randomIntFromRange(radius, canvas.width - radius);
    let y = utils.randomIntFromRange(radius, canvas.height - radius);
    const color = utils.randomColor(colors);
    if(i != 0){
      for(let j=0;j<particles.length;j++) {
        if(distance(x,y, particles[j].x,particles[j].y) - (radius * 2) <= 0){
          x = utils.randomIntFromRange(radius, canvas.width - radius);
          y = utils.randomIntFromRange(radius, canvas.height - radius);
          j = -1;
        }
      }
    }
    particles.push(new Particle(x, y, radius, color));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
   particle.update(particles);
  });
}

init();
animate();
