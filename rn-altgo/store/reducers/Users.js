const defaultState = {
  userInfo : {},
  errors : {},
  isLoggedIn: false
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
    default:
      return state
  }
}