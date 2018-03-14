import React, {Component} from 'react';
import "../styles/axes.css";

class Axes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      yLabelOffset: 5,
      ticks: 5,
      height: window.innerHeight,
      width: window.innerWidth
    }
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    window.addEventListener("resize", this.handleResize);
    this.renderAxesLabels();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize() {
    this.setState({width: window.innerWidth, height: window.innerHeight});
    this.renderAxesLabels();
  }

  renderAxesLabels() {
    console.log("H");

    let {height, width} = this.state;
    this.ctx.clearRect(0, 0, this.state.width, this.state.height);
    // Render the vertical frequency axis.
    const units = 'Hz';
    // console.log("HI");

    for (var i = 0; i <= this.state.ticks; i++) {
      // Get the y coordinate from the current label.
      var percent = i / (this.state.ticks);
      var y = (1 - percent) * height;

      var x = width - 60;
      // Get the value for the current y coordinate.

      // if (this.log) {
      // Handle a logarithmic scale.
      // var logIndex = this.logScale(index, maxSample)+minSample;
      // Never show 0 Hz.

      let freq = Math.max(1, this.newFreqAlgorithm(percent));

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
    let logResolution = Math.log(this.props.resolutionMax / this.props.resolutionMin);
    let freq = this.props.resolutionMin * Math.pow(Math.E, index * logResolution);
    return Math.round(freq);

  }

  render() {
    return (<canvas width={this.state.width} height={this.state.height} ref={(c) => {
      this.canvas = c;
    }}/>)
  }
}
export default Axes;
