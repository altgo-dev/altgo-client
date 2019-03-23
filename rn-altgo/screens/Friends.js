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

  toOnTrip = () => {
    this.setState({
      status: 'onTrip'
    })
  }


  render() {
    return (
      <SafeAreaView style={{ flex: 1}}>
        <Container style={s.Friend}>
          {
            this.state.status === 'chat' && <ChatRoom />
          }
        </Container>
      </SafeAreaView>
    )
  }
}
