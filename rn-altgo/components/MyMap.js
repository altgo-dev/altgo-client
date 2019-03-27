import React, { Component } from 'react'
import { Text, View, Button, TextInput } from 'react-native'
import { Constants, MapView, Location, Permissions } from 'expo';
import s from '../style'
import { connect } from 'react-redux'

//actions
import { getCoordinate } from '../store/actions/MeetupAction'

class MyMap extends Component {
  state = {
    mapRegion: { latitude: this.props.coordinate.lat || -6.2607187, longitude: this.props.coordinate.long || 106.7816162, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
    locationResult: null,
    location: { coords: { latitude: this.props.coordinate.lat || -6.2607187, longitude: this.props.coordinate.long || 106.7816162 } },
    locationInput: ''
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  handleInput = () => {
    var { locationInput } = this.state
    // alert(locationInput)
    this.props.getCoordinate(locationInput)
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

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location), location, });
  };


  render() {
    return (
      <View style={{ flex: 1, height: 700, width: 400 }}>

        <MapView
          style={{ flex: 1 }}
          region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
          onRegionChange={this._handleMapRegionChange}
        >
          <MapView.Marker
            coordinate={this.state.location.coords}
            title="My Marker"
            description="Some description"
          />
        </MapView>

        <Text>
          Location: {this.state.locationResult}
        </Text>

        <Text>Set Starting Point</Text>
        <View style={{ flex: 1 }}>
          <TextInput
            style={{ height: 20, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(locationInput) => this.setState({ locationInput })}
          />
          <Button
            title="Choose"
            onPress={this.handleInput}
          />

        </View>
      </View>
    )
  }
}



const mapDispatchToProps = (dispatch) => ({
  getCoordinate: (locationInput) => (dispatch(getCoordinate(locationInput)))
})

const mapStateToProps = (state) => ({
  coordinate: state.Meetup.coordinate
})

export default connect(mapStateToProps, mapDispatchToProps)(MyMap)
