import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { Header, Icon } from 'native-base'
import s from '../style'

export default class ResultList extends Component {
  render() {
    return (
        <View style={s.resList}>
          <Icon name="arrow-up" style={{ color: 'lightgrey', textAlign: 'center' }}/>
          {/* <Text style={{ color: 'white', fontWeight: '700', textAlign: 'center', fontSize: 40 }}> -</Text> */}
          <Text style={{ color: 'grey'}}> djbfhdfui</Text>
          <Text style={{ color: 'grey'}}> djbfhdfui</Text>
        </View>
    )
  }
}
