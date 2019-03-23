import axios from 'axios'
import {AsyncStorage} from 'react-native';
import { db } from '../../api/firestore'
const baseURL = 'http://h8-p2-portocombo1.app.dev.arieseptian.com'
export  function register(userInfo) {
  return async dispatch => {
    // alert(JSON.stringify(userInfo))
    try {
      const { data } = await axios
        .post(`${baseURL}/register`, {
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
        id
      })
      
      await AsyncStorage.setItem('token', data.token)
      dispatch({
        type: 'REGISTRATION_SUCCESS', payload: {
          name: data.user.name,
          email: data.user.email,
          profilePicture: data.user.profilePicture,
          token: data.token
        }
      })
      alert('Welcome To Altgo')
      
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.data.err })
    }
  }
}

export  function login(userInfo) {
  return async dispatch => {
    try {
      const { data } = await axios
      .post(`${baseURL}/login`, {
        email: userInfo.email,
        password: userInfo.password,
        token: data.token
      })
      await AsyncStorage.setItem('token', data.token)
      alert('Welcome To Altgo')
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.data.err })
    }
  }
}