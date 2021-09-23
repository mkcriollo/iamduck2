// Basic Setup of Canvas
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);

let gameSpeed = 1;
let gameFrame = 0;
// let numberOfEnemies = 3;
let enemiesArr = [];

/* images */

const enemyImage1 = new Image();
enemyImage1.src = "./imgs/enemy1.png";

const backgroundLayer1 = new Image();
backgroundLayer1.src = "./imgs/layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "./imgs/layer-2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "./imgs/layer-3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "./imgs/layer-4.png";
const backgroundLayer5 = new Image();
backgroundLayer5.src = "./imgs/layer-5.png";

/* Game */

window.addEventListener("load", function () {
  class Player {
    constructor(x, y, width, height) {
      // (this.image = image),
      (this.x = x),
        (this.y = 530),
        (this.width = width),
        (this.height = height),
        (this.radius = 50),
        (this.x_velocity = 0),
        (this.y_velocity = 0),
        (this.jumping = false),
        (this.pull = 0.9);
    }

    update() {
      if (controller.up && this.jumping === false) {
        this.y -= 200;
        this.jumping = true;
      }

      if (controller.left) {
        this.x_velocity -= 0.5;
      }

      if (controller.right) {
        this.x_velocity += 0.5;
      }

      this.y_velocity += gravity;
      this.y += this.y_velocity;
      this.x += this.x_velocity;
      this.x_velocity *= this.pull;
      this.y_velocity *= this.pull;
      if (this.y >= 530) {
        this.y = 530;
        this.y_velocity = 0;
        this.jumping = false;
      }
      if (this.x <= 0) {
        this.x = 0;
      }

      if (controller.keyPressed === false) {
        gameSpeed = 0;
      }

      if (this.x >= CANVAS_WIDTH / 2) {
        this.x = CANVAS_WIDTH / 2;
        gameSpeed += 1.5;
      }
    }

    draw() {
      // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      // ctx.fillStyle = "red";
      // ctx.fill();
      ctx.fillRect(this.x, this.y, 50, 50);
    }
  }

  class Enemy {
    constructor() {
      this.speed = Math.random() * 4 + 1;
      this.spriteWidth = 293;
      this.spriteHeight = 155;
      this.width = this.spriteWidth / 1.8;
      this.height = this.spriteHeight / 1.8;
      this.x = 700;
      this.y = Math.random() * (canvas.height - 220 - 10) + 10;
      this.frame = 0;
      this.flapSpeed = Math.floor(Math.random() * 3 + 1);
      this.angle = 0;
      this.angleSpeed = Math.random() * 0.2;
      this.curve = Math.random() * 10;
    }

    update() {
      this.x = this.x - this.speed - gameSpeed;
      this.y += Math.floor(Math.sin(this.angle) * 3);
      this.angle += this.angleSpeed;
      if (this.x + this.width < 0) {
        this.x = canvas.width;
      }

      if (gameFrame % this.flapSpeed === 0) {
        this.frame > 4 ? (this.frame = 0) : this.frame++;
      }
    }

    draw() {
      // ctx.fillRect(this.x, this.y, this.width, this.height);
      // ctx.fillRect(0, 470, this.width, this.height);
      ctx.drawImage(
        enemyImage1,
        this.frame * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class Layer {
    constructor(image, speedMod) {
      (this.speedMod = speedMod), (this.image = image);
      this.speed = gameSpeed * speedMod;
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 700;
    }

    update() {
      this.speed = gameSpeed * this.speedMod;
      if (this.x <= -this.width) {
        this.x = 0;
      }

      this.x = Math.floor(this.x - this.speed);
    }

    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width,
        this.height
      );
    }
  }

  /* Creating game */

  const player = new Player(10, 20, 20, 20);

  function printMonster1() {
    if (gameFrame % 200 === 0) {
      enemiesArr.push(new Enemy());
    }

    for (let i = 0; i < enemiesArr.length; i++) {
      let enemy = enemiesArr[i];
      enemy.update();
      enemy.draw();
      if (enemy.x < 0) {
        enemiesArr.splice(i, 1);
        i--;
      }
    }
  }

  /* Movement */

  const gravity = 1.5;

  const controller = {
    left: false,
    right: false,
    up: false,
    keyPressed: false,
    keyListener: function (e) {
      let key_state = e.type == "keydown" ? true : false;
      e.type === "keydown"
        ? (this.keyPressed = true)
        : (this.keyPressed = false);

      switch (e.code) {
        case "ArrowLeft":
          controller.left = key_state;
          break;
        case "ArrowUp":
          controller.up = key_state;
          break;
        case "ArrowRight":
          controller.right = key_state;
          break;
        case "Space":
          controller.up = key_state;
          break;
      }
    },
  };

  window.addEventListener("keydown", controller.keyListener);
  window.addEventListener("keyup", controller.keyListener);

  /* Backgrounds Layer */

  const layer1 = new Layer(backgroundLayer1, 2.0);
  const layer2 = new Layer(backgroundLayer2, 2.0);
  const layer3 = new Layer(backgroundLayer3, 2.5);
  const layer4 = new Layer(backgroundLayer4, 1);
  const layer5 = new Layer(backgroundLayer5, 2.5);

  const gameObjects = [layer1, layer2, layer3, layer4, layer5];

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObjects.forEach((object) => {
      object.update();
      object.draw();
    });
    player.update();
    player.draw();
    printMonster1();
    gameFrame++;
    requestAnimationFrame(animate);
  }

  animate();
});
