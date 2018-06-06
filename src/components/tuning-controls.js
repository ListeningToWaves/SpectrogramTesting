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
                  <Input value={context.state.min} disabled={!context.state.isStarted} onChange={context.handleMinChange} maxLength="6"/>
                  </Form.Field>
                  -
                  <Form.Field className="resolution-input">
                  <Input value={context.state.max} disabled={!context.state.isStarted} onChange={context.handleMaxChange} maxLength="6"/>
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
