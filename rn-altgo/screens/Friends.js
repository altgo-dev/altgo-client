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
    ready: false,
    members: []
  }

  componentDidMount = async () => {
    db.collection('users').where('id', '==', this.props.userid).orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
      let allChats = []
      querySnapshot.forEach(doc => {
        let name=[]
        if(doc.data().members) {
          doc.data().members.forEach(member => {
            name.push(member.name)
          })
        }
        let obj = {id: doc.id, name:name  ,...doc.data()}
        allChats.push(obj)
      })
      this.setState({
              chats: allChats
            }, () => {
            })
    })
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
       {this.state.page === 2 && <Room chatid={this.state.chatId} setReady={this.setReady} navigation={this.props.navigation} backPage={this.backPage} />}
      </View>
    
    )
  }
}

const mapStatetoProps = (state) => ({
  userid: state.Users.userInfo._id,
  userInfo: state.Users.userInfo
})

export default connect(mapStatetoProps)(Friend)