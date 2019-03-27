import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableHighlight, Image } from 'react-native'
import { connect } from 'react-redux'
import { Header, Icon, Content, Container, DeckSwiper, Card, CardItem, Thumbnail, Left, Body, Button } from 'native-base'
import { db } from '../api/firestore'
import { Location } from 'expo'
import noMsg from '../assets/nomsg.png'

class PendingHangout extends Component {
  state = {
    cards: [],
    data : {},
    loading: false
  }

  acceptInvitation = async (id, input) => {
    const permisstionStatus = await Location.hasServicesEnabledAsync()
    if(permisstionStatus) {
      let location = await Location.getCurrentPositionAsync({})
      input.status = true
      input.lat = location.coords.latitude,
      input.long = location.coords.longitude
      db.collection('users').where('chatid', '==', 'id').update(
        input
      )
    }
  }

  swipeLeft = async () => {
    let cardShift = this.state.cards
    cardShift.shift()
    this.setState({
      cards: cardShift
    })
    let deck = this.deck._root.state
    // console.log(this.deck._root.state)
    const deleted = await db.collection('users').doc(deck.selectedItem.id).delete()
    let data = deck.selectedItem.data
    // console.log(data.pending, '=====')
    let result = data.pending.filter((user, index) => user._id !== this.props.userInfo._id)
    data.pending = result
    const updated = await db.collection('chat').doc(deck.selectedItem.chatid).update(data)
    //delet user id & chatid nya yg ini, trus update chat yang id nya itu
    
  }

  swipeRight = async () => {
    let cardShift = this.state.cards
    cardShift.shift()
    this.setState({
      cards: cardShift
    })
    let deck = this.deck._root.state
    const permisstionStatus = await Location.hasServicesEnabledAsync()
    if(permisstionStatus) {
      let location = await Location.getCurrentPositionAsync({})
      const updatedUser = await db.collection('users').doc(deck.selectedItem.id).update({
        lat: location.coords.latitude,
        long: location.coords.longitude,
        status: true
      })
      let data = deck.selectedItem.data
      let chatData = await db.collection('chat').doc(deck.selectedItem.chatid).get()
      chatData = chatData.data()
      chatData.pending = data.pending.filter((user, index) => {
        if(user._id == this.props.userInfo._id) {
          chatData.accept.push(user)
        }
        return user._id !== this.props.userInfo._id
      })
      const updatedChat = await db.collection('chat').doc(deck.selectedItem.chatid).update(chatData)
    }
    //isi lat long, user id & chatid nya itu, updat chat yang id nya chat id jadi accept 
  }

  componentDidMount = async () => {
    // console.log( this.props.userInfo._id)
    const data = await db.collection('users').where('id', '==', this.props.userInfo._id).where('status', '==', false).get()
    let count = data.docs.length
    await data.docs.forEach(group => {
      let member = []
     db.collection('chat').doc(group.data().chatid).onSnapshot(querySnapshot => {
      count--
      member = [] 
         querySnapshot.data().pending.forEach(user => {
          let objMember= {
            name: user.name,
            email: user.email,
            img: user.profilePicture,
            status: 'pending'
          }
          member.push(objMember)
        })
         querySnapshot.data().accept.forEach(user => {
          let objMember= {
            name: user.name,
            email: user.email,
            img: user.profilePicture,
            status: 'accept'
          }
          member.push(objMember)
        })
        let obj = {member: member, chatid: group.data().chatid, id:group.id, data:querySnapshot.data()}
        this.setState({
          data: {...this.state.data, [group.id]: obj} //userID di firestore
        }, () => {
          if(count == 0) {
            let array = []
            for(let i in this.state.data) {
              let obj = {id: this.state.data[i].id, member: this.state.data[i].member, chatid: this.state.data[i].chatid, data: this.state.data[i].data}
              array.push(obj)
            }
            if(array.length) {
              this.setState({
                cards: array,
                loading: true
              }, () => {
                // console.log(this.state.cards, '=====')
              })
            }
          }
        })
      })
    })
  }
  render() {
    let { cards } = this.state
    let checkMsg = () => {
      if (cards.length === 0) {
        return (
          <>
            <Image source={noMsg} style={{ height: 550, width: 390 }}/>
          </>
        )
      }
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header transparent style={{ height: 50, paddingTop: 5, borderBottomWidth: 2, borderBottomColor: '#eaeaea'}}>
          <TouchableHighlight underlayColor="#ffffff00" onPress={() => this.props.navigation.navigate('Profile')}>
              <Icon name="arrow-back" style={{ color: 'grey', marginTop: 8 }}/>
          </TouchableHighlight>
          <Content>
              <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 20, fontWeight: '400' }}>
                  Pending Invitation
              </Text>
          </Content>
        </Header>
        {
          checkMsg()
        }
        {this.state.loading && (
          <View style={{ flex: 1}}>

          <DeckSwiper
            ref={(deck) => this.deck = deck}
            dataSource={cards}
            onSwipeLeft={this.swipeLeft}
            onSwipeRight={this.swipeRight}
            renderItem={item =>
              <Card style={{ elevation: 3 }}>
                {
                  item && item.member.map((el, i) => {
                    return  <CardItem key={i} style={{ flex: 1, flexDirection: 'row'}}>
                                <Thumbnail source={{ uri: el.img}} />
                                <Text style={{ fontSize: 19, fontWeight: '500', marginLeft: 8}}>
                                  { el.name }
                                </Text>
                            </CardItem>
                  })
                }
                {/* <CardItem style={{ flex: 1, justifyContent: 'flex-end'}}>
                  <Button style={{ width: 70, justifyContent: 'center', margin: 5 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
                      Accept
                    </Text>
                  </Button> */}
                  {/* <Button style={{ width: 70, justifyContent: 'center', margin: 5 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
                      Reject
                    </Text>
                  </Button> */}
                {/* </CardItem> */}
              </Card>
            }
          />

        </View>
        )}
      </SafeAreaView>
    )
  }
}



const mapDispatchToProps = (dispatch) => ({
  getUserData: (token) => (dispatch(getUserData(token)))
})

const mapStateToProps = (state) => ({
  userInfo: state.Users.userInfo
})

export default connect(mapStateToProps, mapDispatchToProps)(PendingHangout)

