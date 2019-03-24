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

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.destinationList !== this.props.destinationList) {
    //         this.setState({ destinationList: this.props.destinationList })
    //         if (this.props.destinationList.includes(this.props.data)) {
    //             this.setState({icon: 'ios-checkmark'})
    //             alert('true')
    //         }
    //         alert('true')
    //     }


    // }

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
        // alert(JSON.stringify(destinationList))
    }

    render() {
        const { data } = this.props
        return (
            <CardItem style={{ margin: 0, padding: 0, backgroundColor: '#231942' }}>
                <Left style={{ width: 80, flex: 0 }}>
                    <Thumbnail source={{ uri: 'https://st.depositphotos.com/2170303/2736/i/950/depositphotos_27361601-stock-photo-very-old-woman-showing-her.jpg' }} />
                </Left>
                <Body style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 18, fontWeight: '400', color: 'white' }}> {data.name} </Text>
                    <Text style={{ color: 'lightgrey', marginLeft: 4 }}>
                        {data.vicinity}
                    </Text>
                </Body>
                <Right style={{ width: 30, flex: 0 }}>
                    <TouchableHighlight onPress={() => this.addToMyList()}>
                        <Icon style={{ fontSize: 28 }} name={this.state.icon} />
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
