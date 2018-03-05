// Assumes context is an AudioContext defined outside of this class.

Polymer('g-spectrogram', {
  // Show the controls UI.
  controls: false,
  // Log mode.
  log: false,
  // Show axis labels, and how many ticks.
  labels: false,
  ticks: 5,
  speed: 2,
  // FFT bin size,
  fftsize: 8192,
  oscillator: false,
  color: false,
  pause: false,
  resolutionMax: 20000,
  resolutionMin: 20,
  gain: 6,
  vibrato: 0,

  attachedCallback: function() {
    this.tempCanvas = document.createElement('canvas'),
    console.log('Created spectrogram');
    // Get input from the microphone.
    if (navigator.mozGetUserMedia) {
      navigator.mozGetUserMedia({audio: true},
                                this.onStream.bind(this),
                                this.onStreamError.bind(this));
    } else if (navigator.webkitGetUserMedia) {
      navigator.webkitGetUserMedia({audio: true},
                                this.onStream.bind(this),
                                this.onStreamError.bind(this));
    }
    this.ctx = this.$.canvas.getContext('2d');
  },

  render: function() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    var didResize = false;
    // Ensure dimensions are accurate.
    if (this.$.canvas.width != this.width) {
      this.$.canvas.width = this.width;
      this.$.labels.width = this.width;
      didResize = true;
    }
    if (this.$.canvas.height != this.height) {
      this.$.canvas.height = this.height;
      this.$.labels.height = this.height;
      didResize = true;
    }

    //this.renderTimeDomain();
    this.renderFreqDomain();

    if (this.labels && didResize) {
      this.renderAxesLabels();
    }

    requestAnimationFrame(this.render.bind(this));

    var now = new Date();
    if (this.lastRenderTime_) {
      this.instantaneousFPS = now - this.lastRenderTime_;
    }
    this.lastRenderTime_ = now;

    this.gainNode.gain.setTargetAtTime(this.setGain(this.gain), context.currentTime, 0.01);

    // this.gainNode.gain.value =

  },

  renderTimeDomain: function() {
    var times = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(times);

    for (var i = 0; i < times.length; i++) {
      var value = times[i];
      var percent = value / 256;
      var barHeight = this.height * percent;
      var offset = this.height - barHeight - 1;
      var barWidth = this.width/times.length;
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(i * barWidth, offset, 1, 1);
    }
  },

  renderFreqDomain: function() {
    var freq = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(freq);
    var ctx = this.ctx;
    // Copy the current canvas onto the temp canvas.
    this.tempCanvas.width = this.width;
    this.tempCanvas.height = this.height;
    var tempCtx = this.tempCanvas.getContext('2d');
    tempCtx.drawImage(this.$.canvas, 0, 0, this.width, this.height);
    // Iterate over the frequencies.

    var resolutionMaxPercent = this.resolutionMax/(context.sampleRate/2);
    var resolutionMinPercent = Number(this.resolutionMin)/(context.sampleRate/2);
    var maxSample = Math.round(freq.length * resolutionMaxPercent);
    var minSample = Math.round(freq.length * resolutionMinPercent);


    for (var i = 0; i < this.height; i++) {
      var value;
      // Draw each pixel with the specific color.

      // Gets the height and creates a log scale of the index
      if (this.log) {
        var myPercent = (i / this.height);
        // myPercent = this.logScale_(myPercent * 1000, 1000) / 1000;
        var x = this.newFreqAlgorithm(myPercent);
        // var x= Math.floor(myPercent * (this.resolutionMax - Number(this.resolutionMin)) + Number(this.resolutionMin))+1;
        logIndex = Math.round(x*freq.length/(context.sampleRate/2));


        value = freq[logIndex];

      } else {
        var myPercent = (i / this.height);
        var xx= Math.floor(myPercent * (this.resolutionMax - Number(this.resolutionMin)) + Number(this.resolutionMin))+1;
        logIndex = Math.round(xx*freq.length/(context.sampleRate/2));
        value = freq[logIndex];
      }

      ctx.fillStyle = (this.color ? this.getFullColor(value) : this.getGrayColor(value));

      var percent = i / this.height;
      var y = Math.round(percent *this.height);



      // draw the line at the right side of the canvas
      ctx.fillRect(this.width - this.speed, this.height - y,
                   this.speed, this.speed);
    }

    // Translate the canvas.
    ctx.translate(-this.speed, 0);
    // Draw the copied image.
    ctx.drawImage(this.tempCanvas, 0, 0, this.width, this.height,
                  0, 0, this.width, this.height);

    // Reset the transformation matrix.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  },
/**
* Takes the linear gain slider position and converts it to a logarithmic scale
*/
  setGain: function(position){
        var minp = 1;
        var maxp = 10;
        var minVal = Math.log(0.1);
        var maxVal = Math.log(10);
        var scale = (maxVal-minVal) / (maxp-minp);
        return Math.exp(minVal + scale*(position-minp));
  },
  /**
   * Given an index and the total number of entries, return the
   * log-scaled value.
   */
  logScale: function(index, total, opt_base) {
    var base = opt_base || 2;
    var logmax = this.logBase(total + 1, base);
    var exp = logmax * index / total;
    return Math.round(Math.pow(base, exp) - 1);
  },

  logBase: function(val, base) {
    return Math.log(val) / Math.log(base);
  },

  renderAxesLabels: function() {
    var canvas = this.$.labels;
    canvas.width = this.width;
    canvas.height = this.height;
    var ctx = canvas.getContext('2d');
    var startFreq = 440;
    startFreq = this.resolutionMin;
    var nyquist = context.sampleRate/2;
    var endFreq = this.resolutionMax - startFreq;
    var step = (endFreq - startFreq) / this.ticks;
    var yLabelOffset = 5;

    // Render the vertical frequency axis.

    for (var i = 0; i <= this.ticks; i++) {
      //Inital Vals = 100, 161, 403, 1366, 4967, 19000
      var freq = startFreq + (step * i);
      // Get the y coordinate from the current label.
      var index = this.freqToIndex(freq);


      var percent  = i/(this.ticks);
      var y = (1-percent) * this.height;

      var x = this.width - 60;
      // Get the value for the current y coordinate.
      var label;
      var units;
      // if (this.log) {

        // Handle a logarithmic scale.
        // var logIndex = this.logScale(index, maxSample)+minSample;


        // Never show 0 Hz.

        // freq = Math.max(1, this.indexToFreq(logIndex));

        freq = Math.max(1,this.getFrequencies(i));

      // var label = this.formatFreq(freq);
      var units = this.formatUnits(freq);

      ctx.font = '18px Inconsolata';
      // Draw the value.
      ctx.textAlign = 'right';
      ctx.fillStyle = 'white';
      ctx.fillText(freq, x, y + yLabelOffset);
      // Draw the units.
      ctx.textAlign = 'left';
      ctx.fillStyle = 'white';
      ctx.fillText(units, x + 10, y + yLabelOffset);
      // Draw a tick mark.
      ctx.fillRect(x + 40, y, 30, 2);
    }

  },

/**
* For each tick, grab the log-scaled frequency value
*/
  getFrequencies(index){
    var percent = ((index/this.ticks));
    var freq = 0;
    if(this.log){
        // percent = this.logScale_(percent * 1000, 1000) / 1000;
        // freq = Math.round(percent * (this.resolutionMax - Number(this.resolutionMin)) + Number(this.resolutionMin));
        freq = this.newFreqAlgorithm(percent);
    } else {
      freq =  Math.round(percent * (this.resolutionMax - Number(this.resolutionMin)) + Number(this.resolutionMin));

    }


    return freq;

  },

  newFreqAlgorithm(index){
    // console.log(index);
    var l = Math.log(this.resolutionMax/this.resolutionMin);
    // console.log(l);
    var freq = this.resolutionMin * Math.pow(Math.E, index*l);
    // console.log(freq);
    return Math.round(freq);

  },

  clearAxesLabels: function() {
    var canvas = this.$.labels;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, this.width, this.height);
  },

  formatFreq: function(freq) {
    return (freq >= 1000 ? (freq/1000).toFixed(1) : Math.round(freq));
  },

  formatUnits: function(freq) {
    // return (freq >= 1000 ? 'KHz' : 'Hz');
    return 'Hz';
  },

  indexToFreq: function(index) {
    var nyquist = context.sampleRate/2;
    return nyquist/this.getFFTBinCount() * index;
  },

  freqToIndex: function(frequency) {
    var nyquist = context.sampleRate/2;
    return Math.round(frequency/nyquist * this.getFFTBinCount());
  },

  getFFTBinCount: function() {
    return this.fftsize / 2;
  },

// This is the stream of audio
  onStream: function(stream) {
    var input = context.createMediaStreamSource(stream);

    var gainNode = context.createGain();
    var analyser = context.createAnalyser();

    analyser.minDecibels = -100;
    analyser.maxDecibels = -20;
    analyser.smoothingTimeConstant = 0;
    // analyser.fftSize = this.fftsize;
    var fftSize = 8192;
    analyser.fftSize = fftSize;

    // Connect graph.
    input.connect(gainNode);
    gainNode.connect(analyser);
    // input.connect(analyser);
    this.gainNode = gainNode;
    this.analyser = analyser;

    // gainNode.gain.value = 1;
    gainNode.gain.setTargetAtTime(1, context.currentTime, 0.01);

    // Setup a timer to visualize some stuff.
    this.render();
  },

  onStreamError: function(e) {
    console.error(e);
  },
  //The name of this function is wrong, should just be getColor, however, there exists
  //a get Full color that is currently unused
  getGrayColor: function(value) {
    var fromH = 200;
    var toH = 1;
    var percent = value / 255;
    var delta = percent * (toH - fromH);
    var hue = fromH + delta;



    //value 1, 255 (255 is max volume)


    // Test Max
    if(value ==255) {
      console.log("MAX!");
    }
    //
    // if(value < 160){
    //   value = 0;
    // }
    //
    // if(value < 175 && value > 69 ){
    //   value = value - 30;
    // }
    // if(value < 100) {
    //   value = 0
    // }
    var percent = (value) / 255 * 50;
// return 'rgb(V, V, V)'.replace(/V/g, 255 - value);
   return 'hsl(H, 100%, P%)'.replace(/H/g, 255-value).replace(/P/g, percent);


  },

  getFullColor: function(value) {
    var fromH = 62;
    var toH = 0;
    var percent = value / 255;
    var delta = percent * (toH - fromH);
    var hue = fromH + delta;
    return 'hsl(H, 100%, 50%)'.replace(/H/g, hue);
  },

  logScale_: function(index, total, opt_base) {
    var base = opt_base || 2;
    //Math.log(total + 1) / Math.log(base);
    var logmax = this.logBase(total + 1, base);
    var exp = logmax * index / total;
    return Math.pow(base, exp) - 1;
  },

  // The following functions are listening functions that are called when parameters
  // are changed

  logChanged: function() {
    if (this.labels) {
      this.renderAxesLabels();
    }
  },

  resolutionMaxChanged: function() {
    if(this.labels){
      this.renderAxesLabels();
    }
  },

  resolutionMinChanged: function() {
    if(this.labels){
      this.renderAxesLabels();
    }
  },

  pauseChanged: function() {
    var saveSpeed = 2;
    if(this.speed!=0) {
      saveSpeed = this.speed;
      this.speed = 0;

    } else {
      this.speed = saveSpeed;
    }

  },

  ticksChanged: function() {
    if (this.labels) {
      this.renderAxesLabels();
    }
  },

  labelsChanged: function() {
    if (this.labels) {
      this.renderAxesLabels();
    } else {
      this.clearAxesLabels();
    }
  },

  scaleChanged: function() {
    if(this.labels){
      this.renderAxesLabels();
    }

  },

});
