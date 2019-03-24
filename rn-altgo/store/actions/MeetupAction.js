import axios from 'axios'

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