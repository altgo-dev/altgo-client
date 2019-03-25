import React, { Component } from 'react';
import { Dimensions, Animated, StyleSheet, View, ScrollView, Text } from 'react-native';
// import MapView from 'react-native-maps';
import s from '../style'
import { Spinner } from 'native-base'
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

        // AirBnB's Office, and Apple Park
        this.state = {
            coordinates: [
                // {
                //     latitude: 37.3317876,
                //     longitude: -122.0054812,
                // },
                // {
                //     latitude: 37.771707,
                //     longitude: -122.4053769,
                // },
            ],
            addresses: [],
            routeOptimizerResponse: {},
            mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
            locationResult: null,
            location: { coords: { latitude: 37.78825, longitude: -122.4324 } },
            distance: '',
            duration: '',
            cost: 0
        };

        this.mapView = null;
    }

    findRoute = async () => {
        let addresses = []
        addresses.push(await this._getLocationAsync())
        addresses = addresses.concat(this.props.destList.map(e => `${e.name}, ${e.vicinity}`))
        console.log(addresses)
        let response = await axios({
            url: 'http://h8-p2-portocombo1.app.dev.arieseptian.com/route/routeOptimizer',
            method: 'POST',
            data: {
                addresses,
                routingType: 'AtoZ'
            }
        })
        this.setState({
            coordinates: response.data.route.map(e => {
                return {
                    latitude: e.lat,
                    longitude: e.lng,
                    addressSearchQuery: e.addressSearchQuery,
                    formatted_address: e.geocodingData.formatted_address
                }
            }),
            routeOptimizerResponse: response.data
        })
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
        cost = distance /100 * fuelConsumption * fuelPrice
        this.setState({cost})
    }

    onMapPress = (e) => {
        console.log(e.nativeEvent.coordinate)
        this.setState({
            addresses: [
                ...this.state.addresses,
                `${e.nativeEvent.coordinate.latitude},${e.nativeEvent.coordinate.longitude}`
            ],
        }, () => { this.findRoute() });
    }

    async componentDidMount() {
        this.findRoute()
        // this.setState({
        //     addresses: []
        // })

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

    render() {
        return (
            <ScrollView >
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
                        onPress={this.onMapPress}
                    >
                        {this.state.coordinates.map((coordinate, index) =>
                            <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} ><Text style={{ backgroundColor: 'rgba(196, 196, 196, 0.5)' }}>[{index + 1}]</Text></MapView.Marker>
                        )}
                        <MapView.Marker
                            coordinate={this.state.location.coords}
                            title="My Marker"
                            description="Some description"
                        />
                        {(this.state.coordinates.length >= 2) && (
                            <MapViewDirections
                                origin={this.state.coordinates[0]}
                                waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : null}
                                destination={this.state.coordinates[this.state.coordinates.length - 1]}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeWidth={3}
                                strokeColor="deepskyblue"
                                optimizeWaypoints={false}
                                onStart={(params) => {
                                    console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                                }}
                                onReady={result => {
                                    console.log(`Distance: ${result.distance} km`)
                                    console.log(`Duration: ${result.duration} min.`)

                                    this.setState({
                                        distance: result.distance,
                                        duration: result.duration
                                    })

                                    this.fuelCostPrivateVehicle('car', result.distance,)
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
                                    // console.log('GOT AN ERROR');
                                }}
                            />
                        )}
                    </MapView>
                </View>
                {
                    this.state.distance === '' && <View style={soverlay} />
                }
                {
                    this.state.distance !== '' ?  <View>
                    <Text>Best Routes based on roadtime</Text>
                    <Text>Total road distance: {this.state.distance}km</Text>
                    <Text>Total roadtime: {this.state.duration}min</Text>
                    <Text>Fuel cost (by car): Rp {this.state.cost.toLocaleString()}</Text>

                    {this.state.coordinates.map((coordinate, index) => <Text key={index}>{index + 1}.{coordinate.formatted_address}</Text>)}
                </View> : <Spinner />
                }
               
            </ScrollView>

        );
    }
}
const soverlay = {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    width: 500,
    height: 1000
}
const mapState = (state) => ({
    destList: state.Meetup.destinationList
})
export default connect(mapState)(Example);