import React, { Component } from 'react';
import './App.css';
import Spectrogram from './components/spectrogram';

class App extends Component {
  render() {
    return (
      <div className="App">
      <Spectrogram/>
      

      <div id="about">
        <h4 id="about-text">Based on the Spectrogram by {' '}
          <a href="https://github.com/borismus" target="_blank" rel="noopener noreferrer" >Boris Smus</a>
          <br></br>
          while he was working at Google
        </h4>
        <a href="http://smus.com/spectrogram-and-oscillator/" target="_blank" rel="noopener noreferrer" >about</a>
      </div>


      </div>
    );
  }
}

export default App;
