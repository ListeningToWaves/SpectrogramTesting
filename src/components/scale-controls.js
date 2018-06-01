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
    //this.myObj = {};
    // this.ctx = this.canvas.getContext('2d');
    window.addEventListener("resize", this.handleResize);
    this.setState({zoomMax: this.props.resolutionMax, zoomMin: this.props.resolutionMin});
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }


onPointerDown(e){
  // console.log(this.state.evCache);
  // console.log("Down");

  let key = e.pointerId;
  let newObj = this.state.evCache;
  newObj[key] = e.clientY;
  //this.myObj[key] = e.clientY;
  this.setState({
    evCache: newObj
  });
}
  onPointerMove(e){

    // console.log("MOVE");
    // console.log(this.state.evCache.length);
    let newObj = this.state.evCache;

        let key = e.pointerId;

        newObj[key] = e.clientY;

        // console.log(newCache);



   // console.log(this.myObj);
   this.setState({ evCache: newObj });

   // If two pointers are down, check for pinch gestures
   let length = Object.keys(newObj).length;
if (length === 2) {

  // Calculate the distance between the two pointers
  let curDiff = Math.abs(newObj[Object.keys(newObj)[0]] - newObj[Object.keys(newObj)[1]]);

  if (this.state.prevDiff > 0) {
// console.log(curDiff);
      if(this.state.centerFreq > 0){
        if (curDiff > this.state.prevDiff) {
        console.log("PINCH");
        // The distance between the two pointers has increased
        console.log("Pinch moving OUT -> Zoom in", e);
        let ratio = curDiff/this.props.height;
        if(ratio > 1) ratio = 1;

        let upperChange = (this.state.zoomMax-this.state.centerFreq+1)*ratio;
        let lowerChange = (this.state.centerFreq-this.state.zoomMin-1)*ratio;
        let newUpper = this.state.zoomMax - upperChange;
        let newLower = this.state.zoomMin + lowerChange;
        this.props.handleZoom(newUpper, newLower);

        }
        if (curDiff < this.state.prevDiff) {
        // The distance between the two pointers has decreased
      console.log("Pinch moving IN -> Zoom out",e);
        let ratio = 1 - Math.abs(curDiff)/this.props.height;
        if(ratio > 1) ratio = 1;
        console.log(ratio);
        let upperChange = (20000-this.state.centerFreq+1)*ratio;
        let lowerChange = (this.state.centerFreq)*ratio;
        let newUpper = this.props.resolutionMax + upperChange;
        let newLower = this.props.resolutionMin - lowerChange;
        if(newUpper > 20000) newUpper = 20000;
        if(newLower < 1) newLower = 1;
        console.log(newUpper);
        console.log(newLower);
        this.props.handleZoom(newUpper, newLower);
        }
      } else {
        let avg = (newObj[Object.keys(newObj)[0]] + newObj[Object.keys(newObj)[1]])/2;
        let yPercent = 1 - avg / this.props.height;
        let centerFreq = this.newFreqAlgorithm(yPercent);
        // console.log("AVGL :"+avg);
        //let centerFreq = this.indexToFreq(avg);
        //console.log("CENTERFREQ: "+centerFreq);
        this.setState({centerFreq:centerFreq });
      }


  // Cache the distance for the next move event
    }
  this.setState({prevDiff: curDiff});
  }
}

  onPointerUp(e){
    this.remove_event(e);
    let length = Object.keys(this.state.evCache).length;

    if (length < 2){
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
      <div className="scale-container"
      onPointerDown={this.onPointerDown}
      onPointerMove={this.onPointerMove}
      onPointerUp={this.onPointerUp}>
      </div>

    );
  }
}
export default Scales;
