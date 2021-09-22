// Basic Setup of Canvas
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);

let gameSpeed = 1;

/* images */

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

window.addEventListener("load", function () {
  class Player {
    constructor(x, y, width, height) {
      // (this.image = image),
      (this.x = x),
        (this.y = 530),
        (this.width = width),
        (this.height = height),
        (this.radius = 50);
    }

    update() {}

    draw() {
      // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      // ctx.fillStyle = "red";
      // ctx.fill();
      ctx.fillRect(this.x, this.y, 50, 50);
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

  /* Movement */

  const gravity = 100;

  document.addEventListener("keydown", function (e) {
    console.log(e.key);
    if (e.key === "ArrowRight") {
      player.x = player.x + 10;
      if (player.x >= CANVAS_WIDTH / 2) {
        player.x = CANVAS_WIDTH / 2;
        gameSpeed = gameSpeed + 1;
      }
    } else if (e.key === "ArrowLeft") {
      if (player.x <= 0) {
        player.x = 0;
      } else {
        player.x = player.x - 10;
      }
    } else if (e.key === "ArrowUp" || e.code === "Space") {
      console.log(player.y);
      player.y += gravity;
      player.y = player.y - 200;
    }
  });

  document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowRight") {
      gameSpeed = 0;
    } else if (e.key === "ArrowLeft") {
      gameSpeed = 0;
    } else if (e.key === "ArrowUp" || e.code === "Space") {
      player.y -= gravity;
      player.y = 530;
    }
  });

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
    requestAnimationFrame(animate);
  }

  animate();
});
