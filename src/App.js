import React, { Component } from 'react';
import './App.css';
import Spectrogram from './components/spectrogram';
import Menu from './components/menu';
class App extends Component {
  constructor(props){
    super();
    this.state = {
      soundOn: true,
    }
  }

  handleSoundToggle = () => {
    this.setState({
      soundOn: !this.state.soundOn
    });

  }
  render() {
    let {soundOn} = this.state;
    return (
      <div className="App">
      <Menu handleSoundToggle={this.handleSoundToggle}/>
      <Spectrogram soundOn={soundOn}/>


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
