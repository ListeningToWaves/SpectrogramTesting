import React, {Component} from 'react';
import Tone from 'tone';

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
      yPos: null

    }
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    Tone.context = this.props.context;
    this.synths = new Array(NUM_VOICES);
    this.masterVolume = new Tone.Volume(0);
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
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  onMouseDown(e) {
    e.preventDefault();
    let yPercent = (1 - ((e.pageY - e.currentTarget.offsetTop) / this.state.height));
    let xPercent = 1 - e.pageX / this.state.width;
    let freq = this.newFreqAlgorithm(yPercent);
    let gain = this.getGain(xPercent);
    let newVoice = (this.state.currentVoice + 1) % NUM_VOICES;

    this.synths[newVoice].triggerAttack(freq);
    this.synths[newVoice].volume.value = gain;
    this.setState({
      mouseDown: true,
      currentVoice: newVoice,
      voices: this.state.voices + 1
    });

  }
  onMouseMove(e) {
    e.preventDefault();
    if (this.state.mouseDown) {
      let yPercent = (1 - ((e.pageY - e.currentTarget.offsetTop) / this.state.height));
      let xPercent = 1 - e.pageX / this.state.width;
      let gain = this.getGain(xPercent);
      let freq = this.newFreqAlgorithm(yPercent);
      this.synths[this.state.currentVoice].frequency.value = freq;
      this.synths[this.state.currentVoice].volume.value = gain;
    }

  }
  onMouseUp(e) {
    e.preventDefault();
    if(this.state.mouseDown){

    this.synths[this.state.currentVoice].triggerRelease();
    this.setState({mouseDown: false, voices: 0});
    }

  }
  onMouseOut(e) {
    e.preventDefault();
    if(this.state.mouseDown){
    this.synths[this.state.currentVoice].triggerRelease();
    this.setState({mouseDown: false, voices: 0});
    }
  }

  onTouchStart(e) {
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
      let yPercent = (1 - ((e.touches[i].pageY - e.currentTarget.offsetTop) / this.state.height));
      let xPercent = 1 - e.touches[i].pageX / this.state.width;
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
        let yPercent = (1 - ((e.changedTouches[i].pageY - e.currentTarget.offsetTop) / this.state.height));
        let xPercent = 1 - e.touches[i].pageX / this.state.width;
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
    return Math.round(freq);
  }
  getGain(index){
    //-80 to 0dB
    return -1*(index*60);
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
    }}/>);
  }
}

export default Oscillator;
