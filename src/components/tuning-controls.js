import React, {Component} from 'react';
import {Button, Segment, Menu} from 'semantic-ui-react';
import {MyContext} from '../app.js';

import "../styles/tuning.css";
// Using an ES6 transpiler like Babel
// import Slider from 'react-rangeslider';
import 'rc-slider/assets/index.css';

// To include the default styles
// import 'react-rangeslider/lib/index.css';
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
      <MyContext.Consumer>
        {(context) => (
          <React.Fragment>
            <Segment className="menu-pane">
              <Menu>
                <Menu.Item className="vert graph-limit-container">
                <div className="multi-slider-container">
                <div className="menu-header">
                Graph Limits
                </div>
                <Range allowCross={false} defaultValue={[20, 20000]} value={[context.state.resolutionMin, context.state.resolutionMax]} className="multi-slider" onChange={context.handleRangeChange}/>

                </div>
                </Menu.Item>
              </Menu>
            </Segment>
          </React.Fragment>
        )}
      </MyContext.Consumer>

    );
  }

}

export default Tuning;
