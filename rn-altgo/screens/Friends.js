import React, { Component } from 'react'
import { Text, View, TouchableHighlight, FlatList } from 'react-native'
import { Header, Thumbnail, Item, Content, Input, Accordion, Icon, Left } from 'native-base'
import s from '../style'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import SingleGroup from '../components/SingleGroup'
import Room from './Room'
import { LinearGradient } from 'expo'
import { connect } from 'react-redux'
import { db } from '../api/firestore'

class Friend extends Component {
  state = {
    messages: [],
    chatId : '',
    page: 1,
    chats: [],
    ready: false
  }

  componentDidMount = async () => {
    try {
      console.log(this.props.userid)
      const chats = await db.collection('users').where('id', '==', this.props.userid).get()
      let allChats = []
      chats.docs.forEach(doc => {
        let obj = {id: doc.id, ...doc.data()}
        allChats.push(obj)
      })
      this.setState({
        chats: allChats
      }, () => {
        console.log('=================')
        console.log(this.state.chats)
      })
    } catch (error) {
      
    }
  }


  clickedGroup = (chatid) => {
    this.setState({
      chatId: chatid
    }, () => {
      this.setState({
        page: 2
      })
    })

    
  }

  backPage = () => {
    this.setState({
      page: 1
    })
  }

  setReady = () => {
    this.setState({
      ready: true
    })
  }
  // async componentWillMount() {
  //   const user = await db.collection('users').where('id', '==', `${this.props.userid}`).orderBy('createdAt', 'desc').get()
  //   this.setState({
  //     chatId: user.docs[0].data().chatid
  //   })
    
  //   db.collection('chat').doc(user.docs[0].data().chatid).onSnapshot((querySnapshot) => {
     
  //       let haha = []
  //       querySnapshot.data().messages.forEach(l => {
  //        let lol= (l.createdAt.seconds * 1000)
  //        l.createdAt = lol
  //        haha.push(l)
  //       })
  //       this.setState({
  //         messages: haha
  //       })
  //   })
  // }
 
  // onSend(messages = []) {
  //   this.setState(previousState => ({
  //     messages: GiftedChat.append(previousState.messages, messages),
  //   }), () => {
  //     db.collection('chat').doc(this.state.chatId).update({
  //       messages: this.state.messages
  //     })
  //   })

  // }
 
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(2, 2, 2)' }}>
        {this.state.page === 1 && (
          <>
          <Header style={{ height: 50, backgroundColor: 'white',}}>
            <Text style={{ fontSize: 23, fontWeight: '500', marginBottom: 6 , color: '#231942'}}>
                My Groups
            </Text>
          </Header>
          <FlatList
          keyExtractor={(item, index) => 'key'+index}
          data={this.state.chats}
          renderItem={({ item }) => <TouchableHighlight underlayColor="#ffffff00" onPress={() => this.clickedGroup(item.chatid)}>
           <SingleGroup data={item}/>
          </TouchableHighlight>}
        />
        </>
        )}
       {this.state.page === 2 && <Room chatid={this.state.chatId} setReady={this.setReady} backPage={this.backPage} />}
      </View>
    
    )
  }
}

const mapStatetoProps = (state) => ({
  userid: state.Users.userInfo._id,
  userInfo: state.Users.userInfo
})

export default connect(mapStatetoProps)(Friend)