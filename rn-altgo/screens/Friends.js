import React, { Component } from 'react'
import { Text, View, SafeAreaView } from 'react-native'
import { Container, Content} from 'native-base'
import s from '../style'

export default class Friends extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1}}>
        <Container style={s.Friend}>
          <View>
            <Text> Hello this is friends page </Text>
          </View>
        </Container>
      </SafeAreaView>
    )
  }
}
