import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableHighlight, AsyncStorage } from 'react-native'
import { Content, Thumbnail, Icon, Button } from 'native-base'
import SingleFriend from '../components/SingleFriend'
import { LinearGradient,} from 'expo'
import { connect } from 'react-redux'
import { db } from '../api/firestore'

//actions
import { getUserData } from '../store/actions/UsersAction'


class Profile extends Component {
  state = {
    data: [],
    loading: true
  }

  componentDidMount = async () => {
    try {
      await this.props.getUserData()
      this.setState({loading:  false})
    } catch (error) {
      console.log(error)
    }
  

  }

  logout = async () => {
    // alert('masuk')
    await AsyncStorage.removeItem('token')
    this.props.navigation.navigate('Auth')
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient style={{ flex: 1}} colors={['black', '#1f1135', 'black']} >
       {!this.state.loading && (
        <Content>
        <View style={{ flex: 2, height: 250, justifyContent: 'center', alignItems: 'center' }}>
          <Button onPress={this.logout} style={{ width: 60, justifyContent: 'center', marginLeft: 300, height: 35 }}> 
            <Text style={{ color: 'white', fontSize: 17 }}>
              Logout
            </Text>
          </Button>
          <Thumbnail style={{ width: 150, height: 150, borderRadius: 75 }} source={{uri: this.props.userInfo.profilePicture}}/>
          <Text style={{ fontWeight: '500', fontSize: 25, color: 'white' }}> {this.props.userInfo.name } </Text>
        </View>

        <View style={{ flex: 2,  height: 100, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
          <TouchableHighlight underlayColor="#ffffff00" onPress={() => this.props.navigation.navigate('AddFriend')}>
            <Icon name="person-add" style={{ fontSize: 80, color: 'grey' }}/>
          </TouchableHighlight>
          <TouchableHighlight underlayColor="#ffffff00" onPress={() => this.props.navigation.navigate('PendingHangout')}>
            <Icon name="mail-unread" style={{ fontSize: 80, color: 'grey' }}/>
          </TouchableHighlight>
        </View>

        <View style={{ flex: 5 }}>
          <View style={{ backgroundColor: 'lightgrey'}}>
            <Text style={{ textAlign: 'center', fontSize: 18 }}>
              My Friends
            </Text>
          </View>
          </View>
          </Content>
       )}
      </LinearGradient>
      </SafeAreaView>
    )
  }
}

const mapDisatchToProps = (dispatch) => ({
  getUserData: () => (dispatch(getUserData()))
})

const mapStateToProps = (state) => ({
  userInfo: state.Users.userInfo
})

export default connect(mapStateToProps, mapDisatchToProps)(Profile)

