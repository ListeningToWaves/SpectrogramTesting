import React, {Component} from 'react';
import Tone from 'tone';

const NUM_VOICES = 6;
class Oscillator extends Component {
  // TODO: Volume
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

    }
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    Tone.context = this.props.context;
    this.synths = new Array(NUM_VOICES);
    this.volumes = new Array(NUM_VOICES);
    this.masterVolume = new Tone.Volume(0);
    let options = {
      oscillator  : {
        type  : "sine"
      },
    };
    for(let i=0; i<NUM_VOICES; i++){
      this.synths[i] = new Tone.Synth(options);
      this.volumes[i] = new Tone.Volume(-30);
      this.synths[i].chain(this.volumes[i], this.masterVolume, Tone.Master);
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
    let percent = (1 - e.pageY / this.state.height);
    let freq = this.newFreqAlgorithm(percent);
    let newVoice = (this.state.currentVoice + 1) % NUM_VOICES;

    this.synths[newVoice].triggerAttack(freq);

    this.setState({
      mouseDown: true,
      currentVoice: newVoice,
      voices: this.state.voices + 1
    });

  }
  onMouseMove(e) {
    e.preventDefault();
    if (this.state.mouseDown) {
      let percent = (1 - e.pageY / this.state.height);
      let freq = this.newFreqAlgorithm(percent);
      this.synths[this.state.currentVoice].frequency.value = freq;
    }

  }
  onMouseUp(e) {
    e.preventDefault();
    this.synths[this.state.currentVoice].triggerRelease();
    this.setState({mouseDown: false, voices: 0});

  }
  onMouseOut(e) {
    e.preventDefault();
    if(this.currentVoice > -1){
    this.synths[this.state.currentVoice].triggerRelease();
    this.setState({mouseDown: false, voices: 0});
    }
  }

  onTouchStart(e) {
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
      let percent = (1 - e.touches[i].pageY / this.state.height);
      let freq = this.newFreqAlgorithm(percent);
      let newVoice = (this.state.currentVoice + 1) % NUM_VOICES;
      this.setState({
        touch: true,
        currentVoice: newVoice,
        voices: this.state.voices + 1,
      });

      // console.log(newVoice);
      this.synths[newVoice].triggerAttack(freq);
    }
  }
  onTouchMove(e) {
    e.preventDefault();
    if (this.state.touch) {
      for (let i = 0; i < e.changedTouches.length; i++){
        let percent = (1 - e.changedTouches[i].pageY / this.state.height);
        let freq = this.newFreqAlgorithm(percent);
        let index = ((this.state.currentVoice - (this.state.voices - 1)) + e.changedTouches[i].identifier) % NUM_VOICES;
        index = (index < 0)? (NUM_VOICES+index):index;
        this.synths[index].frequency.value = freq;
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
        // console.log(e.changedTouches[i].identifier);
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

  handleResize() {
    this.setState({width: window.innerWidth, height: window.innerHeight});

  }
  render() {
    return (<canvas onContextMenu={(e) => e.preventDefault()} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove} onMouseOut={this.onMouseOut} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} onTouchMove={this.onTouchMove} width={this.state.width} height={this.state.height} ref={(c) => {
      this.canvas = c;
    }}/>);
  }
}

export default Oscillator;
