import React, { Component } from 'react'
import { View, TouchableHighlight, Image, ScrollView } from 'react-native'
import { Thumbnail, Text, Icon, Left, Item, Input, Body, CardItem, Button, Right, Content } from 'native-base'
import s from '../style'
import SingleFriend from './SingleFriend'

export default class AddMem extends Component {
    state = {
        friendsList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
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
                this.props.members[0] && this.props.members.map((el, i) => {
                    return  <CardItem key={i} style={{ margin: 5}}>
                    <Left>
                        <Thumbnail source={{ uri: 'https://www.conversational.com/wp-content/uploads/2016/03/badstock4.jpg' }}/>
                        <Text style={{ fontWeight: '500', fontSize: 20 }}> Vene (userny)</Text>
                    </Left>
                    <Icon onPress={() => this.props.removeMem(i)} name='close' />
                </CardItem>
                })
            }
        </ScrollView>
      </View>
    )
  }
}
