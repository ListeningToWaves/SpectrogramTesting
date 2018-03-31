import React, {Component} from 'react';
import {Button, Tab, Menu} from 'semantic-ui-react';
import "../styles/menu.css";
import { Slider } from 'react-semantic-ui-range';

const settings = {
     start:2,
     min:0,
     max:10,
     step:1,
   }
const pane1 = (
<Tab.Pane>
<Slider color="red" inverted={false} settings={settings}/>
</Tab.Pane>
)
class MyMenu extends Component {
  constructor() {
    super();
    this.state = {
      pane1: null,
      pane2: null,
      pane3: null,
      point: false

    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e, data) {
    switch (data.activeIndex) {
      case 1:
        if (this.state.pane1) {
          this.setState({pane1: null, point: false});
        } else {
          this.setState({
            pane1: pane1,
            pane2: null,
            pane3: null,
            point: true
          });
        }
        break;
      case 2:
        if (this.state.pane2) {
          this.setState({pane2: null, point: false});
        } else {
          this.setState({
            pane1: null,
            pane2: <Tab.Pane>Tab 2 Content</Tab.Pane>,
            pane3: null,
            point: true
          });
        }
        break;
      case 3:
        if (this.state.pane3) {
          this.setState({pane3: null, point: false});
        } else {
          this.setState({
            pane1: null, pane2: null, pane3: <Tab.Pane>Tab 3 Content</Tab.Pane>,
            point: true
          });
        }
        break;
      default:
        this.setState({pane1: null, pane2: null, pane3: null, point: false});
        break;
    }

  }

  handleClick(e) {
    if (e._dispatchListeners.length === 1) {
      this.setState({pane1: null, pane2: null, pane3: null, point: false});
    }
  }


  render() {
    const color = "violet";
    const panes = [
      {
        menuItem: <Button className="menu-button" inverted color='violet' key="5">Oscilloscope</Button>,
        key: "1"
      }, {
        menuItem: 'Tuning',
        render: () => this.state.pane1,
        key: "2",
      }, {
        menuItem: 'Sound',
        render: () => this.state.pane2,
        key: "3"
      }, {
        menuItem: 'Advanced',
        render: () => this.state.pane3,
        key: "4"
      }, {
        menuItem: <Menu.Header className="menu-title" key="6" active="false" >Spectrogram</Menu.Header>,
        render: ()=>false,
        key: "5"
      }
    ];
    return (
      <div className="menu-container">

        <Tab
        className="menu-tab"
        menu={{
          color,
          inverted: true,
          attached: true,
          pointing: this.state.point
        }}
        panes={panes}
        defaultActiveIndex={1}
        onTabChange={this.handleChange}
        onClick={this.handleClick}
        key="0"
        >
        </Tab>
      </div>

    );
  }
}

export default MyMenu;
