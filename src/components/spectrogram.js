import React, {Component} from 'react';
import '../styles/spectrogram.css';

import Axes from './axes';
import Oscillator from './oscillator';
import Menu from './menu';

const ReactAnimationFrame = require('react-animation-frame');
// TODO: Resize of canvas bugs
// TODO: Tap anywhere to start (ipad bug)

let audioContext = null;
let analyser = null;
let gainNode = null;

const fftSize = 8192;


class Spectrogram extends Component {
  constructor() {
    super();
    this.state = ({
      width: window.innerWidth,
      height: window.innerHeight,
      speed: 2,
      log: true,
      resolutionMax: 20000,
      resolutionMin: 20,
      isStarted: false
    });
    this.renderFreqDomain = this.renderFreqDomain.bind(this);
    this.handleResize = this.handleResize.bind(this);

  }

  componentDidMount() {

    window.addEventListener("resize", this.handleResize);

    this.ctx = this.canvas.getContext('2d');
    this.tempCanvas = document.createElement('canvas');
    // this.renderFreqDomain();

  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
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
    if(this.state.isStarted){
      this.renderFreqDomain();

    }
  }

  renderFreqDomain = () => {
    let freq = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freq);
    this.tempCtx = this.tempCanvas.getContext('2d');
    this.tempCanvas.width = this.state.width;
    this.tempCanvas.height = this.state.height;
    this.tempCtx.drawImage(this.canvas, 0, 0, this.state.width, this.state.height);

    // Iterate over the frequencies.
    for (var i = 0; i < this.state.height; i++) {
      var value;
      // Draw each pixel with the specific color.

      // Gets the height and creates a log scale of the index
      if (this.state.log) {
        let myPercent = (i / this.state.height);
        var logPercent = this.newFreqAlgorithm(myPercent);
        let logIndex = Math.round(logPercent * freq.length / (audioContext.sampleRate / 2));
        value = freq[logIndex];

      } else {
        let myPercent = (i / this.state.height);
        var xx = Math.floor(myPercent * (this.state.resolutionMax - this.state.resolutionMin) + this.state.resolutionMin) + 1;
        let logIndex = Math.round(xx * freq.length / (audioContext.sampleRate / 2));
        value = freq[logIndex];
      }

      this.ctx.fillStyle = this.getColor(value);
      var percent = i / this.state.height;
      var y = Math.round(percent * this.state.height);
      this.ctx.fillRect(this.state.width - this.state.speed, this.state.height - y, this.state.speed, this.state.speed);

    }
    this.ctx.translate(-this.state.speed, 0);
    this.ctx.drawImage(this.tempCanvas, 0, 0, this.state.width, this.state.height, 0, 0, this.state.width, this.state.height);
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
    let logResolution = Math.log(this.state.resolutionMax / this.state.resolutionMin);
    let freq = this.state.resolutionMin * Math.pow(Math.E, index * logResolution);
    return Math.round(freq);
  }

  handleResize() {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  }

  startSpectrogram = ()=>{
    if(!this.state.isStarted){
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
      this.setState({isStarted: true});
      this.renderFreqDomain();
    }
  }
  // <Controls />

  render() {
    return (
      <div onClick={this.startSpectrogram}>
        <Menu/>

        <canvas width={this.state.width} height={this.state.height} ref={(c) => {
          this.canvas = c;
        }}/>
        <Axes resolutionMax={this.state.resolutionMax} resolutionMin={this.state.resolutionMin}/>
        {this.state.isStarted &&
        <Oscillator width={this.state.width} height={this.state.height} resolutionMax={this.state.resolutionMax} resolutionMin={this.state.resolutionMin} context={audioContext} analyser={analyser}/>
        }
        <div className="instructions">
          {/*<h2>Spectrogram</h2>*/}
          {/*<ol>
          <li>^ Allow use of your microphone ^</li>
          */}
          {!this.state.isStarted ?
            <div className="flashing">Click or tap anywhere on the canvas to start the spectrogram</div>:
            <div className="normal">Great! Be sure to allow use of your microphone. You can draw on the canvas to make sound!</div>


          }

        {/*</ol>*/}
        </div>
      </div>
    );

  }

}
export default ReactAnimationFrame(Spectrogram);
