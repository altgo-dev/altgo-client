import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Container, Header, Content, Item, Input, Label, Icon } from 'native-base';
import s from '../style'

export default class SearchHead extends Component {
    state = {
        field: 1
    }

  render() {
    return (
      <View style={s.searchHead}>
        <View style={{ flex: 1, flexDirection: 'row'}}>
            <Item style={{...s.ml5, ...s.searhBox}}>
                <Input style={{...s.textLight, color: 'white'}} placeholderTextColor="#dddddd" placeholder="Destination"/>
            </Item>
            <TouchableHighlight>
              <Icon style={{...s.textLight, fontSize: 37, marginHorizontal: 25, marginTop: 8}} name="search" />
            </TouchableHighlight>
        </View>
        <TouchableHighlight underlayColor="#ffffff00" onPress={this.props.toPageFriends}>
          <Text style={{ textAlign: 'center', color: 'white', marginTop: 30 , fontWeight: '500'}}>
            Invite friends 
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}
