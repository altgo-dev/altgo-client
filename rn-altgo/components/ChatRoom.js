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
            <Icon onPress={this.showMenu} name="add" />
        </Header>
        {
            this.state.show && <View style={{ height: 70, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{...s.collapMenu, paddingBottom: 6 }}>
                    <TouchableHighlight underlayColor="#ffffff00" onPress={this.props.toForm} >
                        <Text style={s.collapText}>
                            Itinerary
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={{...s.collapMenu, borderBottomWidth: 0}}>
                    <Text style={s.collapText}>
                        Start Trip
                    </Text>
                </View>
            </View>
        }
        
      </View>
    )
  }
}
