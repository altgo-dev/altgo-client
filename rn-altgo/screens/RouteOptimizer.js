import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
// import MapView from 'react-native-maps';
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
            addresses: ['monumen nasional', 'hacktiv8'],
            routeOptimizerResponse: {},
            mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
            locationResult: null,
            location: { coords: { latitude: 37.78825, longitude: -122.4324 } },
        };

        this.mapView = null;
    }

    findRoute = async () => {
        let response = await axios({
            url: 'http://h8-p2-portocombo1.app.dev.arieseptian.com/route/routeOptimizer',
            method: 'POST',
            data: {
                addresses: this.state.addresses,
                routingType: 'AtoZ'
            }
        })
        this.setState({
            coordinates: response.data.route.map(e => {
                return {
                    latitude: e.lat,
                    longitude: e.lng,
                    name: e.geocodingData.formatted_address,
                }
            }),
            routeOptimizerResponse: response.data
        })
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
        await this._getLocationAsync();
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
        alert(JSON.stringify(location))
        this.setState({
            mapRegion: {
                ...this.state.mapRegion,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            },
            location: location,
            //addresses: this.state.addresses.unshift(`${location.coords.latitude},${location.coords.longitude}`)
        })
        //    this.setState({
        //        coordinates: this.state.coordinates.unshift({
        //             latitude: location.coords.latitude,
        //             longitude: location.coords.longitude,
        //        })
        //    })
        //    this.setState({ locationResult: JSON.stringify(location), location, });

    };

    render() {
        return (
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
                    <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} ><Text style={{ backgroundColor: 'rgba(196, 196, 196, 0.5)' }}>[{index}] {coordinate.name}</Text></MapView.Marker>
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
                        strokeColor="hotpink"
                        optimizeWaypoints={false}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)

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
        );
    }
}
const mapState = (state) => ({
    destList: state.Meetup.destinationList
})
export default connect(mapState)(Example);