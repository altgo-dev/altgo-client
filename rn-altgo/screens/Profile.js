import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableHighlight, AsyncStorage } from 'react-native'
import { Content, Thumbnail, Icon, Button } from 'native-base'
import SingleFriend from '../components/SingleFriend'
import { LinearGradient,} from 'expo'
import { connect } from 'react-redux'
import { db } from '../api/firestore'

//actions
import { getUserData } from '../store/actions/UsersAction'


//ASSETS
import noUser from '../assets/nouser.png'

class Profile extends Component {
  state = {
    data: [],
    loading: true
  }

  componentDidMount = async () => {
    try {
      var token = await AsyncStorage.getItem('token')
      await this.props.getUserData(token)
      this.setState({loading:  false})
    } catch (error) {
      console.log(error)
    }
  }

  async componentDidUpdate(prevProps, prevState){
    var token = await AsyncStorage.getItem('token')
    if(prevProps.userInfo !== this.props.userInfo){
      this.props.getUserData(token)
    }
  }

  logout = async () => {
    // alert('masuk')
    await AsyncStorage.removeItem('token')
    this.props.navigation.navigate('Auth')
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(242, 180, 30)' }}>
      {/* <LinearGradient style={{ flex: 1}} colors={['black', '#1f1135', 'black']} > */}
       {!this.state.loading && (
        <Content>
        <View style={{ flex: 2, height: 250, justifyContent: 'center', alignItems: 'center' }}>
          <Button onPress={this.logout} style={{ width: 50, justifyContent: 'center', marginLeft: 320, height: 50, backgroundColor: 'black', borderRadius: 25 }}> 
          <Icon style={{ fontSize: 22 }} name="log-out" />
          </Button>
          {
            this.props.userInfo.profilePicture ? <Thumbnail style={{ width: 150, height: 150, borderRadius: 75 }} source={{uri: this.props.userInfo.profilePicture}}/> : <Thumbnail style={{ width: 150, height: 150, borderRadius: 75 }} source={ noUser }/>
          }
          <Text style={{ fontWeight: '500', fontSize: 28, color: 'black' }}> {this.props.userInfo.name } </Text>
        </View>

        <View style={{ flex: 2,  height: 100, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
          <TouchableHighlight style={{ borderRadius: 5, backgroundColor: 'rgb(230, 230, 230)', width: 140 }} underlayColor="#ffffff00" onPress={() => this.props.navigation.navigate('AddFriend')}>
            <Text style={{ color: 'black', margin: 5, padding: 5, textAlign: 'center', fontSize: 19, fontWeight: '300' }}>Add friend</Text>
          </TouchableHighlight>
          <TouchableHighlight style={{ borderRadius: 5, backgroundColor: 'rgb(230, 230, 230)', width: 140}} underlayColor="#ffffff00" onPress={() => this.props.navigation.navigate('PendingHangout')}>
            <Text style={{ color: 'black', margin: 5, padding: 5, textAlign: 'center', fontSize: 19, fontWeight: '300' }}>Invitations</Text>
          </TouchableHighlight>
        </View>

        <View style={{ flex: 5, backgroundColor: 'white', marginHorizontal: 5, shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 7, }}>
          <View style={{ borderBottomColor: 'lightgrey', borderBottomWidth: 1}}>
            <Text style={{ textAlign: 'center', fontSize: 21, padding: 10 }}>
              My Friends
            </Text>
          </View>

            {
              this.props.userInfo && this.props.userInfo.friends.map((el, i) => {
              if(el.UserId2._id === this.props.userInfo._id) {
                return   <SingleFriend color="white" icon="no" data={el.UserId1} key={i} />
              } else {
                return  <SingleFriend color="white" icon="no" data={el.UserId2} key={i} />
              } })
            }
        </View>
        </Content>
       )}
      
      {/* </LinearGradient> */}
      </SafeAreaView>
    )
  }
}

const mapDisatchToProps = (dispatch) => ({
  getUserData: (token) => (dispatch(getUserData(token))),
  logout: () => dispatch(logout())
})

const mapStateToProps = (state) => ({
  userInfo: state.Users.userInfo
})

export default connect(mapStateToProps, mapDisatchToProps)(Profile)

