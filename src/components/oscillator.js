import React, {Component} from 'react';
import Tone from 'tone';

class Oscillator extends Component {

constructor(props){
  super();
  this.onMouseDown = this.onMouseDown.bind(this);
  this.onMouseUp = this.onMouseUp.bind(this);
  this.onMouseMove = this.onMouseMove.bind(this);
  this.onMouseOut = this.onMouseOut.bind(this);

}
  componentDidMount() {
    Tone.context = this.props.context;
    this.synth = new Tone.Synth().toMaster();

  }
  componentWillReceiveProps(nextProps){

  }
  onMouseDown(){
    this.synth.triggerAttack("C4");
  }
  onMouseMove(){
  }
  onMouseUp(){
    this.synth.triggerRelease();

  }
  onMouseOut(){
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
