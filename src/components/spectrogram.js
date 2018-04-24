import React, {Component} from 'react';
import '../styles/spectrogram.css';

import Axes from './axes';
import Oscillator from './oscillator';

const ReactAnimationFrame = require('react-animation-frame');
// TODO: Tap anywhere to start (ipad bug)

let audioContext = null;
let analyser = null;
let gainNode = null;

const fftSize = 8192;

// Spectrogram Graph that renders itself and 2 children canvases (Oscillator and Axes)
class Spectrogram extends Component {

  componentDidMount() {
    window.addEventListener("resize", this.props.handleResize);
    this.ctx = this.canvas.getContext('2d');
    this.tempCanvas = document.createElement('canvas');
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.props.handleResize);
  }
  // Connects the menu microphoneGain controls to gainNode
  componentWillReceiveProps(nextProps, prevState) {
    if (nextProps.isStarted) {
      if (nextProps.microphoneGain !== gainNode.gain.value) {
        gainNode.gain.setTargetAtTime(nextProps.microphoneGain, audioContext.currentTime, 0.01);
      }
    }
  }

  // Starts the Spectrogram and Children Components when the user taps the screen
  // Also creates the audioContext to be used throughout the application
  startSpectrogram = () => {
    if (!this.props.isStarted) {
      audioContext = new(window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      gainNode = audioContext.createGain();
      analyser.minDecibels = -100;
      analyser.maxDecibels = -20;
      analyser.smoothingTimeConstant = 0;
      analyser.fftSize = fftSize;
      if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia({
          audio: true
        }, this.onStream.bind(this), this.onStreamError.bind(this));
      } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia({
          audio: true
        }, this.onStream.bind(this), this.onStreamError.bind(this));
      }
      // Calls the start function which lets the controls know it has started
      this.props.start();
      this.renderFreqDomain();
    }
  }

// Sets up the microphone stream after the Spectrogram is started
// It connects the graph by connecting the microphone to gain and gain to
// the analyser. The gain is used as microphoneGain
  onStream(stream) {
    let input = audioContext.createMediaStreamSource(stream);
    input.connect(gainNode);
    gainNode.connect(analyser);
    gainNode.gain.setTargetAtTime(1, audioContext.currentTime, 0.01);
  }

  onStreamError(e) {
    console.error(e);
  }

  // Continuous render of the graph (if started) using ReactAnimationFrame plugin
  onAnimationFrame = (time) => {
    if (this.props.isStarted) {
      this.renderFreqDomain();
    }
  }

  // Main Graph function. Renders the frequencies, then copies them to a temporary
  // canvas and shifts that canvas by 1
  renderFreqDomain = () => {
    let { width, height, log, resolutionMax, resolutionMin, speed } = this.props
    let freq = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freq);
    this.tempCtx = this.tempCanvas.getContext('2d');
    this.tempCanvas.width = width;
    this.tempCanvas.height = height;
    this.tempCtx.drawImage(this.canvas, 0, 0, width, height);

    // Iterate over the frequencies.
    for (var i = 0; i < height; i++) {
      var value;
      // Draw each pixel with the specific color.

      // Gets the height and creates a log scale of the index
      if (log) {
        let myPercent = (i / height);
        var logPercent = this.newFreqAlgorithm(myPercent);
        let logIndex = Math.round(logPercent * freq.length / (audioContext.sampleRate / 2));
        value = freq[logIndex];

      } else {
        let myPercent = (i / height);
        let newPercent = Math.floor(myPercent * (resolutionMax - resolutionMin) + resolutionMin) + 1;
        let logIndex = Math.round(newPercent * freq.length / (audioContext.sampleRate / 2));
        value = freq[logIndex];
      }

      this.ctx.fillStyle = this.getColor(value);
      var percent = i / height;
      var y = Math.round(percent * height);
      this.ctx.fillRect(width - speed, height - y, speed, speed);

    }
    // Shifts to left by speed
    this.ctx.translate(-speed, 0);
    this.ctx.drawImage(this.tempCanvas, 0, 0, width, height, 0, 0, width, height);
    // Resets transformation
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

  }

  // Helper function that converts frequency value to color
  getColor(value) {
    // Test Max
    if (value === 255) {
      console.log("MAX!");
    }
    var percent = (value) / 255 * 50;
    // return 'rgb(V, V, V)'.replace(/V/g, 255 - value);
    return 'hsl(H, 100%, P%)'.replace(/H/g, 255 - value).replace(/P/g, percent);
  }

  // Helper function that converts the frequencies to a log scale
  newFreqAlgorithm(index) {
    let logResolution = Math.log(this.props.resolutionMax / this.props.resolutionMin);
    let freq = this.props.resolutionMin * Math.pow(Math.E, index * logResolution);
    return Math.round(freq);
  }


  render() {
    return (
      <div onClick={this.startSpectrogram}>
        <canvas width={this.props.width} height={this.props.height} ref={(c) => {
          this.canvas = c;
        }}/>
        <Axes
        resolutionMax={this.props.resolutionMax}
        resolutionMin={this.props.resolutionMin}
        width={this.props.width}
        height={this.props.height}
        handleResize={this.props.handleResize}/>
        {this.props.isStarted &&
          <Oscillator
          width={this.props.width}
          height={this.props.height}
          resolutionMax={this.props.resolutionMax}
          resolutionMin={this.props.resolutionMin}
          context={audioContext}
          analyser={analyser}
          soundOn={this.props.soundOn}
          outputVolume={this.props.outputVolume}
          timbre={this.props.timbre}
          scaleOn={this.props.scaleOn}
          musicKey={this.props.musicKey}
          accidental={this.props.accidental}
          scale={this.props.scale}
          attack={this.props.attack}
          release={this.props.release}
          handleResize={this.props.handleResize}/>}
          {/* Intro Instructions */}
        <div className="instructions">
          {!this.props.isStarted
            ? <div className="flashing">Click or tap anywhere on the canvas to start the spectrogram</div>
            : <div className="normal">Great! Be sure to allow use of your microphone.
            You can draw on the canvas to make sound!</div>
          }

        </div>
      </div>
    );

  }

}
export default ReactAnimationFrame(Spectrogram);
