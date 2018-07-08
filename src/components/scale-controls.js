import React, {Component} from 'react';
import "../styles/scale-controls.css";

class Scales extends Component {
  constructor(props) {
    super();
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerOut = this.onPointerOut.bind(this);

    this.state = {
      evCache: {},
      topFreq: 0,
      bottomFreq: 0,
      prevDiff: -1,
      zoomMax: 0,
      zoomMin: 0,
    }
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.ctx = this.canvas.getContext('2d');

    this.setState({zoomMax: this.props.resolutionMax, zoomMin: this.props.resolutionMin});
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    return {
      x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element
    }
  }

  onPointerDown(e) {
    let key = e.pointerId;
    let newObj = this.state.evCache;
    let pos = this.getMousePos(this.canvas, e);
    newObj[key] = pos.y;
    this.ctx.fillStyle = '#d6d1d5';
    this.ctx.fillRect(0, pos.y, this.canvas.width, 20);

    let freq = this.newFreqAlgorithm(1-pos.y/this.props.height);
    this.ctx.font = '24px Inconsolata';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(freq + ' Hz', 100, pos.y);
    let top,bottom;
    let length = Object.keys(newObj).length;

    if(length === 1){
      top = pos.y;
      bottom = 0;
    } else {
      if(this.state.topFreq < pos.y){
        top = this.state.topFreq;
        bottom = pos.y;
      } else {
        top = pos.y;
        bottom = this.state.topFreq;
      }
    }
    this.setState({evCache: newObj, topFreq: top, bottomFreq: bottom});
    // console.log(bottom);
  }

  onPointerMove(e) {
      let {height, width} = this.props;
      this.ctx.clearRect(0, 0, width, height);
      let newObj = this.state.evCache;
      let key = e.pointerId;
      let pos = this.getMousePos(this.canvas, e);
      newObj[key] = pos.y;


      // If two pointers are down, check for pinch gestures
    let length = Object.keys(newObj).length;
    if (length === 2) {

      // Calculate the distance between the two pointers
      let top, bottom;
      let finger1 = newObj[Object.keys(newObj)[0]];
      let finger2 = newObj[Object.keys(newObj)[1]]
      if (finger1 > finger2) {
        top = finger2;
        bottom = finger1;
      } else {
        top = finger1;
        bottom = finger2;
      }
      // Color each pointer
      let freq1 = this.newFreqAlgorithm(1-this.state.topFreq/this.props.height);
      let freq2 = this.newFreqAlgorithm(1-this.state.bottomFreq/this.props.height);
      this.ctx.fillStyle = '#d6d1d5';
      this.ctx.fillRect(0, finger1, this.canvas.width, 20);
      this.ctx.fillRect(0, finger2, this.canvas.width, 20);

      this.ctx.fillStyle = 'white';
      this.ctx.fillText(Math.round(freq1) + ' Hz', 100, finger1+2);
      this.ctx.fillText(Math.round(freq2) + ' Hz', 100, finger2+2);



      let curDiff = Math.abs(top - bottom);

      if (this.state.prevDiff > 0) {
      //     if (curDiff > this.state.prevDiff) {
      //       let A0 = this.state.zoomMin;
      //       let yPercent1 = 1 - this.state.topFreq / this.props.height;
      //       let yPercent2 = 1 - this.state.bottomFreq / this.props.height;
      //       let freq1 = this.newFreqAlgorithm(yPercent1)
      //       let freq2 = this.newFreqAlgorithm(yPercent2)
      //       let newYPercent1 = 1 - top/this.props.height;
      //       let newYPercent2 = 1 - bottom/this.props.height;
      //
      //       if (newYPercent1 > 1) newYPercent1 = 1;
      //       if (newYPercent2 > 1) newYPercent2 = 1;
      //       if (newYPercent1 < 0) newYPercent1 = 0;
      //       if (newYPercent2 < 0) newYPercent2 = 0;
      //       // console.log("ZOOM IN");
      //        // Zoom In. Top finger sets the top, bottom sets the bottom
      //
      //        let newMax = this.calculateNewMax(freq1, A0, newYPercent1);
      //        let newMin = this.calculateNewMin(freq2, A0, newYPercent2);
      //        this.props.handleZoom(newMax, newMin);
      //
      //     }
      // if (curDiff < this.state.prevDiff) {
          // Zoom Out
          // console.log("ZZOM OUT");
          let A0 = this.state.zoomMin;
          let yPercent1 = 1 - this.state.topFreq / this.props.height;
          let yPercent2 = 1 - this.state.bottomFreq / this.props.height;
          let freq1 = this.newFreqAlgorithm(yPercent1)
          let freq2 = this.newFreqAlgorithm(yPercent2)
          let newYPercent1 = 1 - top/this.props.height;
          let newYPercent2 = 1 - bottom/this.props.height;

          if (newYPercent1 > 1) newYPercent1 = 1;
          if (newYPercent2 > 1) newYPercent2 = 1;
          if (newYPercent1 < 0) newYPercent1 = 0;
          if (newYPercent2 < 0) newYPercent2 = 0;
          let newMax = this.calculateNewMax(freq1, A0, newYPercent1);
          let newMin = this.calculateNewMin(freq2, A0, newYPercent2);
          if (newMax > 20000) newMax = 20000;
          if (newMin < 1) newMin = 1;
          this.props.handleZoom(newMax, newMin);

        // }
      }
      this.setState({prevDiff: curDiff})
    }

  }

  onPointerUp(e) {
    this.remove_event(e);
    let length = Object.keys(this.state.evCache).length;
    let {height, width} = this.props;
    this.ctx.clearRect(0, 0, width, height);
    if (length < 2) {
      this.setState({prevDiff: -1, zoomMax: this.props.resolutionMax, zoomMin: this.props.resolutionMin});
    }
  }
  onPointerOut(e) {
    let {height, width} = this.props;
      this.ctx.clearRect(0, 0, width, height);

      this.setState({prevDiff: -1, zoomMax: this.props.resolutionMax, zoomMin: this.props.resolutionMin, evCache: {} });
  }

  remove_event(e) {
    // Remove this event from the target's cache
    let newObj = this.state.evCache;
    let key = e.pointerId;
    delete newObj[key];
    this.setState({evCache: newObj});

  }

  calculateNewMax(y, A0, newYPercent){
    // A1 == A0
      let B1 = Math.log(y/A0)/newYPercent;
      let newMax = Math.pow(Math.E, B1)*A0;
      return newMax;
  }

  calculateNewMin(y, A0, newYPercent){
    // A1e^b1 = A0e^b0
      let logResolution = Math.log(this.state.zoomMax / this.state.zoomMin); //b0
      let intermediate = Math.log(y/A0)-logResolution;
      let B1 = intermediate/(newYPercent - 1)
      let newMin = this.state.zoomMax/Math.pow(Math.E, B1);
      return newMin;
  }


  newFreqAlgorithm(index) {
    let logResolution = Math.log(this.state.zoomMax / this.state.zoomMin);
    let freq = this.state.zoomMin * Math.pow(Math.E, index * logResolution);
    return Math.round(freq);
  }

  handleResize = () => {
    this.props.handleResize();

  }

  render() {
    return (
      <div className="scale-container">
        {/*<div className="zoom-text">
          Zoom
        </div>*/}
        <canvas className="scale-canvas"
        onPointerDown={this.onPointerDown}
        onPointerMove={this.onPointerMove}
        onPointerUp={this.onPointerUp}
        onPointerOut={this.onPointerOut}
        height={this.props.height} ref={(c) => {
          this.canvas = c;
        }}/>
      </div>
    );
  }
}
export default Scales;
