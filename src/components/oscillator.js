import React, {Component} from 'react';
import Tone from 'tone';
import "../styles/oscillator.css"
import generateScale from '../util/generateScale';
const NUM_VOICES = 6;

class Oscillator extends Component {
  // TODO: Volume bug with new finger
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
      height: window.innerHeight,
      width: window.innerWidth,
      xPos: null,
      yPos: null,
      outputVolume: 5,
      timbre: 0
    }
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    Tone.context = this.props.context;
    this.synths = new Array(NUM_VOICES);
    this.masterVolume = new Tone.Volume(-20);
    this.ctx = this.canvas.getContext('2d');
    let options = {
      oscillator  : {
        type  : "sine"
      },
    };
    for(let i=0; i<NUM_VOICES; i++){
      this.synths[i] = new Tone.Synth(options);
      this.synths[i].chain(this.masterVolume, Tone.Master);
    }
    if(true){
      this.masterVolume.connect(this.props.analyser);
    }

    window.addEventListener("resize", this.handleResize);

  }
  componentWillReceiveProps(nextProps, prevState){
    if(nextProps.soundOn === false){
      this.masterVolume.mute = true;
    } else {
      this.masterVolume.mute = false;
    }
    if(nextProps.outputVolume && nextProps.outputVolume !== this.state.outputVolume){

      this.masterVolume.volume.value = this.getGain(1-(nextProps.outputVolume)/100);

      this.setState({outputVolume: nextProps.outputVolume });
    }
    if(nextProps.timbre !== this.state.timbre){
      let newTimbre = 'sine';
      switch (nextProps.timbre) {
        case 0: newTimbre = 'sine'; break;
        case 1: newTimbre = 'square'; break;
        case 2: newTimbre = 'sawtooth'; break;
        case 3: newTimbre = 'triangle'; break;
        default: newTimbre = 'sine';
      }
      for(let i=0; i<NUM_VOICES; i++){
        this.synths[i].oscillator.type = newTimbre;
      }

      this.setState({timbre: nextProps.timbre})
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  to
  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }
  onMouseDown(e) {
    e.preventDefault();
    let pos = this.getMousePos(this.canvas, e);
    let yPercent = 1 - pos.y / this.state.height;
    let xPercent = 1 - pos.x / this.state.width;
    let freq = this.newFreqAlgorithm(yPercent);
    let gain = this.getGain(xPercent);
    let newVoice = (this.state.currentVoice + 1) % NUM_VOICES;

    this.synths[newVoice].triggerAttack(freq);
    this.synths[newVoice].volume.value = gain;
    this.label(freq, pos.x,pos.y);
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
      let yPercent = 1 - pos.y / this.state.height;
      let xPercent = 1 - pos.x / this.state.width;
      let gain = this.getGain(xPercent);
      let freq = this.newFreqAlgorithm(yPercent);
      this.synths[this.state.currentVoice].frequency.value = freq;
      this.synths[this.state.currentVoice].volume.value = gain;
      this.ctx.clearRect(0, 0, this.state.width, this.state.height);
      this.label(freq, pos.x,pos.y);

    }

  }
  onMouseUp(e) {
    e.preventDefault();
    if(this.state.mouseDown){

    this.synths[this.state.currentVoice].triggerRelease();
    this.setState({mouseDown: false, voices: 0});
    this.ctx.clearRect(0, 0, this.state.width, this.state.height);

    }

  }
  onMouseOut(e) {
    e.preventDefault();
    if(this.state.mouseDown){
    this.synths[this.state.currentVoice].triggerRelease();
    this.setState({mouseDown: false, voices: 0});
    this.ctx.clearRect(0, 0, this.state.width, this.state.height);

    }
  }

  onTouchStart(e) {
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
      let pos = this.getMousePos(this.canvas, e.touches[i]);
      let yPercent = 1 - pos.y / this.state.height;
      let xPercent = 1 - pos.x / this.state.width;

      let gain = this.getGain(xPercent);
      let freq = this.newFreqAlgorithm(yPercent);
      let newVoice = (this.state.currentVoice + 1) % NUM_VOICES;
      this.setState({
        touch: true,
        currentVoice: newVoice,
        voices: this.state.voices + 1,
      });
      this.synths[newVoice].triggerAttack(freq);
      this.synths[newVoice].volume.value = gain;
    }
  }
  onTouchMove(e) {
    e.preventDefault();

    if (this.state.touch) {
      let voiceToChange = this.state.currentVoice - (this.state.voices -1);
      for (let i = 0; i < e.changedTouches.length; i++){
        let pos = this.getMousePos(this.canvas, e.touches[i]);
        let yPercent = 1 - pos.y / this.state.height;
        let xPercent = 1 - pos.x / this.state.width;
        let gain = this.getGain(xPercent);
        let freq = this.newFreqAlgorithm(yPercent);
        let index = (voiceToChange + e.changedTouches[i].identifier) % NUM_VOICES;
        index = (index < 0)? (NUM_VOICES+index):index;
        this.synths[index].frequency.value = freq;
        this.synths[index].volume.value = gain;

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
      let voiceToRemoveFrom = this.state.currentVoice - (this.state.voices -1);
      for (let i = 0; i < e.changedTouches.length; i++) {
        let index = (voiceToRemoveFrom + e.changedTouches[i].identifier) % NUM_VOICES;
        index = (index < 0)? (NUM_VOICES+index):index;
          this.synths[index].triggerRelease();
          this.setState({
            voices: this.state.voices-1
          });
      }
      let newVoice = this.state.currentVoice-e.changedTouches.length;
      newVoice = (newVoice < 0)? (NUM_VOICES+newVoice): newVoice;
      this.setState({
        currentVoice: newVoice,

      });
    }
  }

  newFreqAlgorithm(index) {
    let logResolution = Math.log(this.props.resolutionMax / this.props.resolutionMin);
    let freq = this.props.resolutionMin * Math.pow(Math.E, index * logResolution);
    if(this.props.scaleOn){
    //  Maps to one of the 12 keys of the piano
      let newIndexedKey = this.props.musicKey;
      // Edge cases
      if(newIndexedKey === 0 && this.props.accidental === 2){
        // Cb->B
        newIndexedKey = 11;
      } else if(newIndexedKey === 11 && this.props.accidental === 1){
        // B#->C
        newIndexedKey = 0;
      } else {
        newIndexedKey = (this.props.accidental === 1)? newIndexedKey + 1:
        (this.props.accidental === 2)? newIndexedKey - 1: newIndexedKey;
      }
      console.log(newIndexedKey);
      let s = generateScale(newIndexedKey, this.props.scale);
      let name = s.scale[0];
      console.log(s);
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

  getGain(index){
    //-80 to 0dB
    return -1*(index*60);
  }
  label(freq, x, y){
    this.ctx.font = '20px Inconsolata';
    this.ctx.fillStyle = 'white';
    if(!this.props.scaleOn){
      this.ctx.fillText(freq + ' Hz', x, y);
    } else {
      this.ctx.fillText(this.scaleLabel, x,y);
    }
  }

  handleResize() {
    this.setState({width: window.innerWidth, height: window.innerHeight});

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
      width={this.state.width}
      height={this.state.height}
      ref={(c) => {
      this.canvas = c;
      }}
      className="osc-canvas"
    />
    );
  }
}

export default Oscillator;
