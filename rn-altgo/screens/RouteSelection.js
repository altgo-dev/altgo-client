import React, { Component } from 'react'
import { Text, View, TextInput, Button } from 'react-native'

import axios from 'axios'

const GmapKey = 'key=AIzaSyBN6anoHdSlaMME70z1wRzRTntP9CiKRYw'
const GmapGeocodeAPI = 'https://maps.googleapis.com/maps/api/geocode/json'

export function getCoordinate(input) {
    axios
        .get(`${GmapGeocodeAPI}?address=${input}&${GmapKey}`)
        .then(({ data }) => {
            // alert('success hehe')
            //dispatch({ type: 'GET_COORDINATE_SUCCESS', payload: { lat: data.results[0].geometry.location.lat, long: data.results[0].geometry.location.lng } })
            console.log(data)
        })
        .catch(err => {
            console.log(err)
        })

}

export default class RouteSelection extends Component {
    state = {
        input1: '',
        input2: '',
    }

    changeText = (text) => {
        this.setState({ input1: text })
    }

    search = () => {
        getCoordinate(this.state.input1)
    }

    render() {
        return (
            <View style={{ marginTop: 100 }}>
                <Text> textInComponent </Text>
                <TextInput style={{ borderWidth: 1 }} onChangeText={this.changeText} />
                <Button title={'ok'} onPress={this.search} />
            </View>
        )
    }
}

