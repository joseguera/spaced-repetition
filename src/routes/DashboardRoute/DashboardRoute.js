import React, { Component } from 'react'
import Dashboard from '../../components/Dashboard/Dashboard'

class DashBoardRoute extends Component {

// use default props from login component as example
static defaultProps = {
  location: {},
  history: {
    push: () => { },
  },
}

  render() {
    return (
      <section>
        {/* dashboard component that I created */}
        <Dashboard />
      </section>
    );
  }
}

export default DashBoardRoute