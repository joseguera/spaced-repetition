import React, { Component } from 'react'
import { Input, Label } from '../Form/Form'
import AuthApiService from '../../services/auth-api-service'
import UserContext from '../../contexts/UserContext'
import Button from '../Button/Button'
import './LoginForm.css'


class LoginForm extends Component {
  static defaultProps = {
    onLoginSuccess: () => { }
  }

  static contextType = UserContext

  state = { error: null }

  firstInput = React.createRef()

  handleSubmit = ev => {
    ev.preventDefault()
    const { username, password } = ev.target

    this.setState({ error: null })

    AuthApiService.postLogin({
      username: username.value,
      password: password.value,
    })
      .then(res => {
        username.value = ''
        password.value = ''
        this.context.processLogin(res.authToken)
        this.props.onLoginSuccess()
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
  }

  componentDidMount() {
    this.firstInput.current.focus()
  }

  render() {
    const { error } = this.state
    return (
      <form
        className='registration-form'
        onSubmit={this.handleSubmit}
      >
        <div className='error' role='alert'>
          {error && <p>{error}</p>}
        </div>
        <div>
          <Label htmlFor='login-username-input' className='form-text'>
            Username
          </Label>
          <Input className='text-box'
            ref={this.firstInput}
            id='login-username-input'
            name='username'
            required
          />
        </div>
        <div>
          <Label htmlFor='login-password-input' className='form-text'>
            Password
          </Label>
          <Input className='text-box'
            id='login-password-input'
            name='password'
            type='password'
            required
          />
        </div>
        <Button type='submit'className='sign-up-button'>
          Login
        </Button>
      </form>
    )
  }
}

export default LoginForm
