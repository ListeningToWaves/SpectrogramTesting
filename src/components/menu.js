import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import "../styles/menu.css";
import Tuning from './tuning-controls.js';
import Sound from './sound-controls.js';
import Slider from 'react-rangeslider';

// To include the default styles
import 'react-rangeslider/lib/index.css';

// Main Menu Class that renders children as individual tab panes
class MyMenu extends Component {
  state = {
    activeItem: null,
    pane: null,
    value: 50
  }
  // Function that switches between Menu Panes (children components)
  handleItemClick = (e, {name}) => {
    let pane = null;
    switch (name) {
      case "tuning":
        if (name !== this.state.activeItem) {
          pane = <Tuning/>
        } else {
          name = null;
        }
        break;
      case "sound":
        if (name !== this.state.activeItem) {
          pane = <Sound/>
        } else {
          name = null;
        }
        break;
      case "advanced":
        if (name !== this.state.activeItem) {
          pane = <Tuning/>
        } else {
          name = null;
        }
        break;
      default:
        pane = null;

    }
    this.setState({activeItem: name, pane: pane});
  }
  // Function that switches to the signal generator on click
  switchToSignalGenerator = () => {
    console.log("SWITCH");
  }
  // Function that handles the change of the Microphone gain
  handleGainChange = gain => {
    if (this.props.isStarted) {
      this.setState({value: gain});
      this.props.handleGainChange(gain);
    }
  }

  // Function that handles the push of the reset button
  // (resets all params except isStarted)
  handleReset = () => {
    this.setState({value: 50});
    this.props.reset();
  }

  // Renders the top Menu Bar with tabs, microphone gain, and the two menu buttons
  // as well as the graph scale and which tab to render
  render() {
    const {activeItem} = this.state;

    return (
      <div className="menu-container">
        <Menu color="violet" tabular pointing className="menu-menu" attached="bottom">
          <Menu.Item>
            <button className="function-switch-button" onClick={this.switchToSignalGenerator}>Signal Generator</button>
          </Menu.Item>
          <Menu.Item name='tuning' active={activeItem === 'tuning'} onClick={this.handleItemClick} className="tab-item"/>
          <Menu.Item name='sound' active={activeItem === 'sound'} onClick={this.handleItemClick} className="tab-item"/>
          <Menu.Item name='advanced' active={activeItem === 'advanced'} onClick={this.handleItemClick} className="tab-item"/>
          <Menu.Item position="right">
            Microphone Gain&nbsp;&nbsp;
            <div className="gain-container">
              <Slider
              min={1}
              max={100}
              value={this.state.value}
              onChange={this.handleGainChange}
              tooltip={false}
              className="gain-slider"/>
              {this.state.value}
            </div>
            <Menu.Item position="right">
              <button onClick={this.handleReset} className="reset-button">Reset</button>
            </Menu.Item>
          </Menu.Item>
          <Menu.Header className="menu-title" active="false">Spectrogram</Menu.Header>
        </Menu>
        {this.state.pane}
        <div className="color-map-container">
          Graph Scale
          <div className="color-map"></div>
          <div className="color-map-labels">
            Soft<span>Loud</span>
          </div>
        </div>
      </div>

    );
  }
}

export default MyMenu;
