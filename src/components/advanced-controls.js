import React, {Component} from 'react';
import {Button, Icon, Segment, Menu} from 'semantic-ui-react';
import {MyContext} from './my-provider';


class AdvancedControls extends Component {
  render(){
    return (
      <MyContext.Consumer>
        {(context) => (
          <React.Fragment>
          <Segment className="menu-pane-container">
          <Menu className="menu-pane">
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

export default AdvancedControls;
