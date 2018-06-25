import React, {Component} from 'react';
import {MyContext} from './my-provider';

import {Segment, Menu, Dropdown, Checkbox} from 'semantic-ui-react';
import "../styles/sound.css";
// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider';
// To include the default styles
import 'react-rangeslider/lib/index.css';
import {timbreOptions, scaleOptions, keyOptions, accidentalOptions} from '../util/dropdownOptions.js';
import { Button, Icon } from 'semantic-ui-react';
// Sound Controls Class that renders all of the sound controls and uses the
// React Context API to hook up their functionality to the main state in app.js
// Which passes the controls down to Spectrogram
class Sound extends Component {

  render() {
    return (
      <MyContext.Consumer>
        {(context) => (
          <React.Fragment>
            <Segment className="menu-pane-container">
              <Menu className="menu-pane">
                {/** Sound Toggle **/}
              {/**  <Menu.Item className="vert">
                  <div className="menu-header">Sound</div>
                  <br></br>
                  <Checkbox
                  toggle
                  checked={context.state.soundOn}
                  onChange={context.handleSoundToggle}
                  disabled={!context.state.isStarted}
                  className="extra-margin"/>
                  <div>
                    {context.state.soundOn
                      ? 'On!'
                      : "Off"}
                  </div>
                </Menu.Item>
              */}
              {/*Microphone Gain*/}
              {/*<Menu.Item className="vert">
                <div className="menu-header">Microphone Gain</div>
                <br></br>
                  <Slider
                  min={1}
                  max={100}
                  value={context.state.microphoneGain}
                  onChange={context.handleGainChange}
                  tooltip={false}
                  className="gain-slider"/>
                  <div>
                  {context.state.microphoneGain}
                </div>
                </Menu.Item>*/}
                {/** Output Volume **/}
                <Menu.Item className="vert">
                  <div className="menu-header">Output Volume</div>
                  <br></br>
                  <Slider
                  min={1}
                  max={100}
                  value={context.state.outputVolume}
                  onChange={context.handleOutputVolumeChange}
                  tooltip={context.state.isStarted}
                  className="slider"/>
                  <div>
                    {context.state.outputVolume}
                  </div>
                </Menu.Item>

                {/** Timbre **/}
                <Menu.Item>
                  <div>
                    <Dropdown text='Timbre'
                    fluid
                    options={timbreOptions}
                    onChange={context.handleTimbreChange}
                    disabled={!context.state.isStarted}/>
                    <br></br>
                    <div className="timbre-text">
                      {context.state.timbre}
                    </div>
                  </div>
                </Menu.Item>

                {/** ADSR **/}
                <Menu.Item className="vert">
                  <div className="menu-header">ADSR</div>
                  <br></br>
                  <div className="horiz">
                    <div className="adsr-slider">
                      Attack Time (s)
                      <Slider
                      min={0}
                      max={5}
                      step={0.1}
                      value={context.state.attack}
                      onChange={context.handleAttackChange}
                      tooltip={context.state.isStarted}
                      className="slider"/>
                      {context.state.attack}
                    </div>
                    <div>
                      Release Time (s)
                      <Slider
                      min={0}
                      max={5}
                      step={0.1}
                      value={context.state.release}
                      onChange={context.handleReleaseChange}
                      tooltip={context.state.isStarted}
                      className="slider"/>
                      {context.state.release}
                    </div>
                  </div>
                </Menu.Item>

                {/** Scale Menu **/}
                <Menu.Item className="vert">
                  <div className="menu-header">Scales</div>
                  <Menu.Menu className="horiz">
                    <Menu.Item className="vert no-line">
                      <div>Scale Mode</div>
                      <Checkbox
                      toggle
                      className="scales-checkbox"
                      checked={context.state.scaleOn}
                      onChange={context.handleScaleToggle}
                      disabled={!context.state.isStarted}/>
                    </Menu.Item>
                    <Menu.Item>
                      <Dropdown
                      fluid
                      text='Key'
                      options={keyOptions}
                      onChange={context.handleKeyChange}
                      disabled={!context.state.isStarted}
                      >
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Item>
                      <Dropdown
                      text='#/b'
                      compact
                      options={accidentalOptions}
                      onChange={context.handleAccidentalChange}
                      disabled={!context.state.isStarted}/>
                    </Menu.Item>
                    <Menu.Item>
                      <Dropdown
                      text='Scale'
                      compact
                      options={scaleOptions}
                      onChange={context.handleScaleChange}
                      disabled={!context.state.isStarted}/>
                    </Menu.Item>
                  </Menu.Menu>
                  {context.state.musicKey.name}{context.state.accidental.name}{context.state.scale.name}
                </Menu.Item>
                <Menu.Item className="vert">
                <div className="menu-header effects-tab">Effects</div>
                </Menu.Item>
              </Menu>
              <Button icon onClick={this.props.closeMenu} className="close-menu">
              <Icon fitted name="angle double up" size="large"/>
              </Button>
            </Segment>
          </React.Fragment>
        )}
      </MyContext.Consumer>
    );
  }
}

export default Sound;
