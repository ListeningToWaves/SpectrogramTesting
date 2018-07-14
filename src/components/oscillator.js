import React, {Component} from 'react';
import Tone from 'tone';
import "../styles/oscillator.css"
import generateScale from '../util/generateScale';

import { newFreqAlgorithm, getGain, freqToIndex, getMousePos } from "../util/conversions";

const NUM_VOICES = 6;
const RAMPVALUE = 0.1;

// Main sound-making class. Can handle click and touch inputs
class Oscillator extends Component {
  // TODO: Sometimes strange sounds
  constructor(props) {
    super();
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.state = {
      mouseDown: false,
      touch: false,
      currentVoice: 0,
      voices: 0, //voices started with on event
      feedback: false
    }
  }

  // Setup Tone and all of its needed dependencies
  componentDidMount() {
    Tone.context = this.props.context;
    this.synths = new Array(NUM_VOICES);
    // Start master volume at -20 dB
    this.masterVolume = new Tone.Volume(0);
    this.ctx = this.canvas.getContext('2d');
    let options = {
      oscillator: {
        type: "sine"
      }
    };
    // For each voice, create a synth and connect it to the master volume
    for (let i = 0; i < NUM_VOICES; i++) {
      this.synths[i] = new Tone.Synth(options);
      this.synths[i].connect(this.masterVolume);
    }
    this.goldIndices = [];
    this.masterVolume.connect(Tone.Master);
    //Off by default
    this.masterVolume.mute = !this.props.soundOn;

    this.frequencies = {};
    this.freq = 1;

    window.addEventListener("resize", this.handleResize);
  }

  // Sets up what will happen on controls changes
  componentWillReceiveProps(nextProps, prevState) {
    if (nextProps.soundOn === false) {
      this.masterVolume.mute = true;
    } else {
      this.masterVolume.mute = false;
    }
    if (this.masterVolume.mute === false && nextProps.outputVolume && nextProps.outputVolume !== this.masterVolume.volume.value ) {
      this.masterVolume.volume.value = getGain(1 - (nextProps.outputVolume) / 100);
    }
    if (nextProps.timbre !== this.synths[0].oscillator.type) {
      let newTimbre = nextProps.timbre.toLowerCase();
      for (let i = 0; i < NUM_VOICES; i++) {
        this.synths[i].oscillator.type = newTimbre;
      }
    }
    if (nextProps.attack !== this.synths[0].envelope.attack) {
      for (let i = 0; i < NUM_VOICES; i++) {
        this.synths[i].envelope.attack = nextProps.attack;
      }
    }
    if (nextProps.release !== this.synths[0].envelope.release) {
      for (let i = 0; i < NUM_VOICES; i++) {
        this.synths[i].envelope.release = nextProps.release;
      }
    }
    if(nextProps.headphoneMode){
      // If Headphone Mode, connect the masterVolume to the graph
      if(!this.state.feedback){
        this.masterVolume.connect(this.props.analyser);
        this.setState({feedback: true});
      }
    } else {
      if(this.state.feedback){
        this.masterVolume.disconnect(this.props.analyser);
        this.setState({feedback: false});
      }
    }
    if(nextProps.noteLinesOn){
      this.ctx.clearRect(0, 0, this.props.width, this.props.height);
      this.renderNoteLines();
    } else {
      this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    }
  }
  componentWillUnmount() {
    this.masterVolume.mute = true;
    window.removeEventListener("resize", this.handleResize);
  }

  // Helper Function that gets the Mouse position based on the rescaled canvas
  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    return {
      x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element
    }
  }
  /**
  This Section controls how the Oscillator(s) react to user input
  */
  onMouseDown(e) {
    e.preventDefault();
    let pos = getMousePos(this.canvas, e);
    let yPercent = 1 - pos.y / this.props.height;
    let xPercent = 1 - pos.x / this.props.width;
    let freq = this.newFreqAlgorithm(yPercent);
    let gain = getGain(xPercent);

    let newVoice = (this.state.currentVoice + 1) % NUM_VOICES; // Mouse always changes to new "voice"
    this.synths[newVoice].triggerAttack(freq);
    this.synths[newVoice].volume.value = gain;
    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    this.label(freq, pos.x, pos.y);
    this.setState({
      mouseDown: true,
      currentVoice: newVoice,
      voices: this.state.voices + 1
    });
    if(this.props.noteLinesOn){
      this.renderNoteLines();
    }

  }
  onMouseMove(e) {
    e.preventDefault();
    if (this.state.mouseDown) {
      let {height, width} = this.props
      let pos = getMousePos(this.canvas, e);
      let yPercent = 1 - pos.y / height;
      let xPercent = 1 - pos.x / width;
      let gain = getGain(xPercent);
      let freq = this.newFreqAlgorithm(yPercent);
      this.goldIndices.splice(this.state.currentVoice - 1, 1);
      // this.synths[this.state.currentVoice].oscillator.frequency.value = freq;
      // Ramps to new Frequency
      this.synths[this.state.currentVoice].frequency.exponentialRampToValueAtTime(freq, this.props.context.currentTime+RAMPVALUE);
      // this.synths[this.state.currentVoice].volume.value = gain;
      // Ramps to new Gain
      this.synths[this.state.currentVoice].volume.exponentialRampToValueAtTime(gain,
          this.props.context.currentTime+RAMPVALUE);
      // Clears the label
      this.ctx.clearRect(0, 0, this.props.width, this.props.height);
      this.label(freq, pos.x, pos.y);
      if(this.props.noteLinesOn){
        this.renderNoteLines();

      }
    }


  }
  onMouseUp(e) {
    e.preventDefault();
    if (this.state.mouseDown) {
      this.synths[this.state.currentVoice].triggerRelease();
      this.setState({mouseDown: false, voices: 0});
      this.goldIndices = [];

      // Clears the label
      this.ctx.clearRect(0, 0, this.props.width, this.props.height);
      if(this.props.noteLinesOn){
        this.renderNoteLines();
      }
    }


  }
  onMouseOut(e) {
    e.preventDefault();
    if (this.state.mouseDown) {
      this.synths[this.state.currentVoice].triggerRelease();
      this.setState({mouseDown: false, voices: 0});
      this.goldIndices = [];

      // Clears the label
      this.ctx.clearRect(0, 0, this.props.width, this.props.height);
      if(this.props.noteLinesOn){
        // this.goldIndex = -1;
        this.renderNoteLines();
      }
    }
  }

  /*The touch section is the same as the mouse section with the added feature of
  multitouch and vibrato. For each finger down, this function places a frequency
  and volume value into the next available position in the synth array
  (implmented as a circular array).
  */
  onTouchStart(e) {
    e.preventDefault();
    if(e.touches.length > NUM_VOICES ){
      return;
    }
    for (let i = 0; i < e.touches.length; i++) {
      let pos = getMousePos(this.canvas, e.touches[i]);
      let yPercent = 1 - pos.y / this.props.height;
      let xPercent = 1 - pos.x / this.props.width;
      let gain = getGain(xPercent);
      let freq = this.newFreqAlgorithm(yPercent);
      let newVoice = (this.state.currentVoice + 1) % NUM_VOICES;
      this.setState({
        touch: true,
        currentVoice: newVoice,
        voices: this.state.voices + 1
      });
      this.synths[newVoice].triggerAttack(freq);
      this.synths[newVoice].volume.value = gain;

      this.ctx.clearRect(0, 0, this.props.width, this.props.height);
      this.label(freq, pos.x, pos.y);
    }
    if(this.props.noteLinesOn){
      this.renderNoteLines();
    }
  }
  onTouchMove(e) {
    e.preventDefault();
    if(e.changedTouches.length > NUM_VOICES ){
      return;
    }
    let {width, height} = this.props;

    if (this.state.touch) {
      let voiceToChange = this.state.currentVoice - (this.state.voices - 1);

      for (let i = 0; i < e.changedTouches.length; i++) {
        let pos = getMousePos(this.canvas, e.changedTouches[i]);
        let yPercent = 1 - pos.y / this.props.height;
        let xPercent = 1 - pos.x / this.props.width;
        let gain = getGain(xPercent);

        let freq = this.newFreqAlgorithm(yPercent);
        let index = (voiceToChange + e.changedTouches[i].identifier) % NUM_VOICES;
        // Wraps the array
        index = (index < 0)
          ? (NUM_VOICES + index)
          : index;

          let oldFreq = this.synths[index].frequency.value;
          for (let note in this.frequencies){
            if (Math.abs(this.frequencies[note] - oldFreq) < 0.1*oldFreq){
              oldFreq = this.frequencies[note]
            }
          }
          this.goldIndices.splice(index - 1, 1);

          // Ramps to new Frequency
  this.synths[index].frequency.exponentialRampToValueAtTime(freq, this.props.context.currentTime+RAMPVALUE);
        // this.synths[index].frequency.value = freq;
        // Ramp to new Volume
        this.synths[index].volume.exponentialRampToValueAtTime(gain,
            this.props.context.currentTime+RAMPVALUE);
        // Clears the canvas on touch move
      }
      //RedrawLabels
        this.ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < e.touches.length; i++) {
        let pos = getMousePos(this.canvas, e.touches[i]);
        let yPercent = 1 - pos.y / this.props.height;
        let freq = this.newFreqAlgorithm(yPercent);
        this.label(freq, pos.x, pos.y);
      }
      if(this.props.noteLinesOn){
        this.renderNoteLines();
      }
    }
  }
  onTouchEnd(e) {
    e.preventDefault();
    let {width, height} = this.props;
    if (e.changedTouches.length === e.touches.length + 1) {
      for (var i = 0; i < NUM_VOICES; i++) {
        this.synths[i].triggerRelease();
      }
      this.goldIndices = []

      this.setState({voices: 0, touch: false, notAllRelease: false, currentVoice: -1});
    } else {
      let voiceToRemoveFrom = this.state.currentVoice - (this.state.voices - 1);
      for (let i = 0; i < e.changedTouches.length; i++) {
        let index = (voiceToRemoveFrom + e.changedTouches[i].identifier) % NUM_VOICES;
        // Wraps the array
        index = (index < 0)
          ? (NUM_VOICES + index)
          : index;

          this.goldIndices.splice(index, 1);
        this.synths[index].triggerRelease();
        this.setState({
          voices: this.state.voices - 1
        });
      }
      let newVoice = this.state.currentVoice - e.changedTouches.length;
      newVoice = (newVoice < 0)
        ? (NUM_VOICES + newVoice)
        : newVoice;
      this.setState({currentVoice: newVoice});

    }
    // Clears the label
    this.ctx.clearRect(0, 0, width, height);
    if(this.props.noteLinesOn){
      this.renderNoteLines();
    }

  }

  // Helper function that determines the frequency to play based on the mouse/finger position
  // Also deals with snapping it to a scale if scale mode is on
  newFreqAlgorithm(index) {
    let {resolutionMax, resolutionMin, height} = this.props;
    let freq = newFreqAlgorithm(index, resolutionMax, resolutionMin)
    if (this.props.scaleOn) {
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
      // Uses generateScale helper method to generate base frequency values
      let s = generateScale(newIndexedKey, this.props.scale.value);
      let name = s.scale[0];
      let note = 0;
      let dist = 20000;
      let harmonic = 0;
      //Sweeps through scale object and plays correct frequency
      for (var j = 1; j < 1500; j = j * 2) {

        for (var k = 0; k < s.scale.length; k++) {

          var check = j * s.scale[k];
          var checkDist = Math.abs(freq - check);
          if (checkDist < dist) {
            dist = checkDist;
            note = check;
            name = s.scaleNames[k];
            harmonic = Math.round(Math.log2(j) - 1);
          } else {
            break;
          }
        }
      }
      freq = note;
      let textLabel = name + '' + harmonic;
      this.scaleLabel = textLabel;
      let index = freqToIndex(freq, resolutionMax, resolutionMin, height);

      // if (!this.goldIndices.includes(index)){
        this.goldIndices[this.state.currentVoice] = index;
      // }

    }
    return Math.round(freq);
  }

  handleResize = () => {
    this.props.handleResize();
    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    this.renderNoteLines();
  }

  // Helper method that generates a label for the frequency or the scale note
  label(freq, x, y) {
    const offset = 10;
    this.ctx.font = '20px Inconsolata';
    this.ctx.fillStyle = 'white';
    if(this.props.soundOn){
      if (!this.props.scaleOn) {
        this.ctx.fillText(freq + ' Hz', x + offset, y - offset);
      } else {
        this.ctx.fillText(this.scaleLabel, x + offset, y - offset);
      }
      // Draw Circle for point
    const startingAngle = 0;
    const endingAngle = 2 * Math.PI;
    const radius = 10;
    const color = 'rgb(255, 255, 0)';
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, startingAngle, endingAngle);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.stroke();
    }
  }

  renderNoteLines(){
    let {height, width, resolutionMax, resolutionMin} = this.props;
    // this.ctx.clearRect(0, 0, width, height);
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
        if (freq > resolutionMax) {
          break;
        } else {
          let name = s.scaleNames[i]+''+j;
          let index = freqToIndex(freq, resolutionMax, resolutionMin, height);
          this.frequencies[name] = freq;

          // console.log("NOTELINES GOLD: "+this.goldIndices);
          // console.log("NOTELINES INDEX: "+index);
          if(this.goldIndices.includes(index) && this.props.soundOn){
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

  render() {
    return (
      <canvas
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={this.onMouseDown}
      onMouseUp={this.onMouseUp}
      onMouseMove={this.onMouseMove}
      onMouseOut={this.onMouseOut}
      onTouchStart={this.onTouchStart}
      onTouchEnd={this.onTouchEnd}
      onTouchMove={this.onTouchMove}
      width={this.props.width}
      height={this.props.height}
      ref={(c) => {
      this.canvas = c;
    }} className="osc-canvas"/>);
  }
}

export default Oscillator;
