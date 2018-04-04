import React, {Component} from 'react';
import {Button, Segment, Menu} from 'semantic-ui-react';
import "../styles/tuning.css";
// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider';
import 'rc-slider/assets/index.css';

// To include the default styles
import 'react-rangeslider/lib/index.css';
import Range from 'rc-slider/lib/Range';
class Tuning extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: 10
    }
  }
  handleChange = value => {
    this.setState({
      value: value
    });
  };
  render(){
    const { value } = this.state

    return (
    <Segment className="menu-pane">
    <Menu className="sound-menu">
    <Menu.Item fitted className="multi-slider-container graph-limit-container">
<Range allowCross={false} defaultValue={[20, 100]} className="multi-slider"/>
<div>
Value 1
Value 2
</div>
Graph Bounds
    </Menu.Item>
    </Menu>
      </Segment>

    );
  }

}

export default Tuning;
