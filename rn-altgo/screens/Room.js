import React, { Component } from 'react'
import { Text, View, TouchableHighlight, FlatList } from 'react-native'
import { Header, Thumbnail, Item, Content, Input, Accordion, Icon, Left } from 'native-base'
import s from '../style'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import { LinearGradient } from 'expo'
import { connect } from 'react-redux'
import { db } from '../api/firestore'

class Room extends Component {
  state = {
    messages: [],
    chatId : '',
    ready: false,
    coord: []
  }

  componentDidMount = () => {
    db.collection('chat').doc(this.props.chatid).onSnapshot(querSnapshot => {
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
      db.collection('chat').doc(this.state.chatId).update({
        messages: this.state.messages
      })

    })

  }

  render() {
    return (
   <LinearGradient style={{ flex: 1}} colors={['#1c003d', '#4B0082']} >
      <View style={{ flex: 1 }}>
      <Header style={{ height: 50, backgroundColor: 'white',}}>
        <TouchableHighlight onPress={this.props.backPage}>
          <Text style={{ fontSize: 23, fontWeight: '500', marginBottom: 6 , color: '#231942'}}>
                Back
            </Text></TouchableHighlight>
            <Text style={{ fontSize: 23, fontWeight: '500', marginBottom: 6 , color: '#231942'}}>
                My Groups
            </Text>
            {this.state.ready && <Text style={{ fontSize: 23, fontWeight: '500', marginBottom: 6 , color: '#231942'}}>
                Go To Maps
            </Text>}
        </Header>
        <GiftedChat
          messages={this.state.messages}
          isAnimated={true}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
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
                  },
                  left: {
                    color: 'black'
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
                    backgroundColor: '#af8fd6',
                    borderRadius: 0,
                    shadowColor: 'grey',
                    shadowRadius: 5,
                    shadowOpacity: 1
                  }
                }}
                renderUsernameOnMessage={true}
              />
            );
          }}
        /> 
      </View>
        </LinearGradient>
    )
  }
}

const mapStatetoProps = (state) => ({
  userid: state.Users.userInfo._id,
  userInfo: state.Users.userInfo
})

export default connect(mapStatetoProps)(Room)