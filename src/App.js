import React, { Component } from 'react';
import './App.css';
import Spectrogram from './components/spectrogram';

class App extends Component {
  render() {
    return (
      <div className="App">
      <div id="instructions">
        <h2>Spectrogram & Oscillator</h2>
        <ol>
        <li>^ Allow use of your microphone ^</li>
        <li>Click or tap anywhere canvas to generate a tone</li>
      </ol>
      </div>

      <div id="about">
        <h4 id="about-text">Based on the Spectrogram by {' '}
          <a href="https://github.com/borismus" target="_blank">Boris Smus</a>
          <br></br>
          while he was working at Google
        </h4>
        <a href="http://smus.com/spectrogram-and-oscillator/" target="_blank">about</a>
      </div>

      <Spectrogram />

      </div>
    );
  }
}

export default App;
