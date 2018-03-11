import React, {Component} from 'react';
import Tone from 'tone';

class Oscillator extends Component {

constructor(props){
  super();
  this.onMouseDown = this.onMouseDown.bind(this);
  this.onMouseUp = this.onMouseUp.bind(this);
  this.onMouseMove = this.onMouseMove.bind(this);
  this.onMouseOut = this.onMouseOut.bind(this);
  this.state = {
    lastX: -1,
    lastY: -1,
    lastFreq: 0,
    mouseDown: false,
    currentVoice: -1
  }

}
  componentDidMount() {
    Tone.context = this.props.context;
    this.synth = new Tone.PolySynth(6, Tone.Synth);
    this.volume = new Tone.Volume(-30);
    this.synth.chain(this.volume, Tone.Master);
  }
  componentWillReceiveProps(nextProps){

  }
  onMouseDown(e){
    e.preventDefault();
    let freq = (1-e.pageY/this.props.height);
    freq = this.newFreqAlgorithm(freq);
      this.setState({
        lastX: e.pageX,
        lastY: e.pageY,
        lastFreq: freq,
        mouseDown: true,
        currentVoice: (this.state.currentVoice+1)%6
      });
      // this.lastFreq = this.getLastFrequency(x, y);
      // this.setVolume(freq);

    this.synth.triggerAttack(freq);
  }
  onMouseMove(e){
    e.preventDefault();
    if(this.state.mouseDown){

    let freq = (1-e.pageY/this.props.height);
    freq = this.newFreqAlgorithm(freq);
    this.setState({
      lastX: e.pageX,
      lastY: e.pageY,
      lastFreq: freq
    });
    // console.log(this.synth);
    this.synth.voices[this.state.currentVoice].frequency.value = freq;
  }

  }
  onMouseUp(e){
    e.preventDefault();
    this.synth.releaseAll();
    this.setState({
      mouseDown: false,
    })
  }
  onMouseOut(e){
    e.preventDefault();

  }
  newFreqAlgorithm(index) {
    let logResolution = Math.log(this.props.resolutionMax/this.props.resolutionMin);
    let freq = this.props.resolutionMin * Math.pow(Math.E, index*logResolution);
    return Math.round(freq);
  }
  render() {
      return (
    <canvas
    onMouseDown={this.onMouseDown}
    onMouseUp={this.onMouseUp}
    onMouseMove={this.onMouseMove}
    onMouseOut={this.onMouseOut}
    width={this.props.width}
     height={this.props.height}
     ref={(c) => { this.canvas = c; }}/>
   );
    }
  }

export default Oscillator;
