import React, { Component } from 'react'
import { View, TouchableHighlight, Image, ScrollView } from 'react-native'
import { Thumbnail, Text, Icon, Left, Item, Input, Body, CardItem, Button, Right, Content } from 'native-base'
import s from '../style'
import SingleFriend from './SingleFriend'

export default class AddMem extends Component {
    state = {
        members: [{}, {},],
        friendsList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        tripName: ''
    }

    addMember = (input) => {
        //logic add friend disini
        this.setState({
            members: this.state.members.concat(input)
        })
    }

    removeMem = (i) => {
        let temp = [...this.state.members]
        temp.splice(i, 1)
        if (i === 0 ) {
            this.setState({
                members: []
            })
        } else {
            this.setState({
                members: temp
            })
        }
    }

    createTrip = () => {
        //logic create trip disini 
        this.props.toChat()
    }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
            {
                this.state.members[0] && this.state.members.map((el, i) => {
                    return  <CardItem key={i} style={{ margin: 5}}>
                    <Left>
                        <Thumbnail source={{ uri: 'https://www.conversational.com/wp-content/uploads/2016/03/badstock4.jpg' }}/>
                        <Text style={{ fontWeight: '500', fontSize: 20 }}> Vene (userny)</Text>
                    </Left>
                    <Icon onPress={() => this.removeMem(i)} name='close' />
                </CardItem>
                })
            }
        </ScrollView>
      </View>
    )
  }
}
