import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Header, Thumbnail, Item, Content, Input, Accordion, Icon, Left } from 'native-base'
import s from '../style'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import { LinearGradient } from 'expo'
export default class ChatRoom extends Component {
  state = {
    messages: [],
  }
 
  componentWillMount() {
    this.setState({
      messages: [
        {
          //YANG USER IDNYA 1 ITU DIA SENDIRI / HPNYA DIA
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 3,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 3,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }
 
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }
 
  render() {
    return (
        <LinearGradient style={{ flex: 1}} colors={['#1c003d', '#4B0082']} >
      <View style={{ flex: 1 }}>

        {/* <Header style={{ height: 50, backgroundColor: 'white',}}> */}
            {/* <Text style={{ fontSize: 23, fontWeight: '500', marginBottom: 6 , color: '#231942'}}>
                Julith
            </Text> */}
        {/* </Header> */}

        <GiftedChat
          messages={this.state.messages}
          isAnimated={true}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
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
