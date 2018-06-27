import React, {Component} from 'react';
import generateScale from '../util/generateScale';
import Tone from 'tone';
import '../styles/note-lines.css';

const release = 2;
let options = {
  oscillator: {
    type: "sine"
  },
  envelope: {
    attack: 1,
    release: 2
  }
};
class NoteLines extends Component {

  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    // this.ctx.globalAlpha = 0.5;
    window.addEventListener("resize", this.handleResize);
    Tone.context = this.props.context;

    this.synth = new Tone.Synth(options);
    this.masterVolume = new Tone.Volume(-2);
    this.synth.connect(this.masterVolume);
    this.masterVolume.connect(Tone.Master);
    this.masterVolume.mute = !this.props.soundOn;
    // If Headphone Mode, connect the masterVolume to the graph
    if (true) {
      this.masterVolume.connect(this.props.analyser);
    }
    this.frequencies = {};
    this.freq = 1;
    this.goldIndex = -1;
    this.renderNoteLines();

  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    this.masterVolume.mute = true;

  }
  componentWillReceiveProps(nextProps, prevState) {
    if (nextProps.soundOn === false) {
      this.masterVolume.mute = true;
    } else {
      this.masterVolume.mute = false;
    }
    if (this.masterVolume.mute === false && nextProps.outputVolume && nextProps.outputVolume !== this.masterVolume.volume.value ) {
      this.masterVolume.volume.value = this.getGain(1 - (nextProps.outputVolume) / 100);
    }
  }

  onMouseDown(e){
    console.log("DOWN");
    e.preventDefault();
    this.mouseDown = true;
    this.onMouseMove(e);
  }

  onMouseMove(e) {
    e.preventDefault();
    if(this.mouseDown){
        let {height, width, soundOn} = this.props;
        let pos = this.getMousePos(this.canvas, e);
        let yPercent = 1 - pos.y / height;
        let xPercent = 1 - pos.x / width;
        let gain = this.getGain(xPercent);
        let freq = this.newFreqAlgorithm(yPercent);
        if(soundOn){
          for(let j in this.frequencies){
            if(Math.abs(this.frequencies[j] - freq) < 0.01 * freq){
              if(this.frequencies[j] !== this.freq){
                this.synth.triggerRelease();

                // this.ctx.fillStyle = 'white';
                // let oldIndex = this.freqToIndex(this.freq);
                // this.ctx.fillRect(0, oldIndex, width, 1.5);
                this.freq = this.frequencies[j];
                let index = this.freqToIndex(this.frequencies[j]);
                this.goldIndex = index;// Sets the Gold Line to the new Line
                this.renderNoteLines();
                let endTime =  this.props.context.currentTime + release;
                this.synth.volume.cancelAndHoldAtTime(this.props.context.currentTime);
                this.synth.volume.exponentialRampToValueAtTime(0.0001, endTime);
                this.synth.oscillator.stop(endTime);
                this.synth = null;

                this.synth = new Tone.Synth(options);

                this.synth.connect(this.masterVolume);
                this.synth.triggerAttack(this.frequencies[j]);
                this.label(j, pos.x, pos.y+2);

              }
              this.synth.volume.value = gain;
              break;
            }
          }
        }
      }
  }

  onMouseUp(e){
    e.preventDefault();
    this.mouseDown = false;
    this.synth.triggerRelease();
    this.synth = null;
    this.synth = new Tone.Synth(options);
    this.goldIndex = -1;
    this.freq = -1;
    this.renderNoteLines();

  }
  onMouseOut(e){
    e.preventDefault();
    this.mouseDown = false;
    this.synth.triggerRelease();
    this.goldIndex = -1;
    this.freq = -1;
    this.renderNoteLines();

  }

  onTouchStart(e){
    e.preventDefault();
    // this.touch = true;
    this.onTouchMove(e);
  }
  onTouchMove(e) {
    e.preventDefault();
    // if(this.touch){
        let {height, width, soundOn} = this.props;
        let pos = this.getMousePos(this.canvas, e.changedTouches[0]);
        let yPercent = 1 - pos.y / height;
        let xPercent = 1 - pos.x / width;
        let gain = this.getGain(xPercent);
        let freq = this.newFreqAlgorithm(yPercent);
        if(soundOn){
          for(let j in this.frequencies){
            if(Math.abs(this.frequencies[j] - freq) < 0.01 * freq){
              if(this.frequencies[j] !== this.freq){
                this.synth.triggerRelease();
                // this.ctx.fillStyle = 'white';
                // let oldIndex = this.freqToIndex(this.freq);
                // this.ctx.fillRect(0, oldIndex, width, 1.5);
                this.freq = this.frequencies[j];
                let index = this.freqToIndex(this.frequencies[j]);
                this.goldIndex = index;
                this.renderNoteLines();

                let endTime =  this.props.context.currentTime + release;
                this.synth.volume.cancelAndHoldAtTime(this.props.context.currentTime);
                this.synth.volume.exponentialRampToValueAtTime(0.0001, endTime);
                this.synth.oscillator.stop(endTime);
                this.synth = null;

                this.synth = new Tone.Synth(options);

                this.synth.connect(this.masterVolume);

                this.synth.triggerAttack(this.frequencies[j]);
                this.label(j, pos.x, pos.y+2);

              }
              this.synth.volume.value = gain;
              break;
            }
          }
        }
      // }
    }

  onTouchEnd(e){
    e.preventDefault();
    this.synth.triggerRelease();
    this.renderNoteLines();
    this.goldIndex = -1;
    this.freq = -1;
    // this.touch = false;
  }



  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    return {
      x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element
    }
  }

  newFreqAlgorithm(index) {
    let logResolution = Math.log(this.props.resolutionMax / this.props.resolutionMin);
    let freq = this.props.resolutionMin * Math.pow(Math.E, index * logResolution);
    return freq;
  }
  // Helper function that turns the x-pos into a decibel value for the volume
  getGain(index) {
    //-60 to 0dB
    return -1 * (index * 40);
  }

  handleResize = () => {
    this.props.handleResize();
    this.renderNoteLines();
  }

  // Helper method that generates a label for the frequency or the scale note
  label(name, x, y) {
    this.ctx.font = '20px Inconsolata';
    this.ctx.fillStyle = 'white';

    if(this.props.soundOn){
        this.ctx.fillText(name, x, y);
    }
  }

  renderNoteLines = () => {
    let {height, width} = this.props;
    this.ctx.clearRect(0, 0, width, height);
    // this.ctx.fillStyle = 'white';

    //  Maps to one of the 12 keys of the piano based on note and accidental
    let newIndexedKey = this.props.musicKey.value;
    // Edge cases
    if (newIndexedKey === 0 && this.props.accidental.value === 2) {
      // Cb->B
      newIndexedKey = 11;
    } else if (newIndexedKey === 11 && this.props.accidental.value === 1) {
      // B#->C
      newIndexedKey = 0;
    } else {
      newIndexedKey = (this.props.accidental.value === 1)
        ? newIndexedKey + 1
        : (this.props.accidental.value === 2)
          ? newIndexedKey - 1
          : newIndexedKey;
    }

    this.frequencies = {};
    // Uses generateScale helper method to generate base frequency values
    let s = generateScale(newIndexedKey, this.props.scale.value);
    //Sweeps through scale object and draws frequency
    for (let i = 0; i < s.scale.length; i++) {
      let freq = s.scale[i];

      for (let j = 0; j < 15; j++) {
        if (freq > this.props.resolutionMax) {
          break;
        } else {
          let name = s.scaleNames[i]+''+j;
          let index = this.freqToIndex(freq);
          this.frequencies[name] = freq;
          if(index === this.goldIndex){
            this.ctx.fillStyle = 'gold';
            this.ctx.fillRect(0, index, width, 1.5);
          } else {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, index, width, 1.5);
          }
          freq = freq * 2;
        }
      }
    }

  }



  freqToIndex(freq) {
    let logResolution = Math.log(this.props.resolutionMax / this.props.resolutionMin);
    let x = Math.log(freq / this.props.resolutionMin) / logResolution;

    // console.log(x*100);
    if (!isNaN(x)) {
      return (1 - x) * this.props.height;
    }
    return 0;
  }
  render() {
    return (<canvas
      className="note-lines-canvas"
      width={this.props.width}
      height={this.props.height}
      onMouseDown={this.onMouseDown}
      onMouseMove={this.onMouseMove}
      onMouseUp={this.onMouseUp}
      onMouseOut={this.onMouseOut}
      onTouchStart={this.onTouchStart}
      onTouchMove={this.onTouchMove}
      onTouchEnd={this.onTouchEnd}
      ref={(c) => {
      this.canvas = c;
    }}/>);
  }
}
export default NoteLines;
