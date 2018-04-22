import React, { Component } from 'react';
import './App.css';
import Spectrogram from './components/spectrogram';
import Menu from './components/menu';
class App extends Component {
  constructor(props){
    super();
    this.state = {
      soundOn: true,
      value: 50,
      timbre: 'sine',
      scaleOn: false,
      musicKey: 0,
      accidental: 0,
      scale: 0
    }
  }

  handleSoundToggle = () => this.setState({soundOn: !this.state.soundOn});
  handleScaleToggle = () => this.setState({scaleOn: !this.state.scaleOn});
  handleOutputVolumeChange = value => this.setState({outputVolume:value});
  handleTimbreChange = value => this.setState({timbre: value});
  handleKeyChange = value => this.setState({musicKey: value});
  handleAccidentalChange = value => this.setState({accidental: value});
  handleScaleChange = value => this.setState({scale: value})

  render() {
    let {soundOn, scaleOn, outputVolume, timbre, musicKey, accidental, scale} = this.state;
    return (
      <div className="App">
      <Menu
      handleSoundToggle={this.handleSoundToggle}
      handleOutputVolumeChange={this.handleOutputVolumeChange}
      handleTimbreChange={this.handleTimbreChange}
      handleScaleToggle={this.handleScaleToggle}
      handleKeyChange={this.handleKeyChange}
      handleAccidentalChange={this.handleAccidentalChange}
      handleScaleChange={this.handleScaleChange}
      />
      <Spectrogram
      soundOn={soundOn}
      scaleOn={scaleOn}
      outputVolume={outputVolume}
      timbre={timbre}
      musicKey={musicKey}
      accidental={accidental}
      scale={scale}
      />


      <div id="about">
        {/*<h4 id="about-text">Based on the Spectrogram by {' '}
          <a href="https://github.com/borismus" target="_blank" rel="noopener noreferrer" >Boris Smus</a>
          <br></br>
          while he was working at Google
        </h4>*/}
        <a href="http://smus.com/spectrogram-and-oscillator/" target="_blank" rel="noopener noreferrer" >about</a>
      </div>


      </div>
    );
  }
}

export default App;
