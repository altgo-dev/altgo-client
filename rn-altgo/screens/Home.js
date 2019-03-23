import React, { Component } from 'react'
import { SafeAreaView, View, Animated, Dimensions, ScrollView, TouchableHighlight } from 'react-native'
import { Content, Container, Header, Text, Button } from 'native-base'
import s from '../style'
import SlidingUpPanel from 'rn-sliding-up-panel'
const {height, width} = Dimensions.get('window')

//COMPONENTS
import ResList from '../components/ResList'
import MyMap from '../components/MyMap'
import SearchHead from '../components/SearchHead'
import AddMem from '../components/AddMem'
import SingleFriend from '../components/SingleFriend'
import Recom from '../components/Recom'
export default class Home extends Component {
    _draggedValue = new Animated.Value(120)

    state = {
        status: true,
        page: 2,
        inviteFriends: false,
        friendsList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    }

    toPageFriends =() => {
        this.setState({
            inviteFriends: !this.state.inviteFriends
        })
    }

    toPageRecom = () => {
        this.setState({
            page: 2
        })
    }

    toPageDetail = (cat) => {
        //logic detail sini woy
        this.setState({
            page: 3
        })
    }

  render() {
    const draggedValue = this._draggedValue.interpolate({
        inputRange: [120, height/1.75],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      })
    const transform = [{scale: draggedValue}]
    let { status, page, inviteFriends, friendsList } = this.state

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container style={{ flex: 1, flexDirection: 'column', backgroundColor: '#A2CCCD' }}>
                <Content>
                    {
                        page === 1 && <SearchHead toPageFriends={this.toPageFriends}/>
                    }
                   
                    {
                        inviteFriends && <View> 
                            <AddMem />
                            </View>
                    }
                    {
                        (!inviteFriends && page === 1) ?   <View style={{ alignSelf: 'flex-end', height: 60, marginTop: 20 }}>
                        <Button onPress={this.toPageRecom} style={{ backgroundColor: 'teal', marginRight: 20 }}>
                            <Text>
                                Go
                            </Text>
                        </Button>
                    </View> : (inviteFriends && page ===1) ? <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <View style={{ alignSelf: 'flex-end', height: 60, marginTop: 20 }}>
                            <Button onPress={this.createTrip} style={{ backgroundColor: 'teal', marginRight: 20 }}>
                                <Text>
                                    Hangout 
                                </Text>
                            </Button>
                        </View>
                        <View style={{ alignSelf: 'flex-end', height: 60, marginTop: 20 }}>
                            <Button onPress={this.toPageRecom} style={{ backgroundColor: 'teal', marginRight: 20 }}>
                                <Text>
                                    Travel
                                </Text>
                            </Button>
                        </View>
                    </View> : null
                    }
                   

                    {
                        inviteFriends && <View>
                                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '500', marginBottom: 5 }}>
                                    My friends
                                </Text>
                                <ScrollView style={{ height: 500}}>
                                    { friendsList[0] && this.state.friendsList.map((el, i) =>{
                                        return <TouchableHighlight  key={i} onPress={() => this.addMember(el)}>
                                            <SingleFriend icon={'no'}/>
                                        </TouchableHighlight>
                                    })
                                    }
                                </ScrollView>
                        </View> 
                    }
                    {
                        page === 2 && <Recom toPageDetail={this.toPageDetail }/>
                    }
                        {/* <SlidingUpPanel
                            showBackdrop={false}
                            draggableRange={{top: height / 1.10, bottom: 100}}
                            animatedValue={this._draggedValue}>
                            <View style={s.panel}>
                                <Animated.View style={[s.favoriteIcon, {transform}]}>
                                   
                                    <Text> hahaha </Text>
                                </Animated.View>
                                <View style={s.container}>
                                    <ResList />
                                </View>
                            </View>
                        </SlidingUpPanel> */}
                   
                </Content>
            </Container>
        </SafeAreaView>
    )
  }
}