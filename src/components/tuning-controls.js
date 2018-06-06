import React, {Component} from 'react';
import {Button, Icon, Form, Segment, Menu, Input, Dropdown, Checkbox} from 'semantic-ui-react';
import {MyContext} from './my-provider';
import {scaleOptions, keyOptions, accidentalOptions} from '../util/dropdownOptions.js';

import "../styles/tuning.css";
// Using an ES6 transpiler like Babel
// import Slider from 'react-rangeslider';
import 'rc-slider/assets/index.css';

// To include the default styles
// import 'react-rangeslider/lib/index.css';
import Range from 'rc-slider/lib/Range';
class Tuning extends Component {
  constructor(){
    super();
    this.state = {
      min: 20,
      max: 20000
    }
  }

  // handleMinChange = (e, data) => this.setState({min: data.value});
  // handleMaxChange = (e, data) => this.setState({max: data.value});
  // handleInputChange = (e, context, min, max) =>{
  //   if(e.key === "Enter"){
  //     let lowerValue = Number(min);
  //     let upperValue = Number(max);
  //     lowerValue = (!isNaN(lowerValue) && lowerValue < this.state.max && lowerValue > 0 && lowerValue < 20000) ? lowerValue: 20;
  //     upperValue = (!isNaN(upperValue) && upperValue > this.state.min && upperValue > 0 && upperValue <= 20000) ? upperValue: 20000;
  //     2console.log(lowerValue);
  //     console.log(upperValue);
  //     let newMax = this.convertToLinear(upperValue, 1,100, 1, 20000);
  //     let newMin = this.convertToLinear(lowerValue, 1, 100, 1, 20000);
  //     context.handleInputChange(lowerValue, upperValue, newMin, newMax );
  //     this.setState({min: lowerValue, max: upperValue});
  //
  //   }
  //   // this.setState({resolutionMax: max, resolutionMin: min});
  // };


  render(){
    return (
      <MyContext.Consumer>
        {(context) => (
          <React.Fragment>
            <Segment className="menu-pane-container">
              <Menu className="menu-pane">
                <Menu.Item className="vert graph-limit-container">
                  <div className="multi-slider-container">
                  <div className="menu-header">
                  Graph Limits
                  </div>
                  <Range
                  allowCross={false}
                  defaultValue={[31, 99]}
                  min={1}
                  max={100}
                  value={[context.state.limitMin, context.state.limitMax]}
                  className="multi-slider"
                  disabled={!context.state.isStarted}
                  onChange={context.handleRangeChange}/>
                  <br></br>
                  <div>
                  <Form onKeyPress={context.handleInputChange} className="resolution-container">
                  <Form.Field className="resolution-input">
                  <Input value={context.state.min} disabled={!context.state.isStarted} onChange={context.handleMinChange}/>
                  </Form.Field>
                  -
                  <Form.Field className="resolution-input">
                  <Input value={context.state.max} disabled={!context.state.isStarted} onChange={context.handleMaxChange}/>
                  </Form.Field>
                  </Form>
                  </div>
                  </div>
                </Menu.Item>
                {/** Scale Menu **/}
                <Menu.Item className="vert">
                  <div className="menu-header">Scales</div>
                  <Menu.Menu className="horiz">
                    <Menu.Item className="vert no-line">
                      <div>Note Lines</div>
                      <Checkbox
                      toggle
                      className="scales-checkbox"
                      checked={context.state.noteLinesOn}
                      onChange={context.handleNoteLinesToggle}
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

export default Tuning;
