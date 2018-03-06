import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Group, Image } from 'react-konva';
import Konva from 'konva';
import './spectrogram.css';
const ReactAnimationFrame = require('react-animation-frame');
//TODO: Resize of canvas
//TODO: MAINLAYER, TEMPLAYER

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const gainNode = audioContext.createGain();

const fftSize = 8192;
analyser.minDecibels = -100;
analyser.maxDecibels = -20;
analyser.smoothingTimeConstant = 0;
analyser.fftSize = fftSize;

const Aux = props => props.children;

// let tempCanvas = new Konva.Layer();
// let tempCanvas = window.createElement('canvas');


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
      rectangles: [],
      image: new window.Image(),
      tempCanvas: null
    });
    // this.loop = this.loop.bind(this);

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
this.setState({
tempCanvas : this.refs.canvas
});
    const mainLayer = this.mainLayer;
    let updatedProps = {clearBeforeDraw: false};
    mainLayer.setAttrs(updatedProps);
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
// this.state.width = window.innerWidth;
// this.state.height = window.innerHeight;
// tempCanvas = new Konva.Layer();
// requestAnimationFrame(this.loop.bind(this));
return this.renderFreqDomain();

}

renderFreqDomain = ()=> {



  let freq = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freq);

  // var ctx = this.ctx;
  // Copy the current canvas onto the temp canvas.
  this.state.tempCanvas.width = this.state.width;
  this.state.tempCanvas.height = this.state.height;
  let tempCtx = this.state.tempCanvas.getContext('2d');
  tempCtx.drawImage(this.mainLayer.canvas._canvas, 0, 0, this.width, this.height);

      const image = new window.Image();
    image.src = "http://konvajs.github.io/assets/yoda.jpg";
    // image.src = this.mainLayer.canvas._canvas;
    image.onload = () => {
      // setState will redraw layer
      // because "image" property is changed
      this.setState({
        image: image
      });
    };

     // console.log(this.mainLayer);
  // calling set state here will do nothing
  // because properties of Konva.Image are not changed
  // so we need to update layer manually
  // this.imageNode.getL  ayer().batchDraw();
  // tempCanvas.batchDraw();
  // var imageObj = new window.Image();
  // var tempImage = new Konva.Image({
  //       x: 0,
  //       y: 0,
  //       image: this.mainLayer,
  //       width: this.state.width,
  //       height: this.state.height
  //     });

      // add the shape to the layer
      // tempCanvas.add(tempImage);


  // this.tempCanvas.width = this.width;
  // this.tempCanvas.height = this.height;
  // var tempCtx = this.tempCanvas.getContext('2d');
  // tempCtx.drawImage(this.$.canvas, 0, 0, this.width, this.height);
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
      x:this.state.currentPos - this.state.speed,
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
    })
  // );
  // if(this.state.currentPos !== 1){
  //   this.setState({currentPos:this.state.currentPos - 0 })
  // } else {
  //   this.setState({currentPos:this.state.width})
  //
  // }
  let ctx = this.mainLayer.canvas._canvas.getContext('2d');

  this.mainLayer.move({x:-4, y:0});
  this.setState({rectangles: recs});
  // console.log(this.refs.stage);
ctx.drawImage(this.state.tempCanvas, 0, 0, this.width, this.height,
              0, 0, this.width, this.height);


// let t = new Konva.Transform();
// t.translate({x:1, y:1});
// this.mainLayer.t;
// this.mainLayer.add(new Konva.Transformer([1, 0, 0, 1, 0, 0]));

// transform(this.mainLayer);
/*
  // Translate the canvas.
  ctx.translate(-this.speed, 0);
  // Draw the copied image.
  ctx.drawImage(this.tempCanvas, 0, 0, this.width, this.height,
                0, 0, this.width, this.height);

  // Reset the transformation matrix.
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  */
}



getColor(value) {
    // var fromH = 200;
    // var toH = 1;
    // var percent = value / 255;
    // var delta = percent * (toH - fromH);
    // var hue = fromH + delta;

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
    <Stage ref="stage" width={window.innerWidth} height={window.innerHeight}>
      <Layer ref={node => {
          this.mainLayer = node;
        }}>
    {this.state.rectangles}

      </Layer>


</Stage>
<canvas ref="canvas"></canvas>
    </div>
    );

  }

}
export default ReactAnimationFrame(Spectrogram);
