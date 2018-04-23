import React, {Component} from 'react';
import {Button, Menu} from 'semantic-ui-react';
import "../styles/menu.css";
import Tuning from './tuning-controls.js';
import Sound from './sound-controls.js';
import Slider from 'react-rangeslider';

// To include the default styles
import 'react-rangeslider/lib/index.css';

class MyMenu extends Component {
    state = { activeItem: null, pane: null, value: 50 }
    handleItemClick = (e, { name }) => {
      let pane = null;
      switch (name) {
        case "tuning":
            if(name !== this.state.activeItem){
              pane = <Tuning />
            } else {
              name = null;
            }
          break;
        case "sound":
            if(name !== this.state.activeItem){
              pane = <Sound/>
            } else {
              name = null;
            }
          break;
        case "advanced":
            if(name !== this.state.activeItem){
              pane = <Tuning />
            } else {
              name = null;
            }
          break;
        default:
          pane = null;

      }
      this.setState({ activeItem: name, pane: pane });
    }

    switchToSignalGenerator = () =>{
      console.log("SWITCH");
    }

handleGainChange = (value) =>{
  this.setState({
    value: value
  });
}

  render() {
    const color = "violet";
    const { activeItem } = this.state;



    return (
      <div className="menu-container">
        <Menu color={color} tabular pointing className="menu-menu" attached="bottom">
          <Menu.Item><Button className="menu-button" inverted color='violet' onClick={this.switchToSignalGenerator}>Signal Generator</Button></Menu.Item>
          <Menu.Item name='tuning' active={activeItem === 'tuning'} onClick={this.handleItemClick} className="tab-item"></Menu.Item>
          <Menu.Item name='sound' active={activeItem === 'sound'} onClick={this.handleItemClick} className="tab-item"/>
          <Menu.Item name='advanced' active={activeItem === 'advanced'} onClick={this.handleItemClick} className="tab-item"/>
          <Menu.Item position="right">
          Microphone Gain&nbsp;&nbsp;
          <div className="gain-container">
            <Slider
                    min={0}
                    max={100}
                    value={this.state.value}
                    onChange={this.handleGainChange}
                    tooltip={false}
                    className="gain-slider"
            /> {this.state.value}
            </div>
            <Menu.Item position="right"><Button inverted color="red">Reset</Button></Menu.Item>
            </Menu.Item>
          <Menu.Header className="menu-title" active="false" >Spectrogram</Menu.Header>
        </Menu>
        {this.state.pane}
        <div className="color-map-container">
        Graph Scale
        <div className="color-map">
        </div>
        <div className="color-map-labels">
        Soft<span>Loud</span>
      </div>
      </div>
      </div>


    );
  }
}

export default MyMenu;
