"use strict";
// Awesome oscilator custom with percent!

var SMMA = require("./SMMA");

var Indicator = function(short, long) {
  this.input = "price";
  this.result = 0;
  this.short_smma = new SMMA(short);
  this.long_smma = new SMMA(long);
};

Indicator.prototype.update = function(price) {
  this.short_smma.update(price);
  this.long_smma.update(price);

  this.result =
    (this.short_smma.result - this.long_smma.result) / this.short_smma.result;
};

module.exports = Indicator;
