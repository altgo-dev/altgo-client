import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Thumbnail, Left, Body, Right, CardItem, Icon } from 'native-base'
import { connect } from 'react-redux'

import { addDestination, removeDestination } from '../store/actions/MeetupAction'

class SinglePlace extends Component {
    state = {
        // destinationList: this.props.destinationList || [],
        icon: this.props.type || 'ios-add'
    }

    addToMyList = () => {
        // alert('masuk')
        var { destinationList, data } = this.props

        if (this.state.icon == 'ios-add') {
            destinationList.unshift(data)
            this.setState({ destinationList })
            this.props.addDestination(destinationList)
            this.setState({ icon: 'ios-checkmark' })
        }  else if (this.state.icon == 'close'){
            var filtered = destinationList.filter(destination => destination!== data)
            this.props.removeDestination(filtered)
        }
        // alert(JSON.stringify(destinationList[0]))
    }
    componentDidMount () {
        console.log(this.props.data)
    }

    render() {
        const { data } = this.props
        return (
            <CardItem style={{ marginTop: 5, marginHorizontal: 5, padding: 0, backgroundColor: 'rgba(255, 190, 30, 1)' }}>
                {
                    data.photos[0] && <Thumbnail  source={{uri: `https://maps.googleapis.com/maps/api/place/photo?photoreference=${data.photos[0].photo_reference}&maxheight=400&maxwidth=400&key=AIzaSyAbyE8RCeWnwkMeZ5aXdNlRAs7e-r5TKzc`}} />
                }
                <Body style={{ marginTop: 4, marginLeft: 8 }}>
                    <Text style={{ fontSize: 18, fontWeight: '400', color: 'black' }}> {data.name} </Text>
                    <Text style={{ color: 'rgb(50, 50, 50)', marginLeft: 4 }}>
                        {data.vicinity}
                    </Text>
                </Body>
                <Right style={{ width: 30, flex: 0 }}>
                    <TouchableHighlight onPress={() => this.addToMyList()}>
                        <Icon style={{ fontSize: 28, color: 'black' }} name={this.state.icon} />
                    </TouchableHighlight>
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
