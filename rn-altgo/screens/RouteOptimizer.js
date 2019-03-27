import React, { Component } from 'react';
import { Dimensions, Animated, StyleSheet, View, ScrollView, Text, TouchableHighlight } from 'react-native';
// import MapView from 'react-native-maps';
import openMap from 'react-native-open-maps';
import s from '../style'
import { Spinner, Header, Left, Icon, Fab, Right, Button  } from 'native-base'
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios'
import { connect } from 'react-redux'
import { Constants, MapView, Location, Permissions } from 'expo';

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
            active: 'true',
            showDetails: false
        };

        this.mapView = null;
    }

    findRoute = async () => {
        let addresses = this.state.addresses
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
          if(i === 0){
              e.addressSearchQuery = "Your location"
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

    launchMapApp = (coordinate,travelType) => {
      openMap({
        end:`${coordinate.latitude},${coordinate.longitude}`,
        travelType
      })
    }

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
                            strokeColor="rgba(2,128,144, 0.6)"
                            optimizeWaypoints={false}
                            onStart={(params) => {
                                //console.log(`Started transit routing between "${params.origin}" and "${params.destination}"`);
                            }}
                            onReady={result => {
                                this.setState({
                                    transitDistance: this.state.transitDistance + result.distance,
                                    transitDuration: this.state.transitDuration + result.duration,
                                })
                            }}
                            onError={(errorMessage) => {
                                console.log('GOT AN ERROR while drawing the transit route');
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
        }, () => { this.findRoute() });
    }

    async componentDidMount() {
        let addresses = []
        addresses.push(await this._getLocationAsync())
        addresses = addresses.concat(this.props.destList.map(e => `${e.name}, ${e.vicinity}`))
        this.setState({addresses, typeTrip: this.props.typeTrip},()=>{this.findRoute()})
    }

    _handleMapRegionChange = mapRegion => {
        this.setState({ mapRegion })
    };

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                locationResult: 'Permission to access location was denied',
                location,
            });
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

    showDetailnya = () => {
      if ( this.state.showDetails) {
        return (
          <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'white', width, borderRadius: 2, shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 7, }}>
          <ScrollView style={{ flex: 1 }}>

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
                        <Text style={{fontSize:24, textAlign: 'center'}}>{index + 1}</Text>
                    </View>

                  </Left>
                    <View style={{flex:5, justifyContent: 'center'}}>
                        <Text style={{ textAlign: 'left', fontSize: 19, fontWeight: '500'}}>{coordinate.addressSearchQuery} </Text>
                    </View>
                  <Right>
                    <View style={{flex:1}}>
                        <Icon name="car" onPress={()=>{this.launchMapApp(coordinate,'drive')}} />
                        <Icon name="bus" onPress={()=>{this.launchMapApp(coordinate,'public_transport')}} />
                    </View>
                  </Right>
                </View>
            ))}
          </ScrollView>

            </View>
        )
      }
    }

    showButtonBack = () => {
        return (
          <TouchableHighlight onPress={() => this.props.toPageRecom(true)} style={{ justifyContent: 'center', marginRight: 50, top: 120, backgroundColor: 'white', borderRadius: 50, position: 'absolute', zIndex: 10, width: 45, height: 45, margin: 8, shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 7, }} >
            <Icon name="ios-arrow-back" style={{ marginRight: 5, textAlign: 'center', color: 'grey', textAlign: 'center', alignSelf: 'center' }} />
          </TouchableHighlight>
        )
    }

    changeRoutingType = (routingType) => {
      this.setState({typeTrip: routingType},()=>{this.findRoute()})
    }
    
    renderRouteOption = () => {
      return (
        <>
        <View>
          <TouchableHighlight onPress={()=>this.changeRoutingType('AtoZ')} style={{right: 0, justifyContent: 'center', marginRight: 15, top: 120, backgroundColor: 'white', borderRadius: 50, position: 'absolute', zIndex: 10, width: 45, height: 45, margin: 8, shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 7, }} >
            <Icon name="redo" style={{ marginLeft: 4, textAlign: 'center', color: 'grey', textAlign: 'center', alignSelf: 'center' }} />
          </TouchableHighlight>
          {/* <Text style={{fontSize: 13, fontWeight: '500', right: 0, justifyContent: 'center', marginRight: 15, top: 165, position: 'absolute', zIndex: 10, margin: 8,}}>Point to point</Text> */}
        </View>
        <View>
          <TouchableHighlight onPress={()=>this.changeRoutingType('RoundTrip')} style={{right: 0, justifyContent: 'center', marginRight: 15, top: 175, backgroundColor: 'white', borderRadius: 50, position: 'absolute', zIndex: 10, width: 45, height: 45, margin: 8, shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 7, }} >
            <Icon name="sync" style={{ marginLeft: 3, textAlign: 'center', color: 'grey', textAlign: 'center', alignSelf: 'center' }} />
          </TouchableHighlight>
          {/* <Text>Round trip</Text> */}
        </View>
        <View>
          <TouchableHighlight onPress={()=>this.changeRoutingType('Straight')} style={{right: 0, justifyContent: 'center', marginRight: 15, top: 230, backgroundColor: 'white', borderRadius: 50, position: 'absolute', zIndex: 10, width: 45, height: 45, margin: 8, shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 7, }} >
            <Icon name="time" style={{ marginLeft: 3, textAlign: 'center', color: 'grey', textAlign: 'center', alignSelf: 'center' }} />
          </TouchableHighlight>
          {/* <Text>Most efficient</Text> */}
        </View>
        </>
      )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
             {
               this.showButtonBack()
             }
             {
               this.renderRouteOption()
             }
                {/* <ScrollView style={{ flex: 1 }}> */}
                  <TouchableHighlight style={{ zIndex: -1}} underlayColor="#ffffff00" onLongPress={ () => this.setState({ showDetails: !this.state.showDetails })}>
                    <View style={{ height }}>
                        <MapView
                            initialRegion={{
                                latitude: this.state.mapRegion.latitude,
                                longitude: this.state.mapRegion.longitude,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}
                            style={{ zIndex: -1, height , width}}
                            ref={c => this.mapView = c}
                            onPress={()=>{}}
                            customMapStyle={ myMapStyle }
                            provider={ MapView.PROVIDER_GOOGLE }
                        >
                            {this.state.coordinates.map((coordinate, index) =>
                                <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} >
                                  <View style={{ backgroundColor: 'rgba(239, 171, 2, 1)', borderRadius: 50, width: 26, justifyContent: 'center' }}>
                                      <Text style={{ textAlign: 'center', margin: 3, padding: 3,}}>{index + 1}</Text>
                                  </View>
                                </MapView.Marker>
                            )}
                            <MapView.Marker style={{ zIndex: 100,  }} coordinate={this.state.location.coords}
                                title="My Marker"
                                description="Some description">
                              <View  style={{ backgroundColor: 'white', borderRadius: 50, width: 30, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon name="contact" />
                              </View>
                            </MapView.Marker>

                            {(this.state.coordinates.length >= 1) && (
                                <>
                                    <MapViewDirections
                                        origin={this.state.coordinates[0]}
                                        waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : null}
                                        destination={this.state.coordinates[this.state.coordinates.length - 1]}
                                        apikey={GOOGLE_MAPS_APIKEY}
                                        strokeWidth={7}
                                        strokeColor="rgba(239, 171, 2, 0.6)"
                                        optimizeWaypoints={false}
                                        onStart={(params) => {
                                            //console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                                        }}
                                        onReady={result => {
                                            this.setState({
                                                distance: result.distance,
                                                duration: result.duration
                                            })

                                            this.fuelCostPrivateVehicle('car', result.distance)
                                            this.mapView.fitToCoordinates(result.coordinates, {
                                                edgePadding: {
                                                    right: (width / 20),
                                                    bottom: (height / 20),
                                                    left: (width / 20),
                                                    top: (height / 20),
                                                }
                                            });
                                        }}
                                        onError={(errorMessage) => {
                                            console.log('GOT AN ERROR while drawing the main route');
                                        }}
                                    />
                                    {this.displayTransitRoute()}
                                </>
                            )}
                        </MapView>
                    </View>
                  </TouchableHighlight>

                    {
                        this.state.distance === '' && <View style={soverlay.overlay}><Text style={{ color: 'black', fontSize: 29, fontWeight: '600', zIndex: 6, alignSelf: 'center', backgroundColor: 'white', borderRadius: 30, padding: 30, marginBottom: 50 }}>Please wait...</Text></View>
                    }
                    {
                      this.showDetailnya()
                    }

                {/* </ScrollView> */}

            </View>
        );
    }
}
const soverlay = StyleSheet.create({
    overlay: {
        flex: 1,
        height: height ,
        width: width,
        position: 'absolute',
        backgroundColor: 'rgba(15, 15, 15, 0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const mapState = (state) => ({
    destList: state.Meetup.destinationList
})
export default connect(mapState)(Example);

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