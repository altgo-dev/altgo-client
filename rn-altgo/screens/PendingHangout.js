import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableHighlight, Image } from 'react-native'
import { connect } from 'react-redux'
import { Header, Icon, Content, Container, DeckSwiper, Card, CardItem, Thumbnail, Left, Body, Button } from 'native-base'
import { db } from '../api/firestore'

class PendingHangout extends Component {
  state = {
    invitations: [],
    cards: [
      {
        member: [
          {
            name: 'haha',
            img: 'https://edit.co.uk/uploads/2016/12/Image-1-Alternatives-to-stock-photography-Thinkstock.jpg'
          },
          {
            name: 'haha',
            img: 'https://edit.co.uk/uploads/2016/12/Image-1-Alternatives-to-stock-photography-Thinkstock.jpg'
          },
          {
            name: 'haha',
            img: 'https://edit.co.uk/uploads/2016/12/Image-1-Alternatives-to-stock-photography-Thinkstock.jpg'
          }
        ]
      },
      {
        member: [
          {
            name: 'haha',
            img: 'https://edit.co.uk/uploads/2016/12/Image-1-Alternatives-to-stock-photography-Thinkstock.jpg'
          },
          {
            name: 'haha',
            img: 'https://edit.co.uk/uploads/2016/12/Image-1-Alternatives-to-stock-photography-Thinkstock.jpg'
          },
          {
            name: 'haha',
            img: 'https://edit.co.uk/uploads/2016/12/Image-1-Alternatives-to-stock-photography-Thinkstock.jpg'
          }
        ]
      },
      {
        member: [
          {
            name: 'haha',
            img: 'https://edit.co.uk/uploads/2016/12/Image-1-Alternatives-to-stock-photography-Thinkstock.jpg'
          },
          {
            name: 'haha',
            img: 'https://edit.co.uk/uploads/2016/12/Image-1-Alternatives-to-stock-photography-Thinkstock.jpg'
          },
          {
            name: 'haha',
            img: 'https://edit.co.uk/uploads/2016/12/Image-1-Alternatives-to-stock-photography-Thinkstock.jpg'
          }
        ]
      },
    ]
  }

  acceptInvitation = (id, input) => {
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

  componentDidMount = async () => {
    await db.collection('users').where('id', '==', this.props.userInfo._id).where('status', '==', false).onSnapshot(querSnapshot => {
      let result = []
      querSnapshot.docs.forEach(doc => {
        let obj = {id: doc.id, ...doc.data() }
        result.push(obj)
      })
      this.setState({
        invitations: result
      }, () => {
        console.log(this.state.invitations)
      })
    })
  }
  render() {
    let { cards } = this.state
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
        <View style={{ flex: 1}}>

          <DeckSwiper
            dataSource={cards}
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
            

                <CardItem style={{ flex: 1, justifyContent: 'flex-end'}}>
                  <Button style={{ width: 70, justifyContent: 'center', margin: 5 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
                      Accept
                    </Text>
                  </Button>

                  {/* <Button style={{ width: 70, justifyContent: 'center', margin: 5 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
                      Reject
                    </Text>
                  </Button> */}

                </CardItem>

              </Card>
            }
          />

        </View>
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

