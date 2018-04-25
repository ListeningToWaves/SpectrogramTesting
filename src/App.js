import React, { Component } from 'react';
import './App.css';
import Spectrogram from './components/spectrogram';
import Menu from './components/menu';

// React new Context API
// Create Context
export const MyContext = React.createContext();

// Then create provider component
let defaultState = {};
class MyProvider extends Component {
  //All Controls
  state = {
    soundOn: true,
    microphoneGain: 1,
    timbre: 'Sine',
    scaleOn: false,
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
    resolutionMax: 20000,
    resolutionMin: 20,
    isStarted: false,
  }
  // Save state for reset
  componentDidMount(){
    defaultState = this.state;
  }
  // Helper Function for Volume Conversion to log for outputVolume
  convertToLog(value){
    //solving y=Ae^bx
    const volumeMin = 1;
    const volumeMax = 100;
    const gainMin = 0.01;
    const gainMax = 100;
    let b = Math.log(gainMax / gainMin)/(volumeMax-volumeMin);
    let a = gainMax /  Math.pow(Math.E,  volumeMax* b);
    let gain = Math.round(a *Math.pow(Math.E, b*value)*100)/100;
    return gain;
  }
  //Functions that setState based on Controls
  render() {
    return (
      <MyContext.Provider value={{
        state: this.state,
        handleGainChange: value => {
          if(this.state.isStarted){
            let gain = this.convertToLog(value);
            this.setState({microphoneGain: gain});
          }
        },
        handleSoundToggle: () => this.setState({soundOn: !this.state.soundOn}),
        handleScaleToggle: () => this.setState({scaleOn: !this.state.scaleOn}),
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
          if(this.state.isStarted){
            this.setState({attack: Math.round(value*10)/10});
          }
        },
        handleReleaseChange: value => {
          if(this.state.isStarted){
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
        handleResize: () => this.setState({width: window.innerWidth, height: window.innerHeight}),
        start: ()=> this.setState({isStarted: true}),
        reset: ()=> this.setState({ ...defaultState, isStarted: this.state.isStarted})

      }}>
        {this.props.children}
      </MyContext.Provider>
    );
  };

}

// Main Class that Renders Menu and Spectrogram Components
class App extends Component {

  render() {
    return (
      <div className="App">
      <MyProvider>
      <MyContext.Consumer>
      {(context) => (
      <React.Fragment>
      <Menu
      reset={context.reset}
      handleGainChange={context.handleGainChange}
      gain={context.state.gain}
      isStarted={context.state.isStarted}/>
      <Spectrogram
      soundOn={context.state.soundOn}
      microphoneGain={context.state.microphoneGain}
      timbre={context.state.timbre}
      scaleOn={context.state.scaleOn}
      musicKey={context.state.musicKey}
      accidental={context.state.accidental}
      scale={context.state.scale}
      outputVolume={context.state.outputVolume}
      attack={context.state.attack}
      release={context.state.release}
      width={context.state.width}
      height={context.state.height}
      speed={context.state.speed}
      log={context.state.log}
      resolutionMax={context.state.resolutionMax}
      resolutionMin={context.state.resolutionMin}
      isStarted={context.state.isStarted}
      handleResize={context.handleResize}
      start={context.start}
      />
      </React.Fragment>
      )}
      </MyContext.Consumer>


      <p id="about">
        {/*<h4 id="about-text">Based on the Spectrogram by {' '}
          <a href="https://github.com/borismus" target="_blank" rel="noopener noreferrer" >Boris Smus</a>
          <br></br>
          while he was working at Google
        </h4>*/}
        <a href="http://smus.com/spectrogram-and-oscillator/" target="_blank" rel="noopener noreferrer" >about</a>
      </p>

      </MyProvider>
      </div>
    );
  }
}

export default App;
