// Add some header info
// For TM template code

// Video
let video;
let classifier;
let modelLoaded = 'https://teachablemachine.withgoogle.com/models/bXy2kDNi/';
let label0 = 'esperando...';
let confidence0 = 'esperando...';
let label1 = 'esperando...';
let confidence1 = 'esperando...';
let label2 = 'esperando...';
let confidence2 = 'esperando...';

// STEP 1: Load the model!
function preload(){
  classifier = ml5.imageClassifier(modelLoaded);
}

function setup() {
  createCanvas(640, 520);
  // Create the video
  video = createCapture(VIDEO);
  video.hide();

  // STEP 2: Start classifying
  classifyVideo();
}

// STEP 2 classify!
function classifyVideo() {
  classifier.classify(video, gotResults); // Corrige la asignación y clasifica
}

function draw() {
  background(0);
  
  // Dibujar el video
  image(video, 0, 0);
  
  // Configurar estilo de texto
  textSize(30);
  fill(255);
  
  // Dibujar la primera fila
  textAlign(RIGHT, CENTER);
  text(label0, width / 2 - 10, height - 60); // Ajustar posición de label0
  textAlign(LEFT, CENTER);
  text(nf(confidence0, 0, 2), width / 2 + 10, height - 60); // Ajustar posición de confidence0
  
  // Dibujar la segunda fila
  textAlign(RIGHT, CENTER);
  text(label1, width / 2 - 10, height - 40); // Ajustar posición de label1
  textAlign(LEFT, CENTER);
  text(nf(confidence1, 0, 2), width / 2 + 10, height - 40); // Ajustar posición de confidence1

  // Dibujar la tercera fila
  textAlign(RIGHT, CENTER);
  text(label2, width / 2 - 10, height - 20); // Ajustar posición de label2
  textAlign(LEFT, CENTER);
  text(nf(confidence2, 0, 2), width / 2 + 10, height - 20); // Ajustar posición de confidence2
}

// STEP 3: Get the classification!
function gotResults(error, results) {
  // Something went wrong!
  if (error) {
    console.error(error);
    return;
  }

  // Actualizar los labels y confidencias
  label0 = results[0].label;
  confidence0 = results[0].confidence;
  label1 = results[1].label;
  confidence1 = results[1].confidence;
  label2 = results[2].label;
  confidence2 = results[2].confidence;

  // Clasificar de nuevo para continuar actualizando
  classifyVideo();
}