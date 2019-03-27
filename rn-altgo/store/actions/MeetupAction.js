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
      // console.log(response.data, 'STORE')
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
  const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    const hexToRgb = hex =>
          hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
                ,(m, r, g, b) => '#' + r + r + g + g + b + b)
          .substring(1).match(/.{2}/g)
          .map(x => parseInt(x, 16))

    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    
    return `rgba(${hexToRgb(color).join(', ')}, 0.7)`;
    // return color
  }
  return dispatch => {
    // console.log(input, '-----------')
    input=input.map(e=>{
      e.color=getRandomColor()
      return e
    })
    dispatch({type: 'SET_GROUP_COORD', payload: input })
  }
}