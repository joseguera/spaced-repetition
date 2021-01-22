import React, { Component } from 'react'
import AuthApiService from '../../services/auth-api-service'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'
import UserContext from '../../contexts/UserContext'

class RegistrationRoute extends Component {
  static contextType = UserContext;
  static defaultProps = {
    history: {
      push: () => {},
    },
  }

  handleRegistrationSuccess = (username, password) => {
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
        this.setState({ error: res })
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