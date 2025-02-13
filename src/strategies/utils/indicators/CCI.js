/*
 * CCI
 */
"use strict";

var Indicator = function(settings) {
  this.input = "candle";
  this.tp = 0.0;
  this.result = false;
  this.hist = []; // needed for mean?
  this.mean = 0.0;
  this.size = 0;
  this.constant = settings.constant;
  this.maxSize = settings.history;
  for (var i = 0; i < this.maxSize; i++) this.hist.push(0.0);
};

Indicator.prototype.update = function(candle) {
  // We need sufficient history to get the right result.
  var tp = (candle.high + candle.close + candle.low) / 3;
  if (this.size < this.maxSize) {
    this.hist[this.size] = tp;
    this.size++;
  } else {
    for (var i = 0; i < this.maxSize - 1; i++) {
      this.hist[i] = this.hist[i + 1];
    }
    this.hist[this.maxSize - 1] = tp;
  }

  if (this.size < this.maxSize) {
    this.result = false;
  } else {
    this.calculate(tp);
  }
};

/*
 * Handle calculations
 */
Indicator.prototype.calculate = function(tp) {
  var sumtp = 0.0;

  for (var i = 0; i < this.size; i++) {
    sumtp = sumtp + this.hist[i];
  }

  this.avgtp = sumtp / this.size;

  this.tp = tp;

  var sum = 0.0;
  // calculate tps
  for (var i = 0; i < this.size; i++) {
    var z = this.hist[i] - this.avgtp;
    if (z < 0) z = z * -1.0;
    sum = sum + z;
  }

  this.mean = sum / this.size;

  this.result = (this.tp - this.avgtp) / (this.constant * this.mean);

  // log.debug("===\t", this.mean, "\t", this.tp, '\t', this.TP.result, "\t", sum, "\t", avgtp, '\t', this.result.toFixed(2));
};

module.exports = Indicator;
