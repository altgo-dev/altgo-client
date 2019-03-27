import React, { Component } from 'react';
import { Dimensions, Animated, StyleSheet, View, ScrollView, Text, TouchableHighlight, Button } from 'react-native';
// import MapView from 'react-native-maps';
import s from '../style'
import { Spinner, Header, Left, Icon } from 'native-base'
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios'
import { connect } from 'react-redux'
import { Constants, MapView, Location, Permissions } from 'expo';
import { db } from '../api/firestore'
import SinglePlace from '../components/SinglePlace'
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyBN6anoHdSlaMME70z1wRzRTntP9CiKRYw';

class Example extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: [],
      routeOptimizerResponse: {},
      mapRegion: { latitude: -6.260708, longitude: 106.781569, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
      locationResult: null,
      location: { coords: { latitude: -6.260708, longitude: 106.781569 } },
      cost: 0,
      chosenPlace: null,
      chooseName: '',
      distance: null
    }

    this.mapView = null;
  }

  fuelCostPrivateVehicle = (type, distance) => {
    let fuelPrice
    let fuelConsumption
    let cost
    if (type === 'car') {
      fuelPrice = 7650
      fuelConsumption = 10
    } else if (type === 'motorcycle') {
      fuelPrice = 7650
      fuelConsumption = 5.6
    }
    cost = distance / 100 * fuelConsumption * fuelPrice
    this.setState({ cost })
  }

  onMapPress = (e) => {
    this.setState({
      addresses: [
        ...this.state.addresses,
        `${e.nativeEvent.coordinate.latitude},${e.nativeEvent.coordinate.longitude}`
      ],
    }, () => {
      this.findRoute()
    })
  }

  async componentDidMount() {
    this._getLocationAsync()
    await db.collection('chat').doc(this.props.navigation.state.params.chatid).onSnapshot(querySnapshot => {
      if (querySnapshot.data().chosenPlace) {
        this.setState({
          chosenPlace: querySnapshot.data().chosenPlace
        })
      }
    })
  }

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion })
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
        location,
      })
    }
    //coords.longitude, latitude
    let location = await Location.getCurrentPositionAsync({})
    var currentLatLng = `${location.coords.latitude},${location.coords.longitude}`

    this.setState({
      mapRegion: {
        ...this.state.mapRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      location: location,
    })
    return currentLatLng
  }

  updatedChosenPlace = (coord, name) => {
    this.setState({
      chooseName: name
    })
    db.collection('chat').doc(this.props.navigation.state.params.chatid).update({
      chosenPlace: coord
    })

    this.setState({ chosenPlace: coord })
  }

  showButtonBack = () => {
    return (
      <TouchableHighlight onPress={() => this.props.navigation.navigate('Friend', { chatid: this.props.navigation.getParam('chatid') })} style={{ justifyContent: 'center', marginRight: 50, top: 30, backgroundColor: 'white', borderRadius: 50, position: 'absolute', zIndex: 10, width: 45, height: 45, margin: 8, shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 7, }} >
        <Icon name="ios-arrow-back" style={{ marginRight: 5, textAlign: 'center', color: 'grey', textAlign: 'center', alignSelf: 'center' }} />
      </TouchableHighlight>
    )
  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        {
          this.showButtonBack()
        }
        <ScrollView style={{ flex: 1 }}>
          <View style={{ height: 500 }}>
            <MapView
              initialRegion={{
                latitude: this.state.mapRegion.latitude,
                longitude: this.state.mapRegion.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              style={StyleSheet.absoluteFill}
              ref={c => this.mapView = c}
              onPress={() => { }}
              customMapStyle={myMapStyle}
              provider={MapView.PROVIDER_GOOGLE}
            >
              {!this.props.groupCoordinate.length && this.state.coordinates.map((coordinate, index) =>
                <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} >
                  <Text style={{ backgroundColor: 'rgba(196, 196, 196, 0.5)' }}>[{index + 1}]</Text>
                </MapView.Marker>
              )}

              {!this.props.groupCoordinate.length && <MapView.Marker
                coordinate={this.state.location.coords}
                title="My Marker"
                description="Some description"
              />}

              {/* {this.props.groupCoordinate.length && this.props.groupCoordinate.map((each, index) => <MapView.Marker
                key={index}
                // coordinate={this.state.location.coords}
                coordinate={{ latitude: each.lat, longitude: each.long }}
                title="My Marker"
                description="Some description"
              />)} */}

              {this.props.groupCoordinate.length && this.props.groupCoordinate.map((each, index) =>
                <MapView.Marker key={index} style={{ zIndex: 100 }} coordinate={{ latitude: each.lat, longitude: each.long }} >
                  <View style={{ width: 20, backgroundColor: 'rgba(255, 190, 30, 0.8)', borderRadius: 30, padding: 3, margin: 3, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ marginHorizontal: 3 }}>{index + 1}</Text>
                  </View>
                </MapView.Marker>
              )}

              {this.state.chosenPlace &&
                <>
                  <MapView.Marker title={this.state.chooseName} style={{ zIndex: 100 }} coordinate={{ latitude: this.state.chosenPlace.lat, longitude: this.state.chosenPlace.long }}>
                    <View style={{ backgroundColor: 'rgba(255, 190, 30, 0.8)', borderRadius: 30, }}>
                      <Text style={{ padding: 3, fontWeight: '500' }}>meeting point</Text>
                    </View>
                  </MapView.Marker>

                  <>
                    {this.props.groupCoordinate.map((e, i) => (
                      (
                        <MapViewDirections
                          key={i}
                          origin={{ longitude: e.long, latitude: e.lat }}
                          destination={{ longitude: this.state.chosenPlace.long, latitude: this.state.chosenPlace.lat }}
                          apikey={GOOGLE_MAPS_APIKEY}
                          strokeWidth={3}
                          strokeColor={e.color}
                          optimizeWaypoints={false}
                          onStart={(params) => {
                            console.log(`Started transit routing between "${params.origin}" and "${params.destination}"`);
                          }}
                          onReady={result => {
                            this.setState({
                              transitDistance: this.state.transitDistance + result.distance,
                              transitDuration: this.state.transitDuration + result.duration,
                              distance: result.distance
                            })
                          }}
                          onError={(errorMessage) => {
                            console.log('GOT AN ERROR while drawing the transit route');
                          }}
                        />
                      )
                    ))}
                  </>
                </>}

              {/* {this.state.chosenPlace && <MapView.Marker
                // coordinate={this.state.location.coords}
                coordinate={{ latitude: this.state.chosenPlace.lat, longitude: this.state.chosenPlace.long }}
                title="My Marker"
                description="Some description"
              />} */}
            </MapView>
          </View>


          {/* {this.props.groupCoordinate && <Text style={{ color: 'black', fontSize: 20, fontWeight: '500', textAlign: 'center' }}>recommended meeting places:</Text>} */}
          <View style={{ height: 300, marginTop: 20 }}>
            <ScrollView style={{ flex: 1 }}>
              {
                this.props.centerPlaces && this.props.centerPlaces.map((each, index) => {
                  if (each.coordinate == this.state.chosenPlace) {
                    return (
                      <SinglePlace type="ios-send" key={index} data={each} distance={this.state.distance} updatedChosenPlace={this.updatedChosenPlace} />
                    )
                  }

                  else {
                    return (
                      <SinglePlace type="ios-send" key={index} data={each} updatedChosenPlace={this.updatedChosenPlace} />
                    )
                  }
                })
              }

            </ScrollView>
          </View >
        </ScrollView>

      </View>
    );
  }
}
const soverlay = StyleSheet.create({
  overlay: {
    flex: 1,
    height: height + 200,
    width: width,
    position: 'absolute',
    backgroundColor: 'rgba(15, 15, 15, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const mapState = (state) => ({
  groupCoordinate: state.Meetup.groupCoordinate,
  centerPlaces: state.Meetup.centerPlaces
})
export default connect(mapState)(Example)

const myMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "weight": 3
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#d6d6d6"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]