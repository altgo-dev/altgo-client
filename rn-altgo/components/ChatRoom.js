import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Header, Thumbnail, Item, Content, Input, Accordion, Icon, Left } from 'native-base'
import s from '../style'

export default class ChatRoom extends Component {
  state = {
      show: true
  }

  showMenu = () => {
      this.setState({
          show: !this.state.show
      })
  }

  render() {
    return (
      
      <View style={{ flex: 1, }}>
        <Header style={{ height: 50}}>
            <Left>
                <Text style={{ fontSize: 23, fontWeight: '500', marginBottom: 6 }}>
                    NAMA Group
                </Text>
            </Left>
            {/* <Icon onPress={this.showMenu} name="add" /> */}
        </Header>
        <View style={{ height: 70, alignItems: 'center', justifyContent: 'center' }}>
        </View>
        
      </View>
    )
  }
}
