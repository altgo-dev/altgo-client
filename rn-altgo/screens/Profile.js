import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableHighlight } from 'react-native'
import { Content, Thumbnail, Icon } from 'native-base'
import SingleFriend from '../components/SingleFriend'
import { LinearGradient,} from 'expo'
import { connect } from 'react-redux'

//actions
import { getUserData } from '../store/actions/UsersAction'

class Profile extends Component {
  state = {
    data: [1, 2,3,4,5,6,7,8,9,10]
  }

  componentDidMount = () => {
    this.props.getUserData()
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient style={{ flex: 1}} colors={['black', '#1f1135', 'black']} >

        <Content>
        <View style={{ flex: 3, height: 250, justifyContent: 'center', alignItems: 'center' }}>
          <Thumbnail style={{ width: 150, height: 150, borderRadius: 75 }} source={{uri: this.props.userInfo.profilePicture}}/>
          <Text style={{ fontWeight: '500', fontSize: 25, color: 'white' }}> {this.props.userInfo.name } </Text>
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
            {/* <Text style={{ color: 'white'}}>
              { JSON.stringify(this.props.userInfo.friends)}
            </Text> */}
            {
              this.props.userInfo && this.props.userInfo.friends.map((el, i) => {
              if(el.UserId2._id !== this.props.userInfo._id) {
                return <SingleFriend icon="no" key={i} data={el.UserId2} /> 
              } else {
                return <SingleFriend icon="no" key={i} data={el.UserId1} />  
              } })
            }
        </View>
        </Content>
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

