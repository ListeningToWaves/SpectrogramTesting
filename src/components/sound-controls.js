import React, {Component} from 'react';
import {Button, Segment, Menu, Dropdown, Checkbox, Label} from 'semantic-ui-react';
import "../styles/sound.css";
// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider';

// To include the default styles
import 'react-rangeslider/lib/index.css';
import { timbreOptions, scaleOptions } from '../common.js';
//TODO: fix sound button aligment stuff

class Sound extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: 50,
      soundChecked: false
    }
  }
  handleChange = value => {
    this.setState({
      value: value
    });
  };

  handleSoundToggle = () =>{
    this.setState({
      soundChecked: !this.state.soundChecked
    })
  }
  
  render(){
    const { value, soundChecked } = this.state

    return (
    <Segment className="menu-pane">
      <Menu className="sound-menu">
      <Menu.Item className="adsr-container">
      <Menu.Menu className="height1">
      Sound

      <Menu.Item className="sub-menu-box">
      <Menu.Menu vertical="true" className="extra-margin">

      <Checkbox toggle checked={soundChecked} onChange={this.handleSoundToggle} className="extra-margin" />
      <div>
      {soundChecked ? 'On!': "Off" }
      </div>
      </Menu.Menu>
      </Menu.Item>
      </Menu.Menu>
      </Menu.Item>
    <Menu.Item className="adsr-container">
    <Menu.Menu className="height1">
    Output Volume

    <Menu.Item className="sub-menu-box">
    <Menu.Menu vertical="true" className="extra-margin">

    <Slider
    min={0}
    max={100}
    value={value}
    onChange={this.handleChange}
    className="adsr-slider"
    />
    {value}
    </Menu.Menu>
    </Menu.Item>
    </Menu.Menu>
    </Menu.Item>
    <Menu.Item>
    <Dropdown text='Timbre' fluid options={timbreOptions}>
    </Dropdown>

    </Menu.Item>

    <Menu.Item className="adsr-container">
    <Menu.Menu>
    ADSR

    <Menu.Item className="sub-menu-box">
    <Menu.Menu vertical="true" className="extra-margin">
    Attack
    <Slider
    min={0}
    max={100}
    value={value}
    onChange={this.handleChange}
    className="adsr-slider"
    />
    {value}
    </Menu.Menu>
    <Menu.Menu vertical="true" className="extra-margin">
    Release
    <Slider
    min={0}
    max={100}
    value={value}
    onChange={this.handleChange}
    className="adsr-slider"
    />
    {value}
    </Menu.Menu>
</Menu.Item>
</Menu.Menu>
</Menu.Item>

<Menu.Item className="scales-container" fitted>
<Menu.Menu className="height1 scales-grid">
Scales

<Menu.Item className="scales-sub-menu">
<Menu.Menu vertical="true" className="extra-margin">
<div className="flex height1">
Scale Mode
<Checkbox toggle className="scales-checkbox"/>
</div>
</Menu.Menu>
<Menu.Menu vertical="true" className="extra-margin">

<Dropdown fluid item compact text='Key'>
  <Dropdown.Menu>
    <Dropdown.Item text='C' />
    <Dropdown.Item text='D' />
    <Dropdown.Item text='E' />
    <Dropdown.Item text='F' />
    <Dropdown.Item text='G' />
    <Dropdown.Item text='A' />
    <Dropdown.Item text='B' />

  </Dropdown.Menu>
</Dropdown>
</Menu.Menu>
<Menu.Menu vertical="true" className="extra-margin">
<Dropdown item text='#/b' compact>
  <Dropdown.Menu>
    <Dropdown.Item  text=' ' />
    <Dropdown.Item text='#' />
    <Dropdown.Item text='b' />


  </Dropdown.Menu>
</Dropdown>
</Menu.Menu>
<Menu.Menu vertical="true" className="extra-margin">
<Dropdown item text='Scale' compact options={scaleOptions}></Dropdown>
</Menu.Menu>

</Menu.Item>
</Menu.Menu>
</Menu.Item>
      </Menu>
      </Segment>

    );
  }

}

export default Sound;
