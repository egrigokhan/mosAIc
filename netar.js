
// CONSTANT SETTINGS

var IMG_HEIGHT = window.innerWidth;
var IMG_WIDTH = window.innerHeight;
var IMG_SIZE = IMG_HEIGHT*IMG_WIDTH;

var nH, nW, nImage;
var mask;

// HYPERPARAMETERS

var NETWORK_LAYER_DIM = 16;
var HIDDEN_LAYER_COUNT = 6;
var OUT_DIM = 3;
var STD = 1;

var img;
var G = new R.Graph(false);

function initRandomHyperparameters() {
  STD = Math.random()*(1.3-0.7) + 0.7
  HIDDEN_LAYER_COUNT = parseInt(Math.random()*(8-6) + 6)
}

function genImage(img, bw) {

  initRandomHyperparameters()

  model = initModel()

  console.log(model.w_in)
  for (i = 0; i < HIDDEN_LAYER_COUNT; i++) {
    console.log(model['w_'+i])
  }
  console.log(model.w_out)
  
  var i, j, m, n;

  img.loadPixels();

  for (i = 0, m=img.width; i < m; i++) {
    for (j = 0, n=img.height; j < n; j++) {
      img.set(i, j, getColorAt(model, i/IMG_HEIGHT-0.5,j/IMG_WIDTH-0.5, bw));
    }
  }

  img.updatePixels();
}

var initModel = function() {
  "use strict";

  var model = [];
  var i;

  model.w_in = R.RandMat(NETWORK_LAYER_DIM, 3, 0, STD);

  for (i = 0; i < HIDDEN_LAYER_COUNT; i++) {
    model['w_'+i] = R.RandMat(NETWORK_LAYER_DIM, NETWORK_LAYER_DIM, 0, STD);
  }

  model.w_out = R.RandMat(OUT_DIM, NETWORK_LAYER_DIM, 0, STD);

  return model;
};


var forwardNetwork = function(G, model, x_, y_) {

  var x = new R.Mat(3, 1);
  var i;
  x.set(0, 0, x_);
  x.set(1, 0, y_);
  x.set(2, 0, 1.3);
  var out;
  out = G.tanh(G.mul(model.w_in, x));
  for (i = 0; i < HIDDEN_LAYER_COUNT; i++) {
    out = G.tanh(G.mul(model['w_'+i], out));
  }
  out = G.sigmoid(G.mul(model.w_out, out));
  return out;
};

function getColorAt(model, x, y, bw) {

  var r, g, b;
  var out = forwardNetwork(G, model, x, y);

  r = out.w[0]*220;
  g = out.w[1]*220;
  b = out.w[2]*220;

  if(bw) {
    sum = (r + g + b) / 3

    r = sum;
    g = sum;
    b = sum;
  }

  return color(r, g, b);
}

var online

function setup() {

  "use strict";
  var myCanvas;

  myCanvas = createCanvas(window.innerWidth,window.innerHeight);

  myCanvas.parent('p5Container');

  img = createImage(IMG_HEIGHT, IMG_WIDTH);

  frameRate(60);

  noLoop()

}

function displayImage(n) {
  image(img, 0, 0);
}

var bw = false

function draw() { 

  model = initModel();
  genImage(img, bw);
  displayImage(0);

}

function generateImage(isBW) {
  bw = isBW
  draw()
}
