import React,{Component}  from 'react';
import { Button, Tab } from 'semantic-ui-react';
import "../styles/menu.css";


class Menu extends Component {
  // <Button inverted color='violet'>Oscilloscope</Button>
  constructor() {
    super();
    this.state = {
      pane1: <Tab.Pane>Tab 1 Content</Tab.Pane>,
      
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    this.setState({panes: !this.state.showPanes})
  }

  render(){
    const color = "violet";
    const panes = [
      { menuItem: <Button className = "menu-button" inverted color='violet' key="5">Oscilloscope</Button>, key: "1" },
      { menuItem: 'Graph', render: () => this.state.pane1, key: "2"},
      { menuItem: 'Timbre', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane>, key: "3"},
      { menuItem: 'Scale', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane>, key: "4" },
    ]
    return (
      <div className="menu-container">
      <Tab className="menu-tab" menu={{ color, inverted: true, attached: true,pointing: true}}
      panes={panes} defaultActiveIndex={1}/>
      </div>

  );
  }
}


export default Menu;
