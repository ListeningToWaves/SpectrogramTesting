import React, { Component } from 'react';
import { Stage, Layer, Rect, Image } from 'react-konva';
import Konva from 'konva';
import './spectrogram.css';

import Axes from './axes';
import Controls from './controls';

const ReactAnimationFrame = require('react-animation-frame');
//TODO: Resize of canvas
//TODO: Make it look better

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const gainNode = audioContext.createGain();

const fftSize = 8192;
analyser.minDecibels = -100;
analyser.maxDecibels = -20;
analyser.smoothingTimeConstant = 0;
analyser.fftSize = fftSize;

let rectangles = [];
class Spectrogram extends Component {
  constructor(){
    super();
    this.state = ({
      width: window.innerWidth,
      height: window.innerHeight,
      speed: 2,
      log: true,
      resolutionMax: 20000,
      resolutionMin: 20,
      currentPos: window.innerWidth,
      currentRectangles: [],
      image: new window.Image(),
      tempCanvas: null
    });

  }

componentDidMount(){
  if (navigator.mozGetUserMedia) {
      navigator.mozGetUserMedia({audio: true},
                                this.onStream.bind(this),
                                this.onStreamError.bind(this));
    } else if (navigator.webkitGetUserMedia) {
      navigator.webkitGetUserMedia({audio: true},
                                this.onStream.bind(this),
                                this.onStreamError.bind(this));
    }

    const mainLayer = this.mainLayer;
    let updatedProps = {clearBeforeDraw: false, hitGraphEnabled:false};
    mainLayer.setAttrs(updatedProps);
    this.imageGroup.setAttrs({transformsEnabled: 'position', hitGraphEnabled:false})
}
componentWillUpdate(){
  this.mainLayer.batchDraw();

}
componentDidUpdate(){
}

onStream(stream) {
  let input = audioContext.createMediaStreamSource(stream);



  // Connect graph.
  input.connect(gainNode);
  gainNode.connect(analyser);
  gainNode.gain.setTargetAtTime(1, audioContext.currentTime, 0.01);
}

onStreamError(e) {
  console.error(e);

}

onAnimationFrame = (time)=> {
return this.renderFreqDomain();

}

renderFreqDomain = ()=> {
    let freq = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freq);

  // Iterate over the frequencies.

  rectangles = [];
  for (var i = 0; i < this.state.height; i++) {
    var value;
    // Draw each pixel with the specific color.

    // Gets the height and creates a log scale of the index
    if (this.state.log) {
      let myPercent = (i / this.state.height);
      var logPercent = this.newFreqAlgorithm(myPercent);
      let logIndex = Math.round(logPercent*freq.length/(audioContext.sampleRate/2));
      value = freq[logIndex];

    } else {
      let myPercent = (i / this.state.height);
      var xx= Math.floor(myPercent * (this.state.resolutionMax - this.state.resolutionMin) + this.state.resolutionMin)+1;
      let logIndex = Math.round(xx*freq.length/(audioContext.sampleRate/2));
      value = freq[logIndex];
    }


    var percent = i / this.state.height;
    var y = Math.round(percent *this.state.height);
    rectangles.push(
      {
      x:this.state.width - this.state.speed,
      y:this.state.height - y,
      width:this.state.speed,
      height:this.state.speed,
      fill:this.getColor(value)
      }
    );

  // this.setState({
  //   currentPos: this.state.currentPos - 1
  // });
    // draw the line at the right side of the canvas
    // ctx.fillRect(this.width - this.speed, this.height - y,
    //              this.speed, this.speed);
  }

  // this.mainGroup.
  // return (
let recs = rectangles.map((rectangle, index)=>{
      return (<Rect
      x={rectangle.x}
      y={rectangle.y}
      width={rectangle.width}
      height={rectangle.height}
      fill={rectangle.fill}
      key = {index}
      />
    )
  });
  // this.mainLayer.move({x:-this.state.speed, y:0});

  this.imageGroup.move({x:-this.state.speed, y:0});
  this.mainLayer.toImage({
    callback: (img)=>{
      this.setState({
        image: img,
        currentRectangles: recs
      });

    }
  });
  // this.mainLayer.position({x:0, y:0});
  this.imageGroup.position({x:0, y:0});
  //console.log(this.imageGroup.getTransform());
}



getColor(value) {
    // Test Max
    if(value === 255) {
      console.log("MAX!");
    }
    var percent = (value) / 255 * 50;
// return 'rgb(V, V, V)'.replace(/V/g, 255 - value);
   return 'hsl(H, 100%, P%)'.replace(/H/g, 255-value).replace(/P/g, percent);
}

newFreqAlgorithm(index) {
  let logResolution = Math.log(this.state.resolutionMax/this.state.resolutionMin);
  let freq = this.state.resolutionMin * Math.pow(Math.E, index*logResolution);
  return Math.round(freq);

}



  render() {
    return (
      <div>
      <Controls />
    <Stage ref="stage" width={window.innerWidth} height={window.innerHeight}>
      <Layer ref={node => {
          this.mainLayer = node;
        }}>

{this.state.currentRectangles}
    <Image ref={node => {
        this.imageGroup = node;
      }}
      image={this.state.image}/>
      </Layer>
<Axes
width={this.state.width}
height={this.state.height}
resolutionMax={this.state.resolutionMax}
resolutionMin={this.state.resolutionMin}
/>

</Stage>
</div>
    );

  }

}
export default ReactAnimationFrame(Spectrogram);
