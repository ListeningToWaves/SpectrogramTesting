import React, { Component } from 'react';
import { MyContext } from '../app.js';

import {
  Segment,
  Menu,
  Dropdown,
  Checkbox,
} from 'semantic-ui-react';
import "../styles/sound.css";
// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider';

// To include the default styles
import 'react-rangeslider/lib/index.css';
import {timbreOptions, scaleOptions, keyOptions, accidentalOptions} from '../util/common.js';

//Disable Controls if not started
class Sound extends Component {

  render() {
    return (
      <MyContext.Consumer>
      {(context) => (
      <React.Fragment>
      <Segment className="menu-pane">
        <Menu>
          {/** Sound Toggle **/}
          <Menu.Item className="vert">
            <div>Sound</div>
            <br></br>
            <Checkbox toggle checked={context.state.soundOn} onChange={context.handleSoundToggle} className="extra-margin"/>
            <div>
              {context.state.soundOn
                ? 'On!'
                : "Off"}
            </div>
          </Menu.Item>

          {/** Output Volume **/}
          <Menu.Item className="vert">
            <div>Output Volume</div>
            <br></br>
            <Slider min={1} max={100} value={context.state.outputVolume} onChange={context.handleOutputVolumeChange} className="slider"/>
            <div>
              {context.state.outputVolume}
            </div>
          </Menu.Item>

          {/** Timbre **/}
          <Menu.Item>
          <div>
            <Dropdown text='Timbre' fluid options={timbreOptions} onChange={context.handleTimbreChange}></Dropdown>
            <br></br>
            <div className="timbre-text">
            {context.state.timbre}
            </div>
            </div>
          </Menu.Item>

          {/** ADSR **/}
          <Menu.Item className="vert">
            <div>ADSR</div>
            <br></br>
            <div className="horiz">
              <div className="adsr-slider">
                Attack Time (s)
                <Slider min={0} max={5} step={0.1} value={context.state.attack} onChange={context.handleAttackChange} className="slider"/>
                {context.state.attack}
              </div>
              <div>
                Release Time (s)
                <Slider min={0} max={5} step={0.1} value={context.state.release} onChange={context.handleReleaseChange} className="slider"/>
                {context.state.release}
              </div>
            </div>
          </Menu.Item>

          {/** Scale Menu **/}
          <Menu.Item className="vert">
            Scales
            <Menu.Menu className="horiz">
              <Menu.Item className="vert no-line">
                <div>Scale Mode</div>
                <Checkbox toggle className="scales-checkbox" checked={context.state.scaleOn} onChange={context.handleScaleToggle}/>
              </Menu.Item>
              <Menu.Item>
                <Dropdown fluid text='Key' options={keyOptions} onChange={context.handleKeyChange}></Dropdown>
              </Menu.Item>
              <Menu.Item>
                <Dropdown text='#/b' compact options={accidentalOptions} onChange={context.handleAccidentalChange}></Dropdown>
              </Menu.Item>
              <Menu.Item>
                <Dropdown text='Scale' compact options={scaleOptions} onChange={context.handleScaleChange}></Dropdown>
              </Menu.Item>
            </Menu.Menu>
            {context.state.musicKey.name}{context.state.accidental.name}{context.state.scale.name}
          </Menu.Item>

        </Menu>
      </Segment>
      </React.Fragment>
      )}
      </MyContext.Consumer>
    );
  }
}

export default Sound;
