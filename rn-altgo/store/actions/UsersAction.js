import axios from 'axios'
import { AsyncStorage } from 'react-native';

// const baseURL = 'http://h8-p2-portocombo1.app.dev.arieseptian.com'
// const baseURL = 'http://172.20.10.5:3000'

const baseURL = 'http://h8-p2-portocombo1.app.dev.arieseptian.com'

export  function register(userInfo) {
  return async dispatch => {
    try {
      let formData = new FormData()
      formData.append('image', { uri: userInfo.image, name: `image.jpg`, type: 'multipart/form-data' })
      formData.append('name', userInfo.name)
      formData.append('email', userInfo.email)
      formData.append('password', userInfo.password)
      const register = await axios.post(`${baseURL}/register`, formData)
      await AsyncStorage.setItem('token', register.data.token)
      dispatch({
        type: 'REGISTRATION_SUCCESS', payload: {
          name: register.data.user.name,
          email: register.data.user.email,
          profilePicture: register.data.user.profilePicture,
          _id: register.data.user._id
        }
      })
      alert('Welcome To Altgo')
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.data.err })
    }
  }
}

export function login(userInfo) {
  return async dispatch => {
    try {
      const login = await axios.post(`${baseURL}/login`, { email: userInfo.email, password: userInfo.password })
      await AsyncStorage.setItem('token', login.data.token)
      dispatch({type: 'SIGNIN_SUCCESS', payload: {
        name: login.data.name,
        email: login.data.email, 
        _id: login.data._id
      }})
      await AsyncStorage.setItem('token', login.data.token)
    } catch (error) {
      dispatch({type: 'ERROR', payload: {message: `sorry, we can't find your account`}})
    }
  }
}

export function getUserData(token) {
  return async dispatch  => {
    try {
      const user = await axios.get(`${baseURL}/users/`, {headers: {token: token}})
      dispatch({type: 'FETCH_DATA', payload: {
        name: user.data.userFound.name,
        email: user.data.userFound.email,
        friends: user.data.userFriend,
        profilePicture: user.data.userFound.profilePicture,
        _id: user.data.userFound._id
      }})
    } catch (error) {
      dispatch({type: 'ERROR', payload: {message: `sorry, we can't find your account`}})

    }
  }
}

export function searchFriend(email){
  return async dispatch => {
    try {
      const token = await AsyncStorage.getItem('token')
      const response = await axios.get(`${baseURL}/users/all?email=${email}`, {
        headers: {token}
      })
      // console.log(JSON.stringify(response.data,null,2))
      dispatch({type: 'SEARCH_FRIEND_SUCCESS', payload: response.data.users})
    } catch(error){
      console.log(JSON.stringify(error,null,2))
      dispatch({type: 'ERROR', payload: {message: 'no user found'}})
      alert('error')
    }
  }
}

export function getAllUser(token) {
  return async dispatch => {
    try { 
      const users = await axios.get(`${baseURL}/users/all`, { headers: { token: token} })
      dispatch({ type: 'FETCH_USERS', payload: { users: users.data.users } })
    }catch(err) {
    dispatch({type: 'ERROR', payload: {message: `sorry, we can't find your account`}})
    }
  }
}

export function addFriend(friendId, friendName){
  return async dispatch => {
    try{
      let token = await AsyncStorage.getItem('token')
      let response = await axios.post(`${baseURL}/users/friend`, {friendId}, {
        headers: {token}
      })
      console.log(JSON.stringify(response,null,2))
      alert(`${friendName} has been added to your friend list`)
      dispatch({type: 'ADD_FRIEND_SUCCESS'})
    } catch (error){
      console.log(JSON.stringify(error,null,2))
      alert('error')
    }
  }
}



