import React, {Component} from 'react';
import '../styles/spectrogram.css';

import Axes from './axes';
import Oscillator from './oscillator';

const ReactAnimationFrame = require('react-animation-frame');
// TODO: Resize of canvas bugs
// TODO: Tap anywhere to start (ipad bug)

let audioContext = null;
let analyser = null;
let gainNode = null;

const fftSize = 8192;


class Spectrogram extends Component {

  componentDidMount() {
    window.addEventListener("resize", this.props.handleResize);
    this.ctx = this.canvas.getContext('2d');
    this.tempCanvas = document.createElement('canvas');
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.props.handleResize);
  }

  onStream(stream) {
    let input = audioContext.createMediaStreamSource(stream);
    // Connect graph.
    input.connect(gainNode);
    gainNode.connect(analyser);
    gainNode.gain.setTargetAtTime(1, audioContext.currentTime, 0.01);
  }

  onStreamError(e) {
    console.error(e);
  }

  onAnimationFrame = (time) => {
    if(this.props.isStarted){
      this.renderFreqDomain();

    }
  }

  renderFreqDomain = () => {
    let freq = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freq);
    this.tempCtx = this.tempCanvas.getContext('2d');
    this.tempCanvas.width = this.props.width;
    this.tempCanvas.height = this.props.height;
    this.tempCtx.drawImage(this.canvas, 0, 0, this.props.width, this.props.height);

    // Iterate over the frequencies.
    for (var i = 0; i < this.props.height; i++) {
      var value;
      // Draw each pixel with the specific color.

      // Gets the height and creates a log scale of the index
      if (this.props.log) {
        let myPercent = (i / this.props.height);
        var logPercent = this.newFreqAlgorithm(myPercent);
        let logIndex = Math.round(logPercent * freq.length / (audioContext.sampleRate / 2));
        value = freq[logIndex];

      } else {
        let myPercent = (i / this.props.height);
        var xx = Math.floor(myPercent * (this.props.resolutionMax - this.props.resolutionMin) + this.props.resolutionMin) + 1;
        let logIndex = Math.round(xx * freq.length / (audioContext.sampleRate / 2));
        value = freq[logIndex];
      }

      this.ctx.fillStyle = this.getColor(value);
      var percent = i / this.props.height;
      var y = Math.round(percent * this.props.height);
      this.ctx.fillRect(this.props.width - this.props.speed, this.props.height - y, this.props.speed, this.props.speed);

    }
    this.ctx.translate(-this.props.speed, 0);
    this.ctx.drawImage(this.tempCanvas, 0, 0, this.props.width, this.props.height, 0, 0, this.props.width, this.props.height);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

  }

  getColor(value) {
    // Test Max
    if (value === 255) {
      console.log("MAX!");
    }
    var percent = (value) / 255 * 50;
    // return 'rgb(V, V, V)'.replace(/V/g, 255 - value);
    return 'hsl(H, 100%, P%)'.replace(/H/g, 255 - value).replace(/P/g, percent);
  }

  newFreqAlgorithm(index) {
    let logResolution = Math.log(this.props.resolutionMax / this.props.resolutionMin);
    let freq = this.props.resolutionMin * Math.pow(Math.E, index * logResolution);
    return Math.round(freq);
  }

  // handleResize() {
  //   this.setState({width: window.innerWidth, height: window.innerHeight});
  // }

  startSpectrogram = ()=>{
    if(!this.props.isStarted){
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
      this.props.start();
      this.renderFreqDomain();
    }
  }

  render() {
    return (
      <div onClick={this.startSpectrogram}>
        <canvas width={this.props.width} height={this.props.height} ref={(c) => {
          this.canvas = c;
        }}/>
        <Axes resolutionMax={this.props.resolutionMax} resolutionMin={this.props.resolutionMin}/>
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
      />
        }
        <div className="instructions">

          {!this.props.isStarted ?
            <div className="flashing">Click or tap anywhere on the canvas to start the spectrogram</div>:
            <div className="normal">Great! Be sure to allow use of your microphone. You can draw on the canvas to make sound!</div>
          }

        </div>
      </div>
    );

  }

}
export default ReactAnimationFrame(Spectrogram);
