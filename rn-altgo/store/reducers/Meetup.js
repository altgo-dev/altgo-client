const defaultState = {
  coordinate : {}
}

export default function (state = defaultState, action){
  const { type, payload } = action

  switch (type) {
    case 'GET_COORDINATE_SUCCESS':
      return {...state, coordinate: payload}  
    default:
      return state
  }
}