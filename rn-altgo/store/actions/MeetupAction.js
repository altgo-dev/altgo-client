import axios from 'axios'

const baseURL = 'http://h8-p2-portocombo1.app.dev.arieseptian.com'

export function getCoordinate(input) {
  return dispatch => {
    axios
      .post(`${baseURL}/route/getCoordinates`, {addresses: [input] })
      .then(({data}) => {
        dispatch({type: 'GET_COORDINATE_SUCCESS', payload: {lat: data[0].results[0].geometry.location.lat, long: data[0].results[0].geometry.location.lng}})
      })
      .catch(err => {
        alert(err)
      })
  }
}

export function getCenterPlaces(origins){
  return async dispatch => {
    try{
      var response = await axios.post(`${baseURL}/meetups`, {origins})
      var payload = response.data.data.reccommendations
      // console.log(payload)
      dispatch({type: 'SET_CENTER_PLACES', payload})
    } catch (error){
      console.log('ERROR')
    }
  }
}

export function setOriginCity(destination){
  return dispatch => {
    dispatch({type: 'SET_ORIGIN_CITY_SUCCESS', payload: destination})
    // alert(destination)
  }
}

export function addDestination(destination){
  return dispatch => {
      axios({
        baseURL,
        url:'/route/getCoordinates',
        method:'POST',
        data:{
          addresses:destination.map(e=>`${e.name}, ${e.vicinity}`)
        }
      }).then(()=> {}).catch(()=> {})
    // console.log(destination)
    dispatch({type: 'ADD_DESTINATION_SUCCESS', payload: destination})
    // alert(JSON.stringify(destination))
  }
}

export function removeDestination(destination){
  return dispatch => {
    dispatch({type: 'REMOVE_DESTINATION_SUCCESS', payload: destination})
  }
}

export function autoComplete(input){
  return async dispatch => {
    try{
      let results = await axios.post(`${baseURL}/autocomplete`, {input})
      var payload= input ? results.data.predictions : []
      payload.slice(0,5)
      dispatch({type: 'AUTOCOMPLETE_SUCCESS', payload })
    } catch(error) {
      // alert('error')
      dispatch({type: 'ERROR', payload: {}})
    }  
  }
}

export function setGroupCoordinate(input){
  return dispatch => {
    // console.log(input, '-----------')
    dispatch({type: 'SET_GROUP_COORD', payload: input })
  }
}