import axios from 'axios'

const baseURL = 'http://h8-p2-portocombo1.app.dev.arieseptian.com'
const GmapKey = 'key=AIzaSyBN6anoHdSlaMME70z1wRzRTntP9CiKRYw'
const GmapGeocodeAPI = 'https://maps.googleapis.com/maps/api/geocode/json'

export function getCoordinate(input) {
  return dispatch => {
    axios
      .get(`${GmapGeocodeAPI}?address=${input}&${GmapKey}`)
      .then(({data}) => {
        // alert('success hehe')
        dispatch({type: 'GET_COORDINATE_SUCCESS', payload: {lat: data.results[0].geometry.location.lat, long: data.results[0].geometry.location.lng}})
        alert(data.results[0].geometry.location.lat)
      })
      .catch(err => {
        alert(err)
      })
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
      }).then(()=>{}).catch(()=>{})
    
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