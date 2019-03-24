const defaultState = {
  coordinate : {},
  originCity: '',
  destinationList: []
}

export default function (state = defaultState, action){
  const { type, payload } = action

  switch (type) {
    case 'GET_COORDINATE_SUCCESS':
      return {...state, coordinate: payload}  
    case 'SET_ORIGIN_CITY_SUCCESS':
      return {...state, originCity: payload}
    case 'ADD_DESTINATION_SUCCESS':
      return {...state, destinationList: payload}
    default:
      return state
  }
}