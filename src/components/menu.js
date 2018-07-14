import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import "../styles/menu.css";
import GraphControls from './graph-controls';
import SoundControls from './sound-controls';
import AdvancedControls from './advanced-controls';
import Slider from 'react-rangeslider';

// To include the default styles
import 'react-rangeslider/lib/index.css';

// Main Menu Class that renders children as individual tab panes
class MyMenu extends Component {
  state = {
    activeItem: null,
    pane: null,
    value: 50,
    soundOn: false,
    tuningMode: false
  }
  // Function that switches between Menu Panes (children components)
  handleItemClick = (e, {name}) => {
    let pane = null;
    switch (name) {
      case "graph":
        if (name !== this.state.activeItem) {
          pane = <GraphControls closeMenu={this.closeMenu}/>
        } else {
          name = null;
        }
        break;
      case "sound-making":
        if (name !== this.state.activeItem) {
          pane = <SoundControls closeMenu={this.closeMenu}/>
        } else {
          name = null;
        }
        break;
      case "advanced":
        if (name !== this.state.activeItem) {
          pane = <AdvancedControls closeMenu={this.closeMenu}/>
        } else {
          name = null;
        }
        break;
      default:
        pane = null;

    }
    this.setState({activeItem: name, pane: pane});
  }

  closeMenu = () => this.setState({pane: null, activeItem: null});

  // componentWillReceiveProps(nextProps){
  //   //Check if CLicked on Spectrogram, close menu pane, then call parent function to
  //   // set as false. Without extra function, menu would close every time after 1st click
  //   if(nextProps.hidePanes){
  //     this.setState({
  //       pane: null,
  //       activeItem: null
  //     });
  //     this.props.handleHidePanesCompletion();
  //   }
  // }
  // Function that switches to the signal generator on click
  switchToSignalGenerator = () => {
    console.log("SWITCH");
    window.location = "https://listeningtowaves.github.io/OscilloscopeTesting/"
  }
  // Function that handles the change of the Microphone gain
  handleGainChange = gain => {
    if (this.props.isStarted) {
      this.setState({value: gain});
      this.props.handleGainChange(gain);
    }
  }
// Function that toggles the sound button between the on and off states
  handleSoundToggle = () =>{
    this.setState({soundOn: !this.state.soundOn});
    this.props.handleSoundToggle();
  }

  // Function that handles the push of the reset button
  // (resets all params except isStarted)
  handleReset = () => {
    this.setState({value: 50, soundOn: false, tuningMode: false});
    this.props.reset();
  }

  // Function that handle switch between modes
  handleTuningModeToggle = () =>{
    this.setState({tuningMode: !this.state.tuningMode});
    this.props.handleTuningModeToggle();
  }

  // Renders the top Menu Bar with tabs, microphone gain, and the two menu buttons
  // as well as the graph scale and which tab to render
  render() {
    const {activeItem} = this.state;
    let style={'backgroundColor': '' }
  if(this.state.tuningMode){
    style = {'backgroundColor': '#ff8177'}
  }
    return (
      <div className="menu-container">
        <Menu color="violet" tabular pointing className="menu-menu" attached="bottom">
          <Menu.Item>
            <button className="function-switch-button" onClick={this.switchToSignalGenerator}>Signal Generator</button>
          </Menu.Item>
          <Menu.Item name='graph' active={activeItem === 'graph'} onClick={this.handleItemClick} className="tab-item"/>
          <Menu.Item name='sound-making' active={activeItem === 'sound-making'} onClick={this.handleItemClick} className="tab-item"/>
          {/*<Menu.Item name='advanced' active={activeItem === 'advanced'} onClick={this.handleItemClick} className="tab-item"/>*/}
          <button onClick={this.handleTuningModeToggle} className="tuning-button" style={style}>Tuning Mode</button>

          <Menu.Item position="right">
            {/*<div>Expressive&nbsp;&nbsp;</div>
            <Checkbox
            slider
            checked={this.state.mode}
            onChange={this.handleModeSwitch}
            disabled={!this.props.isStarted}/>
            <div>&nbsp;&nbsp;Tuning</div>
            */}
          <Menu.Item position="right">


          {/*<Menu.Item position="right">*/}

            Microphone Gain&nbsp;&nbsp;
            <div className="gain-container">
              <Slider
              min={1}
              max={100}
              value={this.state.value}
              onChange={this.handleGainChange}
              tooltip={false}
              className="gain-slider"/>
            </div>


            <Menu.Item position="right">
              <button onClick={this.handleReset} className="reset-button">Reset</button>
              </Menu.Item>
            </Menu.Item>
          </Menu.Item>
          <Menu.Header className="menu-title" active="false">Spectrogram</Menu.Header>
        </Menu>
        {this.state.pane}

      </div>

    );
  }
}

export default MyMenu;
