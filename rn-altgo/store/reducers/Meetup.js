const defaultState = {
  coordinate : {},
  originCity: '',
  destinationList: [],
  autocompleteResult: [],
  groupCoordinate: [],
  centerPlaces: []
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
    case 'AUTOCOMPLETE_SUCCESS':
      return {...state, autocompleteResult: payload}
    case 'SET_GROUP_COORD':
      return {...state, groupCoordinate: payload}
    case 'SET_CENTER_PLACES':
      return {...state, centerPlaces: payload}
    
    case 'REMOVE_DESTINATION_SUCCESS':
      return {...state, destinationList: payload}
      
    default:
      return state
  }
}