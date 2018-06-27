import React, {Component} from 'react';
import {MyContext} from './my-provider';
import 'rc-slider/assets/index.css';
import "../styles/new-scale-controls.css";

// To include the default styles
// import 'react-rangeslider/lib/index.css';
import Range from 'rc-slider/lib/Range';


class ScaleControls extends Component {

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);

    this.setState({zoomMax: this.props.resolutionMax, zoomMin: this.props.resolutionMin});
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }


  handleResize = () => {
    this.props.handleResize();

  }

  render() {
    return (
      <MyContext.Consumer>
        {(context) => (
          <React.Fragment>
        {/* Graph Limits on Left Side of screen. Same as in Menu */}
      <div className="scale-container">
      Frequency Range
        <Range
        allowCross={false}
        defaultValue={[31, 100]}
        min={1}
        max={100}
        vertical = {true}
        value={[context.state.limitMin, context.state.limitMax]}
        className="new-multi-slider"
        disabled={!context.state.isStarted}
        onChange={context.handleRangeChange}/>
      </div>
      </React.Fragment>
    )}
  </MyContext.Consumer>
    );
  }
}
export default ScaleControls;
