import {Component} from 'react'
import Cookies from 'js-cookie'
import {Navigate, useNavigate} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    nameErrMsg: false,
    passwordErrMsg: false,
    showErrMsg: false,
    errMsg: '',
    checkboxInput: '',
    isShowPassword: false,
  }

  validateUsername = () => {
    const {username} = this.state
    return username !== ''
  }

  validatePassword = () => {
    const {password} = this.state
    return password !== ''
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onBlurUsername = () => {
    const isValidUsername = this.validateUsername()
    this.setState({nameErrMsg: !isValidUsername})
  }

  onBlurPassword = () => {
    const isValidPassword = this.validatePassword()
    this.setState({passwordErrMsg: !isValidPassword})
  }

  onChangeCheckbox = event => {
    this.setState({
      checkboxInput: event.target.value,
      isShowPassword: event.target.checked,
    })
  }

  onSubmitSuccess = jwtToken => {
    const {navigate} = this.props
    this.setState({showErrMsg: false})
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    navigate('/', {replace: true})
  }

  onSubmitFailure = errMsg => {
    this.setState({showErrMsg: true, errMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}
    const loginApiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginApiUrl, options)
    const responseData = await response.json()
    const errMsg = responseData.error_msg

    const isValidUsername = this.validateUsername()
    const isValidPassword = this.validatePassword()

    if (isValidUsername && isValidPassword) {
      if (response.ok === true) {
        this.onSubmitSuccess(responseData.jwt_token)
      } else {
        this.onSubmitFailure(responseData.error_msg)
      }
    } else {
      this.setState({
        nameErrMsg: !isValidUsername,
        passwordErrMsg: !isValidPassword,
        showErrMsg: true,
        errMsg,
      })
    }
  }

  renderLoginForm = () => {
    const {
      username,
      password,
      nameErrMsg,
      passwordErrMsg,
      showErrMsg,
      errMsg,
      checkboxInput,
      isShowPassword,
    } = this.state
    const isTextOrPassword = isShowPassword ? 'text' : 'password'
    const activeColor = isShowPassword && 'active'

    return (
      <form className="form-container" onSubmit={this.onSubmitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-desktop-img"
          alt="website logo"
        />
        <div className="input-container">
          <label className="input-label" htmlFor="username">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            className="username-input-field"
            value={username}
            onChange={this.onChangeUsername}
            onBlur={this.onBlurUsername}
            placeholder="Username"
          />
          {nameErrMsg && (
            <p className="login-error-msg">*Please Enter Username</p>
          )}
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="password">
            PASSWORD
          </label>
          <input
            type={isTextOrPassword}
            id="password"
            className="password-input-field"
            value={password}
            onChange={this.onChangePassword}
            onBlur={this.onBlurPassword}
            placeholder="Password"
          />
          <div className="checkbox-container">
            <input
              type="checkbox"
              className="login-checkbox"
              id="checkbox"
              value={checkboxInput}
              onChange={this.onChangeCheckbox}
            />
            <label
              htmlFor="checkbox"
              className={`checkbox-label ${activeColor}`}
            >
              Show Password
            </label>
          </div>

          {passwordErrMsg && (
            <p className="login-error-msg">*Please Enter Password</p>
          )}
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        {showErrMsg && <p className="error-message">*{errMsg}</p>}
      </form>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Navigate to="/" />
    }

    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        />
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          className="login-img"
          alt="website login"
        />
        {this.renderLoginForm()}
      </div>
    )
  }
}

export default props => <LoginForm navigate={useNavigate()} {...props} />
