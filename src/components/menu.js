import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import "../styles/menu.css";
import Tuning from './tuning-controls.js';
import Sound from './sound-controls.js';
import Slider from 'react-rangeslider';

// To include the default styles
import 'react-rangeslider/lib/index.css';

class MyMenu extends Component {
  state = {
    activeItem: null,
    pane: null,
    value: 50
  }
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

  switchToSignalGenerator = () => {
    console.log("SWITCH");
  }
  handleGainChange = gain => {
    if (this.props.isStarted) {
      this.setState({value: gain});
      this.props.handleGainChange(gain);
    }
  }
  handleReset = () => {
    this.setState({value: 50});
    this.props.reset();
  }

  render() {
    const color = "violet";
    const {activeItem} = this.state;

    return (
      <div className="menu-container">
        <Menu color={color} tabular pointing className="menu-menu" attached="bottom">
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
