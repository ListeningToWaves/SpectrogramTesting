import React, {Component} from 'react';
import Tone from 'tone';
import "../styles/oscillator.css"
import generateScale from '../util/generateScale';
const NUM_VOICES = 6;

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
      currentVoice: -1,
      voices: 0, //voices started with on event
      xPos: null,
      yPos: null
    }
  }

  // Setup Tone and all of its needed dependencies
  componentDidMount() {
    Tone.context = this.props.context;
    this.synths = new Array(NUM_VOICES);
    // Start master volume at -20 dB
    this.masterVolume = new Tone.Volume(-20);
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
    this.masterVolume.connect(Tone.Master);
    //Off by default
    this.masterVolume.mute = !this.props.soundOn;
    // If Headphone Mode, connect the masterVolume to the graph
    if (true) {
      this.masterVolume.connect(this.props.analyser);
    }
    window.addEventListener("resize", this.props.handleResize);
  }

  // Sets up what will happen on controls changes
  componentWillReceiveProps(nextProps, prevState) {
    if (nextProps.soundOn === false) {
      this.masterVolume.mute = true;
    } else {
      this.masterVolume.mute = false;
    }
    if (this.masterVolume.mute === false && nextProps.outputVolume && nextProps.outputVolume !== this.masterVolume.volume.value ) {
      this.masterVolume.volume.value = this.getGain(1 - (nextProps.outputVolume) / 100);
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
  }
  componentWillUnmount() {
    this.masterVolume.mute = true;
    window.removeEventListener("resize", this.props.handleResize);
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
    let pos = this.getMousePos(this.canvas, e);
    let yPercent = 1 - pos.y / this.props.height;
    let xPercent = 1 - pos.x / this.props.width;
    let freq = this.newFreqAlgorithm(yPercent);
    let gain = this.getGain(xPercent);
    let newVoice = (this.state.currentVoice + 1) % NUM_VOICES;

    this.synths[newVoice].triggerAttack(freq);
    this.synths[newVoice].volume.value = gain;
    this.label(freq, pos.x, pos.y);
    this.setState({
      mouseDown: true,
      currentVoice: newVoice,
      voices: this.state.voices + 1
    });

  }
  onMouseMove(e) {
    e.preventDefault();
    if (this.state.mouseDown) {
      let pos = this.getMousePos(this.canvas, e);
      let yPercent = 1 - pos.y / this.props.height;
      let xPercent = 1 - pos.x / this.props.width;
      let gain = this.getGain(xPercent);
      let freq = this.newFreqAlgorithm(yPercent);
      // this.synths[this.state.currentVoice].oscillator.frequency.value = freq;
      this.synths[this.state.currentVoice].frequency.exponentialRampToValueAtTime(freq, this.props.context.currentTime+0.01);

      // this.synths[this.state.currentVoice].volume.value = gain;
      this.synths[this.state.currentVoice].volume.exponentialRampToValueAtTime(gain,
          this.props.context.currentTime+0.01);
      // this.synths[this.state.currentVoice].volume.linearRampToValueAtTime(this.gainAmount,
          // context.currentTime + 0.1);
      // Clears the label
      this.ctx.clearRect(0, 0, this.props.width, this.props.height);
      this.label(freq, pos.x, pos.y);
    }

  }
  onMouseUp(e) {
    e.preventDefault();
    if (this.state.mouseDown) {
      this.synths[this.state.currentVoice].triggerRelease();
      this.setState({mouseDown: false, voices: 0});
      // Clears the label
      this.ctx.clearRect(0, 0, this.props.width, this.props.height);

    }

  }
  onMouseOut(e) {
    e.preventDefault();
    if (this.state.mouseDown) {
      this.synths[this.state.currentVoice].triggerRelease();
      this.setState({mouseDown: false, voices: 0});
      // Clears the label
      this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    }
  }

  /*The touch section is the same as the mouse section with the added feature of
  multitouch and vibrato. For each finger down, this function places a frequency
  and volume value into the next available position in the synth array
  (implmented as a circular array).
  */
  onTouchStart(e) {
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
      let pos = this.getMousePos(this.canvas, e.touches[i]);
      let yPercent = 1 - pos.y / this.props.height;
      let xPercent = 1 - pos.x / this.props.width;
      let gain = this.getGain(xPercent);
      let freq = this.newFreqAlgorithm(yPercent);
      let newVoice = (this.state.currentVoice + 1) % NUM_VOICES;
      this.setState({
        touch: true,
        currentVoice: newVoice,
        voices: this.state.voices + 1
      });
      this.synths[newVoice].triggerAttack(freq);
      this.synths[newVoice].volume.value = gain;
      this.label(freq, pos.x, pos.y);
    }
  }
  onTouchMove(e) {
    e.preventDefault();
    if (this.state.touch) {
      let voiceToChange = this.state.currentVoice - (this.state.voices - 1);
      for (let i = 0; i < e.changedTouches.length; i++) {
        let pos = this.getMousePos(this.canvas, e.changedTouches[i]);
        let yPercent = 1 - pos.y / this.props.height;
        let xPercent = 1 - pos.x / this.props.width;
        let gain = this.getGain(xPercent);
        let freq = this.newFreqAlgorithm(yPercent);
        let index = (voiceToChange + e.changedTouches[i].identifier) % NUM_VOICES;
        // Wraps the array
        index = (index < 0)
          ? (NUM_VOICES + index)
          : index;
  this.synths[index].frequency.exponentialRampToValueAtTime(freq, this.props.context.currentTime+0.01);
        // this.synths[index].frequency.value = freq;
        this.synths[index].volume.exponentialRampToValueAtTime(gain,
            this.props.context.currentTime+0.01);
        // Clears the canvas on touch move
      }
      //RedrawLabels
        this.ctx.clearRect(0, 0, this.props.width, this.props.height);
      for (let i = 0; i < e.touches.length; i++) {
        let pos = this.getMousePos(this.canvas, e.touches[i]);
        let yPercent = 1 - pos.y / this.props.height;
        let freq = this.newFreqAlgorithm(yPercent);
        this.label(freq, pos.x, pos.y);
      }
    }
  }
  onTouchEnd(e) {
    e.preventDefault();
    if (e.changedTouches.length === e.touches.length + 1) {
      for (var i = 0; i < NUM_VOICES; i++) {
        this.synths[i].triggerRelease();
      }
      this.setState({voices: 0, touch: false, notAllRelease: false, currentVoice: -1});
    } else {
      let voiceToRemoveFrom = this.state.currentVoice - (this.state.voices - 1);
      for (let i = 0; i < e.changedTouches.length; i++) {
        let index = (voiceToRemoveFrom + e.changedTouches[i].identifier) % NUM_VOICES;
        // Wraps the array
        index = (index < 0)
          ? (NUM_VOICES + index)
          : index;
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
    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
  }

  // Helper function that determines the frequency to play based on the mouse/finger position
  // Also deals with snapping it to a scale if scale mode is on
  newFreqAlgorithm(index) {
    let logResolution = Math.log(this.props.resolutionMax / this.props.resolutionMin);
    let freq = this.props.resolutionMin * Math.pow(Math.E, index * logResolution);
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

    }
    return Math.round(freq);
  }

  // Helper function that turns the x-pos into a decibel value for the volume
  getGain(index) {
    //-60 to 0dB
    return -1 * (index * 40);
  }

  // Helper method that generates a label for the frequency or the scale note
  label(freq, x, y) {
    this.ctx.font = '20px Inconsolata';
    this.ctx.fillStyle = 'white';
    if(this.props.soundOn){
      if (!this.props.scaleOn) {
        this.ctx.fillText(freq + ' Hz', x, y);
      } else {
        this.ctx.fillText(this.scaleLabel, x, y);
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
