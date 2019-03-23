import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Header, Thumbnail, Item, Content, Input } from 'native-base'

export default class ChatRoom extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'mistyrose' }}>
        <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 23, fontWeight: '500' }}>
                NAMA Group
            </Text>

        </View>
      </View>
    )
  }
}
