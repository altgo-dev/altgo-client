
const defaultState = {
  userInfo : {},
  errors : {},
  isLoggedIn: false,
  users: [],
  searchFriendResult: []
}

export default function (state = defaultState, action){
  const { type, payload } = action

  switch (type) {
    case 'REGISTRATION_SUCCESS':
      return {...state, userInfo: payload, isLoggedIn: true}  
    
    case 'SIGNIN_SUCCESS':
      return {...state, userInfo: payload, isLoggedIn: true }
    
    case 'SEARCH_FRIEND_SUCCESS':
      return {...state, searchFriendResult: payload}

    case 'ADD_FRIEND_SUCCESS':
      return {...state, searchFriendResult: []}

    case 'ERROR':
      return {...state, errors: payload}
    case 'FETCH_DATA':
      return { ...state, userInfo: payload, isLoggedIn: true}
    case 'FETCH_USERS':
      return { ...state, users: payload }
    default:
      return state
  }
}