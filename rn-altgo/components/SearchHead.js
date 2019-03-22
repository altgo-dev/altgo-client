import React, { Component } from 'react'
import { Text, View } from 'react-native'
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
            <Item style={{...s.ml5, ...s.searhBox}} rounded>
                {/* <Label style={{...s.textLight, marginLeft: 10}} >Destination</Label> */}
                <Input style={{...s.textLight}} placeholder="Destination"/>
            </Item>
            <Icon style={{...s.textLight, fontSize: 37, marginHorizontal: 25, marginTop: 8}} name="ios-add-circle-outline" />
        </View>
      </View>
    )
  }
}
