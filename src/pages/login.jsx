/* eslint-disable react/prop-types */
import LoginComponent from '../components/login/LoginComponent'
function Login({handleLogin}) {
  return (
    <LoginComponent handleLogin={handleLogin}/>
  )
}

export default Login
