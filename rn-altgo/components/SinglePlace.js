import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Thumbnail, Left, Body, Right, CardItem, Icon } from 'native-base'
import { connect } from 'react-redux'
import openMap from 'react-native-open-maps';

import { addDestination, removeDestination } from '../store/actions/MeetupAction'
import defImg from '../assets/hotel.jpg'

class SinglePlace extends Component {
    state = {
        // destinationList: this.props.destinationList || [],
        icon: this.props.type || 'ios-add',
    }

    launchMapApp = (travelType) => {
        openMap({
            end: `${this.props.data.coordinate.lat},${this.props.data.coordinate.long}`,
            travelType
        })
    }

    addToMyList = () => {
        // alert('masuk')
        var { destinationList, data } = this.props

        if (this.state.icon == 'ios-add') {
            destinationList.push(data)
            this.setState({ destinationList })
            this.props.addDestination(destinationList)
            this.setState({ icon: 'ios-checkmark' })
        } else if (this.state.icon == 'close') {
            var filtered = destinationList.filter(destination => destination !== data)
            this.props.removeDestination(filtered)
        }
        // alert(JSON.stringify(destinationList[0]))
    }
    componentDidMount() {
        // console.log(this.props.data)
    }

    render() {
        const { data, distance } = this.props
        let apasih = () => {
            if (data.photos) {
                return (
                    <Thumbnail source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?photoreference=${data.photos[0].photo_reference}&maxheight=400&maxwidth=400&key=AIzaSyAbyE8RCeWnwkMeZ5aXdNlRAs7e-r5TKzc` }} />
                )
            } else if (data.photo_path) {
                return <Thumbnail source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?photoreference=${data.photo_path}&maxheight=400&maxwidth=400&key=AIzaSyAbyE8RCeWnwkMeZ5aXdNlRAs7e-r5TKzc` }} />
            } else {
                return <Thumbnail source={defImg} />
            }
        }

        return (
            <CardItem style={{ marginTop: 5, marginHorizontal: 5, padding: 0, backgroundColor: 'rgba(255, 255, 255, 1)', shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 4, }}>
                {
                    apasih()
                }
                <Body style={{ marginTop: 4, marginLeft: 8 }}>
                    <Text style={{ fontSize: 18, fontWeight: '400', color: 'black' }}> {data.name} </Text>

                    {distance && <Text style={{ color: 'rgb(50, 50, 50)', marginLeft: 4 }}>
                        {distance} km
                        </Text>
                    }

                </Body>
                {this.props.pageFrom !== 'gada' && <Left style={{ width: 30, flex: 0 }}>
                    <View style={{ flex: 1 }}>
                        <Icon name="car" onPress={() => { this.launchMapApp('drive') }} />
                    </View>
                </Left>}
                <Right style={{ width: 30, flex: 0 }}>
                {
                    data.photo_path ? 
                <TouchableHighlight underlayColor="#ffffff00" onPress={() =>  this.props.updatedChosenPlace(data.coordinate, data.name)}>
                    <Icon style={{ fontSize: 28, color: 'black' }} name={this.state.icon} />
                </TouchableHighlight>
                :
                <TouchableHighlight underlayColor="#ffffff00" onPress={() => this.addToMyList()}>
                    <Icon style={{ fontSize: 28, color: 'black' }} name={this.state.icon} />
                </TouchableHighlight>   
                }

                </Right>
            </CardItem>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    addDestination: (destinationList) => (dispatch(addDestination(destinationList))),
    removeDestination: (filtered) => (dispatch(removeDestination(filtered)))
})

const mapStateToProps = (state) => ({
    destinationList: state.Meetup.destinationList
})

export default connect(mapStateToProps, mapDispatchToProps)(SinglePlace)
