let video;
let classifier;
let modelLoaded = 'https://teachablemachine.withgoogle.com/models/aVyyZ31gp/';
let up;
let down;
let right;
let left;
let snake;
let rez = 20; // Factor de resolución para escalar todo el juego.
let food;
let w; // Ancho del campo de juego en "unidades" de juego, no en píxeles.
let h; // Altura del campo de juego en "unidades" de juego, no en píxeles.

function preload(){
  classifier = ml5.imageClassifier(modelLoaded);
}

// Función de configuración inicial para p5.js, se llama una vez al inicio.
function setup() {
  createCanvas(400, 400); // Aumenta el tamaño del lienzo a 800x400 píxeles.
  w = floor(400 / rez); // Ajusta el ancho del campo de juego.
  h = floor(400 / rez); // Ajusta la altura del campo de juego.
  frameRate(5); // Establece la velocidad del juego a 5 cuadros por segundo.
  snake = new Snake(); // Crea una nueva instancia de la serpiente.
  foodLocation(); // Coloca la comida en una ubicación inicial aleatoria.

  video = createCapture(VIDEO);
  video.hide();
  classifyVideo();
}

function classifyVideo() {
  classifier.classify(video, gotResults);
}

// Genera una nueva ubicación para la comida en el campo de juego.
function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    snake.setDir(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDir(1, 0);
  } else if (keyCode === DOWN_ARROW) {
    snake.setDir(0, 1);
  } else if (keyCode === UP_ARROW) {
    snake.setDir(0, -1);
  } else if (key == ' ') {
    snake.grow();
  }
}

function draw() {
  scale(rez);
  background(220);
  if (snake.eat(food)) {
    foodLocation();
  }
  snake.update();
  snake.show();

  if (snake.endGame()) {
    print("END GAME");
    background(255, 0, 0);
    noLoop();
  }

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);

  // Dibuja el video en el lado derecho
  image(video, 400, 0);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  
  classifyVideo();
}


class Snake {
  
  // Constructor: inicializa la serpiente con un segmento en el centro del campo de juego.
  constructor() {
    this.body = []; // Array para almacenar los segmentos del cuerpo de la serpiente.
    this.body[0] = createVector(floor(w/2), floor(h/2)); // Posición inicial en el centro.
    this.xdir = 0; // Dirección inicial en el eje X.
    this.ydir = 0; // Dirección inicial en el eje Y.
    this.len = 0; // Longitud inicial de la serpiente.
  }
  
  // setDir: Establece la dirección de movimiento de la serpiente.
  setDir(x, y) {
    this.xdir = x;
    this.ydir = y;
  }
  
  // update: Actualiza la posición de la serpiente moviendo el cuerpo.
  update() {
    let head = this.body[this.body.length-1].copy(); // Copia la posición actual de la cabeza.
    this.body.shift(); // Elimina el segmento más antiguo del cuerpo.
    head.x += this.xdir; // Mueve la cabeza en el eje X.
    head.y += this.ydir; // Mueve la cabeza en el eje Y.
    this.body.push(head); // Añade la nueva posición de la cabeza al cuerpo.
  }
  
  // grow: Hace crecer la serpiente añadiendo un segmento al cuerpo.
  grow() {
    let head = this.body[this.body.length-1].copy(); // Copia la última posición de la cabeza.
    this.len++; // Aumenta la longitud de la serpiente.
    this.body.push(head); // Añade el nuevo segmento al cuerpo.
  }
  
  // endGame: Comprueba si la serpiente ha chocado consigo misma o con el borde del campo de juego.
  endGame() {
    let x = this.body[this.body.length-1].x; // Posición X de la cabeza.
    let y = this.body[this.body.length-1].y; // Posición Y de la cabeza.
    // Comprueba colisión con bordes.
    if(x > w-1 || x < 0 || y > h-1 || y < 0) {
       return true;
    }
    // Comprueba colisión consigo misma.
    for(let i = 0; i < this.body.length-1; i++) {
      let part = this.body[i];
      if(part.x == x && part.y == y) {
          return true;
      }
    }
    return false;
  }
  
  // eat: Determina si la serpiente ha comido una fruta.
  eat(pos) {
    let x = this.body[this.body.length-1].x; // Posición X de la cabeza.
    let y = this.body[this.body.length-1].y; // Posición Y de la cabeza.
    // Comprueba si la posición de la cabeza coincide con la fruta.
    if(x == pos.x && y == pos.y) {
      this.grow(); // Hace crecer la serpiente.
      return true;
    }
    return false;
  }
  
  // show: Dibuja la serpiente en el campo de juego.
  show() {
      for(let i = 0; i < this.body.length; i++) {
        fill(0); // Color de relleno para la serpiente.
        noStroke(); // Sin borde para los segmentos.
        rect(this.body[i].x, this.body[i].y, 1, 1); // Dibuja cada segmento del cuerpo.
    }
  }
}