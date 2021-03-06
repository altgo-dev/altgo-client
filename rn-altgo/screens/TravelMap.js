import React, { Component } from 'react';
import { Dimensions, Animated, StyleSheet, View, ScrollView, Text, TouchableHighlight, Button } from 'react-native';
// import MapView from 'react-native-maps';
import openMap from 'react-native-open-maps';
import s from '../style'
import { Spinner, Header, Left, Icon, Tabs, Tab, Right } from 'native-base'
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios'
import { connect } from 'react-redux'
import { db } from '../api/firestore'
import { Constants, MapView, Location, Permissions } from 'expo';
import SinglePlace from '../components/SinglePlace.js'
import SingleFriend from '../components/SingleFriend'
import { setUserVisibility } from '../store/actions/MeetupAction'

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
      addresses: [],
      routeOptimizerResponse: {},
      mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
      locationResult: null,
      location: { coords: { latitude: 37.78825, longitude: -122.4324 } },
      distance: 0,
      duration: 0,
      transitDistance: 0,
      transitDuration: 0,
      cost: 0,
      typeTrip: 'Straight',
      chosenPlace: null,
      groupCoordinate: [],
      members: []
    };

    this.mapView = null;
  }



  findRoute = async (addresses) => {
    let routingType = this.state.typeTrip
    let response = await axios({
      url: 'http://h8-p2-portocombo1.app.dev.arieseptian.com/route/routeOptimizer',
      method: 'POST',
      data: {
        addresses,
        routingType
      }
    })
    let coordinates = response.data.route.map((e, i) => {
      if (i === 0) {
        e.addressSearchQuery = "Your meeting point"
      }
      return {
        latitude: e.lat,
        longitude: e.lng,
        addressSearchQuery: e.addressSearchQuery,
        formatted_address: e.geocodingData.formatted_address
      }
    })
    if(routingType === 'RoundTrip'){
      coordinates.push(coordinates[0])
    }
    this.setState({
      distance:0,
      duration:0,
      transitDistance:0,
      transitDuration:0,
      coordinates,
      routeOptimizerResponse: response.data
    })
  }

  launchMapApp = (coordinate, travelType) => {
    openMap({
      end: `${coordinate.latitude},${coordinate.longitude}`,
      travelType
    })
  }

  //DISPLAY PUBLIC TRANSIT
  displayTransitRoute = () => {
    return (
      <>
        {this.state.coordinates.map((e, i) => (
          (i < this.state.coordinates.length - 1) && (
            <MapViewDirections
              key={i}
              origin={this.state.coordinates[i]}
              destination={this.state.coordinates[i + 1]}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={5}
              mode="transit"
              strokeColor='rgba(63,142,252, 0.6)'
              optimizeWaypoints={false}
              onStart={(params) => {
                //console.log(`Started transit routing between "${params.origin}" and "${params.destination}"`);
              }}
              onReady={result => {
                this.setState({
                  transitDistance: this.state.transitDistance + result.distance,
                  transitDuration: this.state.transitDuration + result.duration,
                })
                console.log(`public transport | distance : ${result.distance} | duration : ${result.duration}`)
              }}
              onError={(errorMessage) => {
                console.log('GOT AN ERROR while drawing the transit route')
              }}
            />
          )
        ))}
      </>
    )
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
    }, () => { this.findRoute() })
  }

  async componentDidMount() {
    console.log('hehehehe')
    const chat = await db.collection('chat').doc(this.props.navigation.state.params.chatid).get()   
    const users = await db.collection('users').where('chatid', '==', this.props.navigation.state.params.chatid).get()
    var groupCoordinate = []
    this.setState({
      members: chat.data().accept
    })
    users.docs.forEach(user => {
      groupCoordinate.push({ lat: user.data().lat, long: user.data().long })
    })
    let addresses = []
    addresses = addresses.concat(chat.data().places.map(e => `${e.name}, ${e.vicinity}`))
    this.setState({ addresses })
    this.findRoute(addresses)

    db.collection('chat').doc(this.props.navigation.state.params.chatid)
      .onSnapshot(snapchat => {
        let chosenPlace = snapchat.data().chosenPlace
        if (chosenPlace) {
          this.setState({ chosenPlace: chosenPlace }, () => {
            this.findRoute([`${chosenPlace.lat},${chosenPlace.long}`, ...this.state.addresses])
          })
        }
      })
  }


  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
        location,
      })
    }
    //coords.longitude, latitude
    let location = await Location.getCurrentPositionAsync({});
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
  };

  chosenPlaceSelected = async (each) => {
    await db.collection('chat').doc(this.props.navigation.state.params.chatid).update({
      chosenPlace: each
    })
  }
  showButtonBack = () => {
    return (
      <TouchableHighlight onPress={() => this.props.navigation.navigate('Friend', {chatid: this.props.navigation.getParam('chatid')})} style={{ justifyContent: 'center', marginRight: 50, top: 30, backgroundColor: 'white', borderRadius: 50, position: 'absolute', zIndex: 10, width: 45, height: 45, margin: 8, shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 7, }} >
        <Icon name="ios-arrow-back" style={{ marginRight: 5, textAlign: 'center', color: 'grey', textAlign: 'center', alignSelf: 'center' }} />
      </TouchableHighlight>
    )
  }

  clickUser = (userid) => {
    this.props.setUserVisibility(userid,this.props.groupCoordinate)
    console.log(this.props.centerPlaces)
  }

  showDetailnya = () => {
    // alert('masuk wo')
      return (
        <View >

          <View style={{ flex:1 , flexDirection: 'row',  }}>
            <View style={{ width: 50, position: 'absolute', marginLeft: 73, backgroundColor: 'rgb(239, 171, 2)', borderRadius: 50, marginTop: 20, zIndex: 15, padding: 5, alignItems: 'center', justifyContent: 'center', shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.6, shadowRadius: 5, }}>
              <Icon style={{ fontSize: 35 }} name="car" />
            </View>

            <View style={{ minHeight: 150, alignItems: 'center', flex: 1, padding: 5, backgroundColor: 'rgba(180, 180, 180, 0.2)', marginRight: 3, marginTop: 39, marginLeft: 3, paddingTop: 30, borderRadius: 25, }}>
              <Text style={{ fontSize: 19, marginTop: 5, }}> {Math.floor(this.state.distance * 100) / 100} km</Text>
              <Text style={{ fontSize: 19, marginTop: 5 }}>{ Math.floor(this.state.duration * 100 )/100} min</Text>
              <Text style={{ fontSize: 19, marginTop: 5 }}>Rp {Math.floor(this.state.cost).toLocaleString()}</Text>
            </View>

            <View style={{ width: 50, position: 'absolute', right: 73, backgroundColor: 'rgb(2,128,144)', borderRadius: 50, marginTop: 20, zIndex: 15, padding: 5, alignItems: 'center', justifyContent: 'center', shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.6, shadowRadius: 5, }}>
              <Icon style={{ fontSize: 35, color: 'white' }} name="bus" />
            </View>

            <View style={{ flex: 1, alignItems: 'center', padding: 5, backgroundColor: 'rgba(180, 180, 180, 0.2)', marginRight: 3, marginTop: 39, marginLeft: 3, paddingTop: 30, borderRadius: 25, }}>
              <Text style={{ fontSize: 19, marginTop: 5 }}> {Math.floor(this.state.transitDistance * 100) / 100} km</Text>
              <Text style={{ fontSize: 19, marginTop: 5 }}>{Math.floor(this.state.transitDuration * 100) / 100} min</Text>
            </View>

          </View>
          {this.state.coordinates.map((coordinate, index) => (
              <View key={index} style={{marginTop: 10, margin: 5, padding: 5, backgroundColor: 'white', flex: 1, flexDirection: 'row', shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.5, shadowRadius: 3}}>
                <Left>
                  <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                      <Text style={{fontSize:20, textAlign: 'center'}}>{index + 1}</Text>
                  </View>

                </Left>
                  <View style={{flex:5, justifyContent: 'center'}}>
                      <Text style={{ textAlign: 'left', fontSize: 18, fontWeight: '400'}}>{coordinate.addressSearchQuery} </Text>
                  </View>
                <Right>
                  <View style={{flex:1, justifyContent:'center'}}>
                      <Icon name="car" onPress={()=>{this.launchMapApp(coordinate,'drive')}} />
                      <Icon name="bus" onPress={()=>{this.launchMapApp(coordinate,'public_transport')}} />
                  </View>
                </Right>
              </View>
          ))}
          </View>
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
              {this.state.coordinates.map((coordinate, index) =>
                <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} >
                  <View style={{ width: 20, backgroundColor: 'rgba(63,142,252, 0.8)', borderRadius: 30, padding: 3, margin: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{ marginHorizontal: 3 }}>{index + 1}</Text>
                  </View>
                </MapView.Marker>
              )}

              {!this.props.groupCoordinate.length && <MapView.Marker
                coordinate={this.state.location.coords}
                title="My Marker"
                description="Some description"
              />}
            {/* 
              {this.props.groupCoordinate.length && this.props.groupCoordinate.map((each, index) => <MapView.Marker
                key={index}
                coordinate={{ latitude: each.lat, longitude: each.long }}
                title="My Marker"
                description="Some description"
              />)} */}

              {this.props.groupCoordinate.length && this.props.groupCoordinate.map((each, index) =>
                <MapView.Marker key={index} coordinate={{ latitude: each.lat, longitude: each.long }}>
                  <View style={{ width: 20, backgroundColor: 'rgba(255, 190, 30, 0.8)', borderRadius: 30, padding: 3, margin: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{ marginHorizontal: 3 }}>{index + 1}</Text>
                  </View>
                </MapView.Marker>
              )}

              {/* DRIVING DIRECTION */}
              {this.props.groupCoordinate.length !== 0 && (this.state.coordinates.length >= 1) && (
                <>
                  <MapViewDirections
                    origin={this.state.coordinates[0]}
                    waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : null}
                    destination={this.state.coordinates[this.state.coordinates.length - 1]}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={7}
                    strokeColor="rgba(255, 190, 30, 0.6)"
                    optimizeWaypoints={false}
                    onStart={(params) => {
                      //console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                    }}
                    onReady={result => {
                      this.setState({
                        distance: result.distance,
                        duration: result.duration
                      })
                      console.log(`driving | distance : ${result.distance} | duration : ${result.duration}`)

                      this.fuelCostPrivateVehicle('car', result.distance)
                      this.mapView.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          right: (width / 20),
                          bottom: (height / 20),
                          left: (width / 20),
                          top: (height / 20),
                        }
                      })
                    }}
                    onError={(errorMessage) => {
                      console.log('GOT AN ERROR while drawing the main route');
                    }}
                  />
                  {this.displayTransitRoute()}
                </>
              )}

              {this.state.chosenPlace &&
                <>
                  <MapView.Marker coordinate={{ latitude: this.state.chosenPlace.lat, longitude: this.state.chosenPlace.long }}>
                    <View style={{ backgroundColor: 'rgba(255, 190, 30, 0.8)', borderRadius: 30, }}>
                      <Text style={{ padding: 3, fontWeight: '500' }}>meeting point</Text>
                    </View>
                  </MapView.Marker>

                {/* DISPLAY USER TO MEETING POINT */}
                  <>
                    { this.props.groupCoordinate.map((e, i) => {
                      if(e.visible) {
                        return (
                          <MapViewDirections
                            key={i}
                            origin={{ longitude: e.long, latitude: e.lat }}
                            destination={{ longitude: this.state.chosenPlace.long, latitude: this.state.chosenPlace.lat }}
                            apikey={GOOGLE_MAPS_APIKEY}
                            strokeWidth={3}
                            strokeColor={e.color}
                            optimizeWaypoints={false}
                            onStart={(params) => {
                              //console.log(`Started transit routing between "${params.origin}" and "${params.destination}"`);
                            }}
                            onReady={result => {
                              let members = this.state.members
                              members.forEach(member => {
                                if(member._id === e.user) {
                                  member.distance = result.distance
                                  member.duration = result.duration
                                }
                              })
                              this.setState({
                                members: members
                              })
                              console.log(`user ${e.user} to meeting point | distance : ${result.distance} | duration : ${result.duration}`)
                            }}
                            onError={(errorMessage) => {
                              console.log('GOT AN ERROR while drawing the transit route');
                            }}
                          />
                        )
                      } else {
                        return null
                      }
                      
                        })}
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
          {/* {
            this.props.groupCoordinate.length === 0 && this.state.distance !== '' && <>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: '500', textAlign: 'center' }}>Best Routes based on roadtime</Text>
              <View style={{ zIndex: 999, margin: 5, padding: 5, backgroundColor: 'lightgray' }}>
                <Text>Total driving distance: {this.state.distance}km</Text>
                <Text>Total driving duration: {this.state.duration}min</Text>
                <Text>Fuel cost (by car): Rp {this.state.cost.toLocaleString()}</Text>
                <Text>Total public transport distance: {this.state.transitDistance}km</Text>
                <Text>Total public transport duration: {this.state.transitDuration}min</Text>
              </View>

              {this.state.coordinates.map((coordinate, index) => (
                <View key={index} style={{ margin: 5, padding: 5, backgroundColor: 'white', flex: 1, flexDirection: 'row', zIndex: 1000 }}>
                  <View style={{ flex: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 24 }}>{index + 1}</Text>
                  </View>
                  <View style={{ flex: 80 }}>
                    <Text>{coordinate.addressSearchQuery}</Text>
                  </View>
                  <View style={{ flex: 10 }}>
                    <Icon name="car" onPress={() => { this.launchMapApp(coordinate, 'drive') }} />
                    <Icon name="bus" onPress={() => { this.launchMapApp(coordinate, 'public_transport') }} />
                  </View>
                </View>
              ))}
            </>
          } */}

          <View style={{ height: 400}}>
            <Tabs tabBarUnderlineStyle={{ borderBottomColor: 'black', backgroundColor: 'black'}} activeTextStyle={{ color: 'black', fontWeight: '500'}}  activeTabStyle={{ color: 'black', backgroundColor: 'rgba(255, 190, 30, 0.6)'}}>
              <Tab activeTextStyle={{ color: 'black', fontWeight: '500'}} heading="Meeting Point" activeTabStyle={{ color: 'black', backgroundColor: 'rgba(255, 190, 30, 0.9)', borderBottomColor: 'black'}} >
                <ScrollView style={{ flex: 1 }}>
                  {
                    this.props.centerPlaces && this.props.centerPlaces.map((each, index) =><SinglePlace type="ios-send" key={index} data={each} updatedChosenPlace={this.chosenPlaceSelected}  />)
                  }
                </ScrollView>
              </Tab>
              <Tab activeTextStyle={{ color: 'black', fontWeight: '500'}}  heading="Members" activeTabStyle={{ color: 'black', backgroundColor: 'rgba(255, 190, 30, 0.9)'}}>
                <ScrollView style={{ flex: 1 }}>
                  <View>
                    {this.state.members.map((member, i) => <TouchableHighlight key={i} onPress={()=> this.clickUser(member._id)}><SingleFriend data={member} /></TouchableHighlight>)}
                  </View>
                </ScrollView>
              </Tab>
              <Tab activeTextStyle={{ color: 'black', fontWeight: '500'}}  heading="Routes" activeTabStyle={{ color: 'black', backgroundColor: 'rgba(255, 190, 30, 0.9)'}}>
                <ScrollView style={{ flex: 1 }}>
                  {
                  this.showDetailnya()
                  }
                </ScrollView>
              </Tab>
            </Tabs>
          </View>
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
  destList: state.Meetup.destinationList,
  groupCoordinate: state.Meetup.groupCoordinate,
  centerPlaces: state.Meetup.centerPlaces
})
const dispatchState = (dispatch) => ({
  setUserVisibility: (userid,groupCoordinate) => (dispatch(setUserVisibility(userid,groupCoordinate)))
})
export default connect(mapState, dispatchState)(Example)

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