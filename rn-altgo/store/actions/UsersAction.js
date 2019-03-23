import axios from 'axios'

const baseURL = 'http://172.20.10.5:3000'

export function register(userInfo) {
  return dispatch => {
    // alert(JSON.stringify(userInfo))
    axios
      .post(`${baseURL}/register`, {
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password
      })
      .then(({ data }) => {
        dispatch({
          type: 'REGISTRATION_SUCCESS', payload: {
            name: data.user.name,
            email: data.user.email,
            profilePicture: data.user.profilePicture
          }
        })
        alert('Welcome To Altgo')
      })
      .catch(error => {
        console.log(JSON.stringify(error,null,2))
        dispatch({ type: 'ERROR', payload: error.data.err })
      })
  }
}

export function login(userInfo) {
  return dispatch => {
    axios
      .post(`${baseURL}/login`, {
        email: userInfo.email,
        password: userInfo.password
      })
      .then(({ data }) => {
        dispatch({type: 'SIGNIN_SUCCESS', payload: {
          name: data.name,
          email: data.email, 
        }})
        alert('Welcome To Altgo')
      })
      .catch(error => {
        dispatch({type: 'ERROR', payload: {message: `sorry, we can't find your account`}})
      })
  }
}