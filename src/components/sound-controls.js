import React, {Component} from 'react';
import {
  Button,
  Segment,
  Menu,
  Dropdown,
  Checkbox,
  Label
} from 'semantic-ui-react';
import "../styles/sound.css";
// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider';

// To include the default styles
import 'react-rangeslider/lib/index.css';
import {timbreOptions, scaleOptions, keyOptions, accidentalOptions} from '../util/common.js';

class Sound extends Component {
  constructor(props) {
    super(props)
    this.state = {
      outputVolume: 50,
      value: 40,
      soundOn: true,
      musicKey: 'C',
      accidental: ' ',
      scale: 'Major',
      timbre: 'Sine',
      scaleOn: false

    }
  }

  handleOutputVolumeChange = value  =>  {
    this.setState({outputVolume: value});
    this.props.handleOutputVolumeChange(value);
  }

  handleSoundToggle = () => {
    this.setState({soundOn: !this.state.soundOn});
    this.props.handleSoundToggle();
  }
  handleScaleToggle = () =>{
    this.setState({scaleOn: !this.state.scaleOn});
      this.props.handleScaleToggle();
      console.log(this.state.scaleOn);
  }
  handleTimbreChange = (e, data) => {
    let newTimbre = data.options[data.value].text;
    this.setState({timbre: newTimbre});
    this.props.handleTimbreChange(data.value);
  }
  handleKeyChange = (e,data) =>{
    let newKey = data.options[data.value].text;
    this.setState({musicKey: newKey});
    this.props.handleKeyChange(data.options[data.value].index);
  }
  handleAccidentalChange = (e,data) =>{
    let newAccidental = data.options[data.value].text;
    this.setState({accidental: newAccidental});
    this.props.handleAccidentalChange(data.value);
  }
  handleScaleChange = (e,data) =>{
    let newScale = data.options[data.value].text;
    this.setState({scale: newScale});
      this.props.handleScaleChange(data.value);
  }


  render() {
    const {outputVolume, soundOn, value} = this.state

    return (
      <Segment className="menu-pane">
        <Menu>
          {/** Sound Toggle **/}
          <Menu.Item className="vert">
            <div>Sound</div>
            <br></br>
            <Checkbox toggle checked={this.state.soundOn} onChange={this.handleSoundToggle} className="extra-margin"/>
            <div>
              {soundOn
                ? 'On!'
                : "Off"}
            </div>
          </Menu.Item>

          {/** Output Volume **/}
          <Menu.Item className="vert">
            <div>Output Volume</div>
            <br></br>
            <Slider min={1} max={100} value={outputVolume} onChange={this.handleOutputVolumeChange} className="slider"/>
            <div>
              {outputVolume}
            </div>
          </Menu.Item>

          {/** Timbre **/}
          <Menu.Item>
          <div>
            <Dropdown text='Timbre' fluid options={timbreOptions} onChange={this.handleTimbreChange}></Dropdown>
            <br></br>
            <div className="timbre-text">
            {this.state.timbre}
            </div>
            </div>
          </Menu.Item>

          {/** ADSR **/}
          <Menu.Item className="vert">
            <div>ADSR</div>
            <br></br>
            <div className="horiz">
              <div className="adsr-slider">
                Attack
                <Slider min={0} max={100} value={value} onChange={this.handleChange} className="slider"/> {value}
              </div>
              <div>
                Release
                <Slider min={0} max={100} value={value} onChange={this.handleChange} className="slider"/> {value}
              </div>
            </div>
          </Menu.Item>

          {/** Scale Menu **/}
          <Menu.Item className="vert">
            Scales
            <Menu.Menu className="horiz">
              <Menu.Item className="vert no-line">
                <div>Scale Mode</div>
                <Checkbox toggle className="scales-checkbox" checked={this.state.scaleOn} onChange={this.handleScaleToggle}/>
              </Menu.Item>
              <Menu.Item>
                <Dropdown fluid text='Key' options={keyOptions} onChange={this.handleKeyChange}></Dropdown>
              </Menu.Item>
              <Menu.Item>
                <Dropdown text='#/b' compact options={accidentalOptions} onChange={this.handleAccidentalChange}></Dropdown>
              </Menu.Item>
              <Menu.Item>
                <Dropdown text='Scale' compact options={scaleOptions} onChange={this.handleScaleChange}></Dropdown>
              </Menu.Item>
            </Menu.Menu>
            {this.state.musicKey}{this.state.accidental}{this.state.scale}
          </Menu.Item>

        </Menu>
      </Segment>
    );
  }
}

export default Sound;
