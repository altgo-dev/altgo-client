import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableHighlight } from 'react-native'
import { Content, Thumbnail, Icon } from 'native-base'
import SingleFriend from '../components/SingleFriend'
import { LinearGradient,} from 'expo'

export default class Profile extends Component {
  state = {
    data: [1, 2,3,4,5,6,7,8,9,10]
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient style={{ flex: 1}} colors={['black', '#1f1135', 'black']} >

        <Content>
        <View style={{ flex: 3, height: 250, justifyContent: 'center', alignItems: 'center' }}>
          <Thumbnail style={{ width: 150, height: 150, borderRadius: 75 }} source={{uri: 'https://st.depositphotos.com/2170303/2736/i/950/depositphotos_27361601-stock-photo-very-old-woman-showing-her.jpg'}}/>
          <Text style={{ fontWeight: '500', fontSize: 25, color: 'white' }}> Grandma </Text>
        </View>

        <View style={{ flex: 2,  height: 100, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
          <TouchableHighlight underlayColor="#ffffff00" onPress={() => this.props.navigation.navigate('AddFriend')}>
            <Icon name="person-add" style={{ fontSize: 80 }}/>
          </TouchableHighlight>
          <TouchableHighlight underlayColor="#ffffff00" onPress={() => this.props.navigation.navigate('AddFriend')}>
            <Icon name="timer" style={{ fontSize: 80 }}/>
          </TouchableHighlight>
        </View>

        <View style={{ flex: 5 }}>
          <View style={{ backgroundColor: 'lightgrey'}}>
            <Text style={{ textAlign: 'center', fontSize: 18 }}>
              My Friends
            </Text>
          </View>
            {
              this.state.data.map((el, i) => <SingleFriend key={i} />)
            }
        </View>
        </Content>
      </LinearGradient>
      </SafeAreaView>
    )
  }
}
