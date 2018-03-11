import React, { Component } from 'react';
import "../styles/axes.css";

class Axes extends Component {

constructor(props){
  super();
    this.state = {
    yLabelOffset: 5,
    ticks: 5
  }
}

componentDidMount(){
  this.ctx = this.canvas.getContext('2d');
  this.renderAxesLabels();
}
componentDidUpdate(){
  this.renderAxesLabels();
}

renderAxesLabels() {
let {height, width} = this.props;

  // Render the vertical frequency axis.
  const units = 'Hz';

  for (var i = 0; i <= this.state.ticks; i++) {
    // Get the y coordinate from the current label.
    var percent  = i/(this.state.ticks);
    var y = (1-percent) * height;

    var x = width - 60;
    // Get the value for the current y coordinate.

    // if (this.log) {
      // Handle a logarithmic scale.
      // var logIndex = this.logScale(index, maxSample)+minSample;
      // Never show 0 Hz.

      let freq = Math.max(1,this.newFreqAlgorithm(percent));

      this.ctx.font = '18px Inconsolata';
            // Draw the value.
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = 'white';


            this.ctx.fillText(freq, x, y + this.state.yLabelOffset);
            // Draw the units.
            this.ctx.textAlign = 'left';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(units, x + 10, y + this.state.yLabelOffset);
            // Draw a tick mark.
            this.ctx.fillRect(x + 40, y, 30, 2);
  }
}

  newFreqAlgorithm(index) {
    let logResolution = Math.log(this.props.resolutionMax/this.props.resolutionMin);
    let freq = this.props.resolutionMin * Math.pow(Math.E, index*logResolution);
    return Math.round(freq);

  }

render(){
  return (
<canvas
width={this.props.width}
 height={this.props.height}
 ref={(c) => { this.canvas = c; }}/>
  )
}
}
export default Axes;
