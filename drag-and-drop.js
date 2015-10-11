// http://stackoverflow.com/questions/4224359/making-paths-and-images-dragable-in-raphael-js

var start = function () {
  this.odx = 0;
  this.ody = 0;
  this.animate({"fill-opacity": 0.2}, 500);
};

var move = function (dx, dy) {
  this.translate(dx - this.odx, dy - this.ody);
  this.odx = dx;
  this.ody = dy;
};

var up = function () {
    this.animate({"fill-opacity": 1}, 500);
};
