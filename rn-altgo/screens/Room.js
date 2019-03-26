import React, { Component } from 'react'
import { Text, View, TouchableHighlight, FlatList, KeyboardAvoidingView } from 'react-native'
import { Header, Thumbnail, Item, Content, Input, Accordion, Icon, Left, Button } from 'native-base'
import s from '../style'
import { GiftedChat, Bubble, Send, Day } from 'react-native-gifted-chat'
import { LinearGradient } from 'expo'
import { connect } from 'react-redux'
import { db } from '../api/firestore'

//actions
import { setGroupCoordinate, getCenterPlaces } from '../store/actions/MeetupAction'

class Room extends Component {
  state = {
    messages: [],
    chatId: '',
    ready: false,
    coord: [],
    members: [],
    mapType: ''
  }

  componentDidMount = () => {
    // console.log('======', this.props.centerPlaces)
    db.collection('chat').doc(this.props.chatid).onSnapshot(querSnapshot => {
      console.log(querSnapshot.data().type)

      this.setState({
        members: querSnapshot.data().accept,
        mapType: querSnapshot.data().type
      })
      if(!querSnapshot.data().pending.length) {
        db.collection('users').where('chatid', '==', this.props.chatid).get()
          .then(docs => {
            let meetUp = []
            docs.forEach(doc => {
              let obj = { user: doc.data().id, lat: doc.data().lat, long: doc.data().long }
              meetUp.push(obj)
            })
            this.setState({
              ready: true,
              coord: meetUp
            }, () => {
              var input = this.state.coord
              this.props.setGroupCoordinate(this.state.coord)
              this.props.getCenterPlaces(input)
              // console.log(input, '====')
              // console.log(this.props.userid)
            })
          })
      }
      let haha = []
      querSnapshot.data().messages.forEach(l => {
        if (l.createdAt.seconds) {
          let lol= (l.createdAt.seconds * 1000)
          l.createdAt = lol
        }
        haha.push(l)
      })
      this.setState({
        messages: haha
      })
    })
  }


  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      db.collection('chat').doc(this.props.chatid).update({
        messages: this.state.messages
      })

    })
  }

  render() {
    return (
      <View style={{ backgroundColor: 'rgba(235, 235, 235, 0.8)', flex: 1}}>
      <Header style={{ height: 50, backgroundColor: 'white',}}>
        <Left>
          <TouchableHighlight onPress={this.props.backPage}>
            <Icon name="ios-arrow-back" />
          </TouchableHighlight>
        </Left>
          {this.state.ready && this.state.mapType === 'travel' && <TouchableHighlight onPress={() => (this.props.navigation.navigate('TravelMap', { chatid: this.props.chatid}))}><Icon name="pin" /></TouchableHighlight>}
          {this.state.ready && this.state.mapType === 'hangout' && <TouchableHighlight onPress={() => (this.props.navigation.navigate('GroupRoute', { chatid: this.props.chatid}))}><Icon name="pin" /></TouchableHighlight>}
        </Header>
        <KeyboardAvoidingView behavior={'padding'} style={{flex:1}} keyboardVerticalOffset={30}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.props.userid,
            avatar: this.props.userInfo.profilePicture,
            name: this.props.userInfo.name
          }}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: 'white',
                    fontSize: 19
                  },
                  left: {
                    color: 'black',
                    fontSize: 19
                  }
                }}
                wrapperStyle={{
                  left: {
                    backgroundColor: 'white',
                    borderRadius: 0,
                    shadowColor: 'lightgrey',
                    shadowRadius: 2,
                    shadowOpacity: 1
                  },
                  right:{
                    backgroundColor: 'rgb(255, 181, 33)',
                    borderRadius: 0,
                    shadowColor: 'grey',
                    shadowRadius: 5,
                    shadowOpacity: 1
                  }
                }}
                renderUsernameOnMessage={true}
                renderDay={ props => {
                  <Day {...props} textStyle={{ color: 'black'}}/>
                }}
              />
              );
            }}
            /> 
            </KeyboardAvoidingView>
      </View>
    )
  }
}

const mapStatetoProps = (state) => ({
  userid: state.Users.userInfo._id,
  userInfo: state.Users.userInfo,
  destList: state.Meetup.destinationList,
  groupCoordinate: state.Meetup.groupCoordinate,
  centerPlaces: state.Meetup.centerPlaces
})

const mapDispatchToProps = (dispatch) => ({
  setGroupCoordinate: (input) => (dispatch(setGroupCoordinate(input))),
  getCenterPlaces: (origins) => (dispatch(getCenterPlaces(origins)))
})

export default connect(mapStatetoProps, mapDispatchToProps)(Room)