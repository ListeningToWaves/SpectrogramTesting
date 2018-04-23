import React, { Component } from 'react';
import './App.css';
import Spectrogram from './components/spectrogram';
import Menu from './components/menu';

// React new Context API
// Create Context
export const MyContext = React.createContext();

// Then create provider component

class MyProvider extends Component {
  state = {
    soundOn: true,
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
  render() {
    return (
      <MyContext.Provider value={{
        state: this.state,
        handleSoundToggle: () => this.setState({soundOn: !this.state.soundOn}),
        handleScaleToggle: () => this.setState({scaleOn: !this.state.scaleOn}),
        handleOutputVolumeChange: value => this.setState({outputVolume:value}),
        handleTimbreChange: (e, data) => {
          let newTimbre = data.options[data.value].text;
          this.setState({timbre: newTimbre});
        },
        handleAttackChange: value => this.setState({attack: Math.round(value*10)/10}),
        handleReleaseChange: value => this.setState({release: Math.round(value*10)/10}),
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

      }}>
        {this.props.children}
      </MyContext.Provider>
    );
  };

}

class App extends Component {


  render() {
    return (
      <div className="App">
      <MyProvider>
      <Menu/>
      <MyContext.Consumer>
      {(context) => (
      <Spectrogram
      soundOn={context.state.soundOn}
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
      start={context.start}
      />
      )}
      </MyContext.Consumer>


      <div id="about">
        {/*<h4 id="about-text">Based on the Spectrogram by {' '}
          <a href="https://github.com/borismus" target="_blank" rel="noopener noreferrer" >Boris Smus</a>
          <br></br>
          while he was working at Google
        </h4>*/}
        <a href="http://smus.com/spectrogram-and-oscillator/" target="_blank" rel="noopener noreferrer" >about</a>
      </div>

      </MyProvider>
      </div>
    );
  }
}

export default App;
