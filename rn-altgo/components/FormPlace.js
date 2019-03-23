import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Header, Icon, Left } from 'native-base'

export default class FormPlace extends Component {
  render() {
    return (
      <View>
        <Header style={{ height: 50}}>
            <Left>
              <TouchableHighlight onPress={this.props.toChat}>
                <Icon name="ios-arrow-back" />
              </TouchableHighlight>
            </Left>
        </Header>
        <Text> Page form woy </Text>
      </View>
    )
  }
}
