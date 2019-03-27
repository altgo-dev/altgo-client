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
       {!this.state.loading && (
        <Content>
          <View style={{ backgroundColor: 'rgb(242, 180, 30)', height: 150, width: 500, zIndex: 1000 }}>
            <TouchableHighlight onPress={this.logout} style={{ width: 50, justifyContent: 'center', marginLeft: 350, height: 50, borderRadius: 25, right: 10  }}> 
              <Icon style={{ fontSize: 28, color: 'black', fontWeight: '800' }} name="log-out" />
            </TouchableHighlight>
              {
                this.props.userInfo.profilePicture ? <Thumbnail style={{ position: 'absolute', flex: 1, width: 150, height: 150, borderRadius: 75, right: 230, top: 60, borderColor: 'lightgrey', borderWidth: 1}} source={{uri: this.props.userInfo.profilePicture}}/> : <Thumbnail style={{ width: 150, height: 150, borderRadius: 75 }} source={ noUser }/>
              }

          </View>

        <View style={{flex: 1, zIndex: 0,marginHorizontal: 5, flex: 2, height: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', }}>
          <Text style={{marginTop: 40, fontWeight: '500', fontSize: 28, color: 'black', marginLeft: 25 }}> {this.props.userInfo.name } </Text>
        </View>

        <View style={{ marginHorizontal: 5, backgroundColor: 'white',flex: 1,  height: 100, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
          
          <TouchableHighlight style={{ borderRadius: 5, width: 140 }} underlayColor="#ffffff00" onPress={() => this.props.navigation.navigate('AddFriend')}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{ width: 60, height: 60, backgroundColor: 'rgba(230, 230, 230, 0.6)', margin: 5, padding: 5, borderRadius: 30, justifyContent: 'center', alignItems: 'center'}}>
                  < Icon name="person-add" style={{ color: 'black'}} />
              </View>
                <Text style={{ color: 'black', paddingTop: 0, padding: 5, textAlign: 'center', fontSize: 15, fontWeight: '300' }}>Add friend</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={{ borderRadius: 5, width: 140 }} underlayColor="#ffffff00" onPress={() => this.props.navigation.navigate('PendingHangout')}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{ width: 60, height: 60, backgroundColor: 'rgba(230, 230, 230, 0.6)', margin: 5, padding: 5, borderRadius: 30, justifyContent: 'center', alignItems: 'center'}}>
                  < Icon name="mail-unread" style={{ color: 'black'}} />
              </View>
                <Text style={{ color: 'black', paddingTop: 0, padding: 5, textAlign: 'center', fontSize: 15, fontWeight: '300' }}>Invitations</Text>
            </View>
          </TouchableHighlight>

        </View>

        <View style={{ flex: 5, backgroundColor: 'white', marginHorizontal: 5, }}>
          <View style={{ marginBottom: 40}}>
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

