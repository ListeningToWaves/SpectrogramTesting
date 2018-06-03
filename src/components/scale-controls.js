import React, {Component} from 'react';
import "../styles/scale-controls.css";

class Scales extends Component {
  constructor(props) {
    super();
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.state = {
      evCache: {},
      prevDiff: -1,
      zoomMax: 0,
      zoomMin: 0
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
    this.setState({evCache: newObj});
  }

  onPointerMove(e) {
    let {height, width} = this.props;
    this.ctx.clearRect(0, 0, width, height);
    let newObj = this.state.evCache;
    let key = e.pointerId;
    let pos = this.getMousePos(this.canvas, e);
    newObj[key] = pos.y;
    for (key in newObj) {
      this.ctx.fillRect(0, newObj[key], this.canvas.width, 20);
    }
    this.setState({evCache: newObj});
    // If two pointers are down, check for pinch gestures
    let length = Object.keys(newObj).length;
    if (length === 2) {
      // Calculate the distance between the two pointers
      let curDiff = Math.abs(newObj[Object.keys(newObj)[0]] - newObj[Object.keys(newObj)[1]]);

      if (this.state.prevDiff > 0) {
        if (this.state.centerFreq > 0) {
          if (curDiff > this.state.prevDiff) {
            // The distance between the two pointers has increased
            console.log("Pinch moving OUT -> Zoom in", e);
            let ratio = curDiff / this.props.height;
            if (ratio > 1) 
              ratio = 1;
            
            let upperChange = (this.state.zoomMax - this.state.centerFreq) * ratio;
            let lowerChange = (this.state.centerFreq - this.state.zoomMin) * ratio;
            let newUpper = this.state.zoomMax - upperChange;
            let newLower = this.state.zoomMin + lowerChange;
            this.props.handleZoom(newUpper, newLower);
          }
          if (curDiff < this.state.prevDiff) {
            // The distance between the two pointers has decreased
            console.log("Pinch moving IN -> Zoom out", e);
            let ratio = 1 - curDiff / this.props.height;
            //if(ratio > 1) ratio = 1;
            let upperChange = (20000 - this.state.zoomMax) * ratio;
            let lowerChange = (this.state.zoomMin + 1) * ratio;
            let newUpper = this.props.resolutionMax + upperChange;
            let newLower = this.props.resolutionMin - lowerChange;
            if (newUpper > 20000) 
              newUpper = 20000;
            if (newLower < 1) 
              newLower = 1;
            this.props.handleZoom(newUpper, newLower);
          }
        } else {
          let avg = (newObj[Object.keys(newObj)[0]] + newObj[Object.keys(newObj)[1]]) / 2;
          let yPercent = 1 - avg / this.props.height;
          let centerFreq = this.newFreqAlgorithm(yPercent);
          this.setState({centerFreq: centerFreq});
        }

        // Cache the distance for the next move event
      }
      this.setState({prevDiff: curDiff});
    }
  }

  onPointerUp(e) {
    this.remove_event(e);
    let length = Object.keys(this.state.evCache).length;
    let {height, width} = this.props;
    this.ctx.clearRect(0, 0, width, height);
    if (length < 2) {
      this.setState({prevDiff: -1, centerFreq: -1, zoomMax: this.props.resolutionMax, zoomMin: this.props.resolutionMin});
    }
    // this.setState({centerFreq: -1});
  }

  remove_event(e) {
    // Remove this event from the target's cache
    let newObj = this.state.evCache;
    let key = e.pointerId;
    delete newObj[key];
    this.setState({evCache: newObj});

  }

  newFreqAlgorithm(index) {
    let logResolution = Math.log(this.props.resolutionMax / this.props.resolutionMin);
    let freq = this.props.resolutionMin * Math.pow(Math.E, index * logResolution);
    return Math.round(freq);
  }

  handleResize = () => {
    this.props.handleResize();

  }

  render() {
    return (
      <div className="scale-container">
        <div className="zoom-text">
          Zoom
        </div>
        <canvas className="scale-canvas" onPointerDown={this.onPointerDown} onPointerMove={this.onPointerMove} onPointerUp={this.onPointerUp} height={this.props.height} ref={(c) => {
          this.canvas = c;
        }}/>
      </div>
    );
  }
}
export default Scales;
