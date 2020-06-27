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
    this.mass = 2;
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
    if(this.y - this.radius <= 0 || this.y + this.radius >= innerHeight ){
      this.velocity.y = -this.velocity.y;
    }
    if(this.x + this.radius >= canvas.width/2 - 400 && this.x - this.radius <= canvas.width/2 + 400  && this.y + this.radius >= canvas.height/2 - 120 && this.y - this.radius <= canvas.height/2 + 120){ 
      this.velocity.x = -this.velocity.x;
    }
    if(this.y + this.radius >= canvas.height/2 - 120 && this.y - this.radius <= canvas.height/2 + 120 && this.x + this.radius >= canvas.width/2 - 400 && this.x - this.radius <= canvas.width/2 + 400){
      this.velocity.y = -this.velocity.y;
    }

    //mouse collision detection
    if(distance(mouse.x,mouse.y, this.x,this.y) <= 150 && this.opacity < 0.8){
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
        if(distance(x,y, particles[j].x,particles[j].y) - (radius * 2) <= 0 || (x + radius >= canvas.width/2 - 400 && x - radius <= canvas.width/2 + 400) || (y + radius >= canvas.height/2 - 200 && y - radius <= canvas.height/2 + 200)){
          x = utils.randomIntFromRange(radius, canvas.width - radius);
          y = utils.randomIntFromRange(radius, canvas.height - radius);
          j = -1;
        }
      }
    } else{
      while((x + radius >= canvas.width/2 - 400 && x - radius <= canvas.width/2 + 400) || (y + radius >= canvas.height/2 - 200 && y - radius <= canvas.height/2 + 200)){
        x = utils.randomIntFromRange(radius, canvas.width - radius);
        y = utils.randomIntFromRange(radius, canvas.height - radius);
      }
    }
    particles.push(new Particle(x, y, radius, color));
  }
}

//centered text and box
function text() {
  c.beginPath();
  c.moveTo(canvas.width/2 - 400, canvas.height/2 - 120);
  c.lineTo(canvas.width/2 - 400, canvas.height/2 + 120);
  c.lineTo(canvas.width/2 + 400, canvas.height/2 + 120);
  c.lineTo(canvas.width/2 + 400, canvas.height/2 - 120);
  c.lineTo(canvas.width/2 - 400, canvas.height/2 - 120);
  c.fillStyle = "rgba(0,0,0,0.5)";
  c.fill();
  c.font = "bold 60px Balsamiq Sans";
  c.fillStyle = "white";
  c.textAlign = "center";
  c.textBaseline = "ideographic";
  let ctext = "COLLISION DETECTION".split("").join(String.fromCharCode(8202))
  c.fillText(ctext, canvas.width/2, canvas.height/2);
  c.font = "40px Crimson Text";
  c.fillText("Jul 25, 2020", canvas.width/2, canvas.height/2 + 100);
  c.beginPath();
  c.moveTo(canvas.width/2 - 100 , canvas.height/2 + 20);
  c.lineTo(canvas.width/2 + 100, canvas.height/2 + 20);
  c.strokeStyle = "rgba(0, 0, 0, 1)";
  c.lineWidth = 2.5;
  c.stroke();
  c.closePath();
}


// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
   particle.update(particles);
  });
  text();
}

init();
animate();
