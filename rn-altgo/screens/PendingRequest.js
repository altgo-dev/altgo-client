import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class PendingRequest extends Component {
  render() {
    console.log(this.props.chatid)
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    )
  }
}
