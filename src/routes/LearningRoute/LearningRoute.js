import React, { Component } from 'react'
import Learning from '../../components/Learning/Learning'

class LearningRoute extends Component {

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
     < Learning />      
      </section>
    );
  }
}

export default LearningRoute