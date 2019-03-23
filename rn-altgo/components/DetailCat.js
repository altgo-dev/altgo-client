import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Header, Icon, Left, Right } from 'native-base'
import SinglePlace from './SinglePlace'

export default class DetailCat extends Component {
    state= {
        list: [1,1,1,1,1,1,1]
    }
  render() {
      let { list } = this.state
    return (
      <View>
          <Header style={{ height: 60}}>
            <Left>
                <TouchableHighlight onPress={this.props.toPageRecom}>
                    <Icon name="arrow-back"/>
                </TouchableHighlight>
            </Left>
            <Text style={{ fontSize: 24, fontWeight: '500'}}>
            {this.props.cat}
            </Text>
            <Right></Right>
          </Header>
            {
                list[0] && list.map((el, i) => <SinglePlace type="ios-add" key={i}/>)
            }
      </View>
    )
  }
}
