import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Header, Thumbnail, Item, Content, Input, Accordion, Icon, Left } from 'native-base'
import s from '../style'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import { LinearGradient } from 'expo'
import { connect } from 'react-redux'
import { db } from '../api/firestore'

class Friend extends Component {
  state = {
    messages: [],
    chatId : ''
  }
 
  // async componentDidMount () {
  //   const user = await db.collection('users').where('id', '==', `${this.props.userid}`).get()
  //   let temp = []
  //   await db.collection('chat').doc(user.docs[0].data().chatid).onSnapshot(function(querySnapshot) {
  //     temp = querySnapshot.data().messages
  //     console.log(querySnapshot.data())
  //   });
  //   this.setState({
  //     messages: temp
  //   })
  
  // }

  async componentWillMount() {
    const user = await db.collection('users').where('id', '==', `${this.props.userid}`).orderBy('createdAt', 'desc').get()
    // console.log(user.docs[0].data(), '====')
    // let sorted = user.docs.sort((a, b) => {
    //   return (b.data().createdAt) - (a.data().createdAt);
    // })
    // console.log(sorted)
    this.setState({
      chatId: user.docs[0].data().chatid
    })
    let temp = []
    
    db.collection('chat').doc(user.docs[0].data().chatid).onSnapshot((querySnapshot) => {
     
        let haha = []
        querySnapshot.data().messages.forEach(l => {
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

export default connect(mapStatetoProps)(Friend)

