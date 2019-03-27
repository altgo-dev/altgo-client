import React, { Component } from 'react'
import { View, TouchableHighlight, Image, ScrollView, Text, } from 'react-native'
import { Thumbnail, Icon, Left, Item, Input, Body, CardItem, Button, Right, Content } from 'native-base'
import s from '../style'
import SingleFriend from './SingleFriend'
import noUser from '../assets/nouser.png'
export default class AddMem extends Component {
    state = {
        friendsList: [],
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
                    return  <CardItem key={i} style={{ margin: 5, borderRadius: 3, backgroundColor: 'rgba(230, 230, 230, 0.7)'}}>
                    <Left>
                      {
                        el.profilePicture ? <Thumbnail source={{ uri: el.profilePicture }}/> : <Thumbnail source={noUser}/>
                      }
                        
                        <Text style={{ fontWeight: '500', fontSize: 20, }}> {el.name}</Text>
                    </Left>
                    <Icon onPress={() => this.props.removeMem(el, i)} name='close' />
                </CardItem>
                })
            }
        </ScrollView>
      </View>
    )
  }
}
