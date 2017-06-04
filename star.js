const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
const NUM_STARS = HEIGHT * WIDTH / 10000 > 1000 ? 1000 : HEIGHT * WIDTH / 10000;

var canvas = document.getElementById("canvas");
canvas.width = WIDTH + 40;
canvas.height = HEIGHT;
var context = canvas.getContext('2d');

var starGraphic = new Image();
starGraphic.src = "assets/star.svg";
var stars = new Stars();

function Star(speed, x, y) {
  this.id = this.generateId();
  this.speed = speed;
  this.x = x;
  this.y = y;
}

Star.prototype.generateId = function() {
  return Math.random().toString(20).substr(2, 12);
}

Star.prototype.update = function() {
  if (!this.hasDied()) {
    this.x += this.speed;
    context.drawImage(starGraphic, this.x, this.y);
  } else {
    stars.recycle(this.id);
  }
}

Star.prototype.hasDied = function() {
  return this.y > canvas.height || this.y < 0 || this.x > canvas.width || this.x < 0;
}

function Stars() {
  this.collection = [];
}

Stars.prototype.get = function(index) {
  return index >= this.len() || index < 0 ? null : this.collection[index];
}

Stars.prototype.findById = function(id) {
  return this.collection.findIndex(function(elem, index, array) { return elem.id === id })
}

Stars.prototype.recycle = function(id) {
  var index = this.findById(id);
  if (index != -1) {
    this.collection.splice(index, 1);
    this.drawStar(0);
  }
}

Stars.prototype.len = function() {
  return this.collection.length;
}

Stars.prototype.append = function (star) {
  if (this.len() < NUM_STARS && star instanceof Star)
    this.collection.push(star);
}

Stars.prototype.drawStar = function(startX) {
  var x = startX != undefined ? startX : randchoice(0, canvas.width);
  var y = randchoice(0, canvas.height);

  var speed = .2;
  var star = new Star(speed, x, y);
  stars.append(star);
}

function drawStars() {
  for (var i = 0; i < NUM_STARS; i++) {
    stars.drawStar();
  }
  render();
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.globalAlpha = 0.8;

  for (var i = 0; i < stars.len(); i++) {
    stars.get(i).update();
  }
  requestAnimationFrame(render);
}

window.onload = function() {
  drawStars();
}

function randchoice(min, max) {
  min = Math.floor(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
