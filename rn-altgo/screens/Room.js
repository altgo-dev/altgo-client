import React, { Component } from 'react'
import { Text, View, TouchableHighlight, FlatList, KeyboardAvoidingView } from 'react-native'
import { Header, Thumbnail, Item, Content, Input, Accordion, Icon, Left } from 'native-base'
import s from '../style'
import { GiftedChat, Bubble, Send, Day } from 'react-native-gifted-chat'
import { LinearGradient } from 'expo'
import { connect } from 'react-redux'
import { db } from '../api/firestore'

class Room extends Component {
  state = {
    messages: [],
    chatId : '',
    ready: false,
    coord: [],
    members: []
  }

  componentDidMount = () => {
    db.collection('chat').doc(this.props.chatid).onSnapshot(querSnapshot => {
      this.setState({
        members: querSnapshot.data().accept
      })
      if(!querSnapshot.data().pending.length) {
        db.collection('users').where('chatid', '==', this.props.chatid).get()
        .then(docs => {
          let meetUp = []
          docs.forEach(doc => {
            let obj = {user: doc.data().id, lat: doc.data().lat, long:doc.data().long}
              meetUp.push(obj)
          }) 
          this.setState({
            ready : true,
            coord: meetUp
          }, () => {
            console.log(this.state.coord, '====')
          })
        })
      }
      let haha = []
      querSnapshot.data().messages.forEach(l => {
        let lol= (l.createdAt.seconds * 1000)
        l.createdAt = lol
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
          {this.state.ready && <TouchableHighlight><Icon name="pin" /></TouchableHighlight>
          }
        </Header>
        <KeyboardAvoidingView behavior={'padding'} style={{flex:1}} keyboardVerticalOffset={30}>
        <GiftedChat
          messages={this.state.messages}
          // isAnimated={true}
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
                    shadowRadius: 5,
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
                // renderDay={ props => {
                //   <Day {...props} textStyle={{ color: 'black'}}/>
                // }}
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
  userInfo: state.Users.userInfo
})

export default connect(mapStatetoProps)(Room)