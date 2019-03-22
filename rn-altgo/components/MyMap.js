import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { MapView } from 'expo'
import s from '../style'

export default class MyMap extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black', height: 600, width: 400}}>
        <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -6.259610,
          longitude: 106.783665,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        />
      </View>
    )
  }
}
