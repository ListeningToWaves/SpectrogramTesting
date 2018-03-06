import React, { Component } from 'react';
import { Layer, Rect, Text } from 'react-konva';

class Axes extends Component {

constructor(props){
  super();
    this.state = {
    yLabelOffset: -10,
    ticks: 5
  }
}
renderAxesLabels = () => {
let {height, width} = this.props
  // Render the vertical frequency axis.
  const units = 'Hz';
let valueArr = [];
  for (var i = 0; i <= this.state.ticks; i++) {
    // Get the y coordinate from the current label.
    var percent  = i/(this.state.ticks);
    var y = (1-percent) * height;

    var x = width - 100;
    // Get the value for the current y coordinate.

    // if (this.log) {
      // Handle a logarithmic scale.
      // var logIndex = this.logScale(index, maxSample)+minSample;
      // Never show 0 Hz.
      let freq = Math.max(1,this.newFreqAlgorithm(percent));

  valueArr.push(
    <Text
    fontFamily = "Inconsolata"
    fontSize = {18}
    fill="white"
    align="right"
    text={freq}
    x={x-10}
    y={y+this.state.yLabelOffset}
    key={Math.random()}
    width={50}


    />,
    <Text
    fontFamily = "Inconsolata"
    fontSize = {18}
    fill="white"
    align="left"
    text={units}
    x={x+50}
    y={y+this.state.yLabelOffset}
    key={Math.random()}

    />,
    <Rect
    x={x+80}
    y={y}
    width={30}
    height={2}
    fill="white"
    key={Math.random()}
    />
  );
  }
  return valueArr;
}
  newFreqAlgorithm(index) {
    let logResolution = Math.log(this.props.resolutionMax/this.props.resolutionMin);
    let freq = this.props.resolutionMin * Math.pow(Math.E, index*logResolution);
    return Math.round(freq);

  }

render(){
  return (
    <Layer ref={node => {
        this.mainLayer = node;
      }}>
      {this.renderAxesLabels()}
      </Layer>
  )
}
}
export default Axes;
