
const defaultState = {
  userInfo : {},
  errors : {},
  isLoggedIn: false,
  users: []
}

export default function (state = defaultState, action){
  const { type, payload } = action

  switch (type) {
    case 'REGISTRATION_SUCCESS':
      return {...state, userInfo: payload, isLoggedIn: true}  
    
    case 'SIGNIN_SUCCESS':
      return {...state, userInfo: payload, isLoggedIn: true }

    case 'ERROR':
      return {...state, errors: payload}
    case 'FETCH_DATA':
    console.log(payload, 'FETCH DATA') 
      return { ...state, userInfo: payload, isLoggedIn: true}
    case 'FETCH_USERS':
      console.log(payload, 'FETCH USERS') 
      return { ...state, users: payload }
    default:
      return state
  }
}