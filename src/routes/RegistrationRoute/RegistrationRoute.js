import React, { Component } from 'react'
import AuthApiService from '../../services/auth-api-service'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'

class RegistrationRoute extends Component {
  static defaultProps = {
    history: {
      push: () => {},
    },
  }

  handleRegistrationSuccess = (username, password) => {
    console.log(username, password)
    AuthApiService.postLogin({
      username: username,
      password: password,
    })
      .then(res => {
        this.context.processLogin(res.authToken)
        const { history } = this.props
        history.push('/')
      })
      .catch(res => {
        console.error(res.error);
        this.setState({ error: res.error })
      })
  }

  render() {
    return (
      <section className='registration-page'>
        <p>
          Practice learning a language with the spaced repetition revision technique.
        </p>
        <h2>Sign up</h2>
        <RegistrationForm
          onRegistrationSuccess={this.handleRegistrationSuccess}
        />
      </section>
    );
  }
}

export default RegistrationRoute