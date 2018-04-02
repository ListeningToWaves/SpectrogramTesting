import React, {Component} from 'react';
import {Button, Segment, Menu} from 'semantic-ui-react';
import "../styles/menu.css";
// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider';

// To include the default styles
import 'react-rangeslider/lib/index.css';

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
    <Slider
              min={0}
              max={100}
              value={value}
              onChange={this.handleChange}
              className="slider"
    />
      </Segment>

    );
  }

}

export default Tuning;
