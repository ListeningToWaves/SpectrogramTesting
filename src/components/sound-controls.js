import React, {Component} from 'react';
import {MyContext} from './my-provider';

import {Segment, Menu, Dropdown, Checkbox} from 'semantic-ui-react';
import "../styles/sound.css";
// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider';
// To include the default styles
import 'react-rangeslider/lib/index.css';
import {timbreOptions, scaleOptions, keyOptions, accidentalOptions} from '../util/dropdownOptions';
import { Button, Icon } from 'semantic-ui-react';

 import { getMousePos } from '../util/conversions'
// Sound Controls Class that renders all of the sound controls and uses the
// React Context API to hook up their functionality to the main state in app.js
// Which passes the controls down to Spectrogram
class SoundControls extends Component {
  constructor(props) {
    super();
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerOut = this.onPointerOut.bind(this);

    this.state = {
      pointerDown: false
    };
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    // this.drawADSR();
  }

onPointerDown(e){
  this.setState({pointerDown: true});
  // console.log("DOWN");
}

onPointerMove(e){
  if(this.state.pointerDown){
    let pos = getMousePos(this.canvas, e);
    // console.log("MOVE");

  }
}
onPointerUp(e){
  this.setState({pointerDown: false});

}
onPointerOut(e){
  this.setState({pointerDown: false});

}

  drawADSR(){
    const attackShift = 0;
    const decayShift = 0;
    const sustainShift = 0;
    const releaseShift = 0;

    this.ctx.lineCap = 'butt';
    this.ctx.lineWidth=10;
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#4da2c6';

    // ADSR
    this.ctx.moveTo(5,100);
    this.ctx.lineTo(30+attackShift, 10);
    this.ctx.lineTo(80+decayShift, 50-sustainShift);
    this.ctx.lineTo(140, 50-sustainShift);
    this.ctx.lineTo(190+releaseShift, 95);
    this.ctx.stroke();
    this.ctx.closePath();

    // Points
    this.ctx.lineWidth=1;
    // Attack
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#F8635C';
    this.ctx.fillStyle = '#F8635C';
    this.ctx.arc(30+attackShift, 10, 8, 0, 2*Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();

    // Decay
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#6DEAA6';
    this.ctx.fillStyle = '#6DEAA6';
    this.ctx.arc(80+decayShift, 50-sustainShift, 8, 0, 2*Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();

    // Sustain
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#F2BB3C';
    this.ctx.fillStyle = '#F2BB3C';
    this.ctx.arc(140, 50-sustainShift, 8, 0, 2*Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();

    //Release
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#843DB7";
    this.ctx.fillStyle = '#843DB7';
    this.ctx.arc(190+releaseShift, 95, 8, 0, 2*Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
  }

  render() {
    return (
      <MyContext.Consumer>
        {(context) => (
          <React.Fragment>
            <Segment className="menu-pane-container">
              <Menu className="menu-pane">
                {/** Sound Toggle **/}
                <Menu.Item className="vert">
                  <div className="menu-header">Sound</div>
                  <div className="sound-toggle-container">
                  <Checkbox
                  toggle
                  checked={context.state.soundOn}
                  onChange={context.handleSoundToggle}
                  disabled={!context.state.isStarted}
                  />

                  </div>
                {/*</Menu.Item>*/}

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
                <br></br>
                {/** Output Volume **/}
                  <div className="menu-header">Output Volume</div>
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
                <Menu.Item className="vert">
                <div className="menu-header">Timbre</div>
                    <Dropdown
                    text={context.state.timbre}
                    fluid
                    options={timbreOptions}
                    onChange={context.handleTimbreChange}
                    disabled={!context.state.isStarted || context.state.tuningMode}
                    className="timbre-dropdown"/>
                    {/*<div className="timbre-text">
                      {context.state.timbre}
                    </div>*/}

                </Menu.Item>

                {/** ADSR **/}
                {/*<Menu.Item className="vert">
                  <div className="menu-header">ADSR</div>
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
                </Menu.Item>*/}
                {/* Experimental Canvas */}
                {/*<Menu.Item className="vert">
                <div className="menu-header">ADSR</div>
                <div className="adsr-container">
                <canvas
                width={220}
                height={110}
                onPointerDown={this.onPointerDown}
                onPointerMove={this.onPointerMove}
                onPointerUp={this.onPointerUp}
                onPointerOut={this.onPointerOut}
                ref={(c) => {this.canvas = c}}
                className="adsr-canvas">
                </canvas>
                </div>
                </Menu.Item>*/}

                {/** Scale Menu **/}
                <Menu.Item className="vert">
                  <div className="menu-header">Scales</div>
                  <Menu.Menu className="horiz">
                    <Menu.Item className="vert no-line no-bot-padding">
                      <div>Scale Mode</div>
                      <Checkbox
                      toggle
                      className="scales-checkbox"
                      checked={context.state.scaleOn}
                      onChange={context.handleScaleToggle}
                      disabled={!context.state.isStarted || context.state.tuningMode}/>
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
                  <div className="scales-bottom">
                  <div className="note-lines">
                    <div>Note Lines</div>
                    <Checkbox
                    toggle
                    className="scales-checkbox"
                    checked={context.state.noteLinesOn}
                    onChange={context.handleNoteLinesToggle}
                    disabled={!context.state.isStarted || context.state.tuningMode || !context.state.scaleOn}/>
                  </div>
                  <div>
                  {context.state.musicKey.name}{context.state.accidental.name}{context.state.scale.name}
                  </div>
                  </div>
                </Menu.Item>
                  {/* Effects */}
                {/*<Menu.Item className="vert">
                <div className="menu-header effects-tab">Effects</div>
                </Menu.Item>*/}

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

export default SoundControls;
