
const defaultState = {
  userInfo : {},
  errors : {},
  isLoggedIn: false,
  users: [],
  searchFriendResult: [],
  myList: [1]
}

export default function (state = defaultState, action){
  const { type, payload } = action

  switch (type) {
    case 'REGISTRATION_SUCCESS':
      return {...state, userInfo: payload, isLoggedIn: true}  
    case 'SIGNIN_SUCCESS':
      return {...state, userInfo: payload, isLoggedIn: true }
    case 'SIGN_OUT':
      return{...state, isLoggedIn: false, errors: {}}
    case 'SEARCH_FRIEND_SUCCESS':
      return {...state, searchFriendResult: payload}
    case 'ADD_FRIEND_SUCCESS':
      return {...state}
    case 'REMOVE_FRIEND_SUCCESS':
      return {...state}
    case 'ERROR':
      return {...state, errors: payload}
    case 'FETCH_DATA':
      return { ...state, userInfo: payload, isLoggedIn: true}
    case 'FETCH_USERS':
      return { ...state, users: payload }
    case 'ADD_MYLIST': 
      return {...state, myList: payload}
    default:
      return state
  }
}