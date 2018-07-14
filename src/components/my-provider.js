import React, { Component } from 'react';
import {convertToLog, convertToLinear} from "../util/conversions";
// React new Context API
// Create Context
export const MyContext = React.createContext();

// Then create provider component
let defaultState = {};
class MyProvider extends Component {
  //All Controls
  state = {
    soundOn: false,
    microphoneGain: 50,
    timbre: 'Sine',
    scaleOn: false,
    noteLinesOn: false,
    musicKey: {name: 'C', value: 0 },
    accidental: {name: ' ', value: 0},
    scale: {name: 'Major', value: 0},
    outputVolume: 50,
    attack: 0.005,
    release: 1,
    width: window.innerWidth,
    height: window.innerHeight,
    speed: 2,
    log: true,
    resolutionMax: 20000,//Real Max
    resolutionMin: 20, // Real Min
    limitMax: 100, // Range slider max
    limitMin: 29, // Range slider Min
    min: 20, // Temp Min for Input
    max: 20000, // Temp Max for Input
    tuningMode: false,// Mode Switcher
    graphPreset: 'default',
    headphoneMode: false,
    //hidePanes: false,
    isStarted: false,
  }


  // Save state for reset
  componentDidMount(){
    defaultState = this.state;
  }

  //Functions that setState based on Controls
  render() {
    return (
      <MyContext.Provider value={{
        state: this.state,
        handleGainChange: value => {
          if(this.state.isStarted){
            this.setState({microphoneGain: value});
          }
        },
        handleSoundToggle: () => this.setState({soundOn: !this.state.soundOn}),
        handleScaleToggle: () => this.setState({scaleOn: !this.state.scaleOn}),
        handleNoteLinesToggle: () => this.setState({noteLinesOn: !this.state.noteLinesOn}),
        handleOutputVolumeChange: value => {
          if(this.state.isStarted){
            this.setState({outputVolume:value});
          }
        },
        handleTimbreChange: (e, data) => {
          let newTimbre = data.options[data.value].text;
          this.setState({timbre: newTimbre});
        },
        handleAttackChange: value => {
          if(this.state.isStarted && !this.state.tuningMode){
            this.setState({attack: Math.round(value*10)/10});
          }
        },
        handleReleaseChange: value => {
          if(this.state.isStarted && !this.state.tuningMode){
            this.setState({release: Math.round(value*10)/10});
          }
        },
        handleKeyChange: (e, data) => {
          let newKeyName = data.options[data.value].text;
          let newKeyValue = data.options[data.value].index;
          this.setState({musicKey: {name: newKeyName, value: newKeyValue}});
        },
        handleAccidentalChange: (e, data) => {
          let newAccidentalName = data.options[data.value].text;
          let newAccidentalValue = data.value;
          this.setState({accidental: {name: newAccidentalName, value: newAccidentalValue}});
        },
        handleScaleChange: (e, data) => {
          let newScaleName = data.options[data.value].text;
          let newScaleValue = data.value;
          this.setState({scale: {name: newScaleName, value: newScaleValue}});
        },
        handleTuningModeToggle: () => {
          if(this.state.tuningMode){
            this.setState({
              tuningMode: false,
              noteLinesOn: false

            });
          } else {
            this.setState({
              tuningMode: true,
              noteLinesOn: true
            });
          };

        },
        handleRangeChange: value => {
          if(value.length){
            let newMin = Math.round(convertToLog(value[0], 1,100, 1, 20000));
            let newMax = Math.round(convertToLog(value[1], 1,100, 1, 20000));
            this.setState({
              min: newMin,
              max: newMax,
              limitMin: value[0],
              limitMax: value[1],
              resolutionMin: newMin,
              resolutionMax: newMax
            });
          }
        },

        handleMinChange: (e, data) => this.setState({min: data.value}),
        handleMaxChange: (e, data) => this.setState({max: data.value}),
        handleInputChange: (e) => {
          // This Handle graph scaling through the input boxes and validation of data.
          if(e.key === "Enter"){
            let lowerValue = Number(this.state.min);
            let upperValue = Number(this.state.max);
            if(isNaN(lowerValue) || lowerValue > this.state.resolutionMax || lowerValue > 20000) {
              lowerValue = this.state.resolutionMin;
            }
            if(isNaN(upperValue) || upperValue < this.state.resolutionMin || upperValue < 0) {
              upperValue = this.state.resolutionMax;
            }
            if(lowerValue < 1) lowerValue = 1;
            if(upperValue > 20000) upperValue = 20000;
            let newMin = Math.round(convertToLinear(lowerValue, 1, 100, 1, 20000));
            // console.log(newMin);
            let newMax = Math.round(convertToLinear(upperValue, 1,100, 1, 20000));
            lowerValue = Math.round(lowerValue);
            upperValue = Math.round(upperValue);
            this.setState({min: lowerValue, max: upperValue, resolutionMin: lowerValue, resolutionMax: upperValue, limitMin: newMin, limitMax: newMax });

          }
        },
        handleGraphPresetChange: (e, data) => {
            let lowerValue = 20;
            let upperValue = 20000;
          switch (data.value) {
            case 'bass':
              lowerValue = 80;
              upperValue = 800;
              break;
            case 'tenor':
              lowerValue = 120;
              upperValue = 1200;
              break;
            case 'alto':
              lowerValue = 175;
              upperValue = 1500;
              break;
            case 'soprano':
              lowerValue = 300;
              upperValue = 3000;
              break;
            case 'orchestra':
              lowerValue = 80;
              upperValue = 4000;
              break;
            default:
                lowerValue = 20;
                upperValue = 20000;
          }


          let newMin = Math.round(convertToLinear(lowerValue, 1, 100, 1, 20000));
          let newMax = Math.round(convertToLinear(upperValue, 1,100, 1, 20000));
          this.setState({resolutionMin: lowerValue, resolutionMax: upperValue, min: lowerValue, max: upperValue, limitMin: newMin, limitMax: newMax, graphPreset: data.value});
        },
        //menuClose: () => this.setState({hidePanes: true}),
        handleHidePanesCompletion: ()=> this.setState({hidePanes: false}),
        handleResize: () => this.setState({width: window.innerWidth, height: window.innerHeight}),
        handleZoom: (upper, lower) => {
          let upperValue = Number(upper);
          let lowerValue = Number(lower);
          if(isNaN(lowerValue) || lowerValue > this.state.resolutionMax || lowerValue > 20000) {
            lowerValue = this.state.resolutionMin;
          }
          if(isNaN(upperValue) || upperValue < this.state.resolutionMin || upperValue < 1) {
            upperValue = this.state.resolutionMax;
          }
          let newMax = Math.round(convertToLinear(upperValue, 1,100, 1, 20000));
          let newMin = Math.round(convertToLinear(lowerValue, 1, 100, 1, 20000));
          lowerValue = Math.round(lowerValue);
          upperValue = Math.round(upperValue);
          this.setState({min: lowerValue, max: upperValue, resolutionMin: lowerValue, resolutionMax: upperValue, limitMin: newMin, limitMax: newMax });
        },
        handlePause: () => {
          if(this.state.speed !== 0){
            this.setState({prevSpeed: this.state.speed, speed: 0});
          } else {
            this.setState({speed: this.state.prevSpeed});
          }
        },
        handleHeadphoneModeToggle: () =>{
          if(this.state.headphoneMode){

          } else {
          }
          this.setState({headphoneMode: !this.state.headphoneMode});
        },
        start: ()=> this.setState({isStarted: true}),
        reset: ()=> this.setState({ ...defaultState, isStarted: this.state.isStarted})

      }}>
        {this.props.children}
      </MyContext.Provider>
    );
  };


}
export default MyProvider;
