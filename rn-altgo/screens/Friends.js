import React, { Component } from 'react'
import { Text, View, SafeAreaView } from 'react-native'
import { Container, Content} from 'native-base'
import s from '../style'

//COMPONENT
import AddMem from '../components/AddMem'
import ChatRoom from '../components/ChatRoom'
import FormPlace from '../components/FormPlace'

export default class Friends extends Component {
  // statusnya buat nentuin state pagenya udh ad group atau belum dll => group, chat, formPlace, ontrip (map)
  state = {
    grouped: true,
    status: 'chat'
  }

  componentDidMount () {
    //If buat ngecek udah ada group atau belom
  }

  toChatRoom = () => {
    this.setState({
      status: 'chat'
    })
  }

  toFormPlace = () => {
    this.setState({
      status: 'formPlace'
    })
  }

  toOnTrip = () => {
    this.setState({
      status: 'onTrip'
    })
  }

  toGroup = () => {
    this.setState({
      status: 'group'
    })
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1}}>
        <Container style={s.Friend}>
          {
            this.state.status === 'group' && <AddMem toChat={this.toChatRoom}/>
          }
          {
            this.state.status === 'chat' && <ChatRoom toForm={this.toFormPlace} toOnTrip={this.toOnTrip} toGroup={this.toGroup}/>
          }
          {
            this.state.status === 'formPlace' && <FormPlace toChat={this.toChatRoom}/>
          }
        </Container>
      </SafeAreaView>
    )
  }
}
