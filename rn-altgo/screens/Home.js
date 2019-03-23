import React, { Component } from 'react'
import { SafeAreaView, View, Animated, Dimensions, ScrollView, TouchableHighlight } from 'react-native'
import { Content, Container, Header, Text, Button } from 'native-base'
import s from '../style'
import SlidingUpPanel from 'rn-sliding-up-panel'
const {height, width} = Dimensions.get('window')
import { db } from '../api/firestore'

//COMPONENTS
import ResList from '../components/ResList'
import MyMap from '../components/MyMap'
import SearchHead from '../components/SearchHead'
import AddMem from '../components/AddMem'
import SingleFriend from '../components/SingleFriend'
import Recom from '../components/Recom'
import DetailCat from '../components/DetailCat';
import SinglePlace from '../components/SinglePlace'
import RouteOp from './RouteOptimizer'

export default class Home extends Component {
    _draggedValue = new Animated.Value(120)

    state = {
        status: true,
        page: 1,
        inviteFriends: false,
        friendsList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        myList: [{},1,1,1,1,1],
        cat: 'food',
        showPanel: true,
        members: [{}, {},],
    }

    addMember = (input) => {
        console.log(input)
        //logic add friend disini
        // db.collection("chat").add({
        //     message: {},
        //     route: {}
        // })
        //     .then(doc => {

        //         console.log(doc)
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
        this.setState({
            members: this.state.members.concat(input)
        })
    }

    removeMem = (i) => {
        let temp = [...this.state.members]
        temp.splice(i, 1)
        if (i === 0 && temp.length === 0 ) {
            this.setState({
                members: []
            })
        } else {
            this.setState({
                members: temp
            })
        }
    }

    toPageFriends =() => {
        this.setState({
            inviteFriends: !this.state.inviteFriends
        })
    }

    toPageRecom = () => {
        this.setState({
            page: 2,
            inviteFriends: false
        })
    }

    toPageDetail = (cat) => {
        //logic detail sini woy
        this.setState({
            page: 3,
            cat
        })
    }

    toPageMap = () => {
        this.setState({
            page: 4,
            showPanel: false,
            inviteFriends: false
        })
    }

  render() {
    const draggedValue = this._draggedValue.interpolate({
        inputRange: [120, height/1.75],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      })
    const transform = [{scale: draggedValue}]
    let { status, page, inviteFriends, friendsList, myList, cat, showPanel, members } = this.state

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container style={{ flex: 1, flexDirection: 'column', backgroundColor: '#A2CCCD' }}>
                <Content>
                    {
                        page === 1 && <SearchHead toPageFriends={this.toPageFriends}/>
                    }
                   
                    {
                        inviteFriends && <View> 
                            <AddMem members={members} removeMem={this.removeMem} />
                            </View>
                    }
                    {
                        ((!inviteFriends && page === 1) || (members.length === 0 && page === 1)) ?   <View style={{ alignSelf: 'flex-end', height: 60, marginTop: 20 }}>
                        <Button onPress={this.toPageRecom} style={{ backgroundColor: 'teal', marginRight: 20 }}>
                            <Text>
                                Go
                            </Text>
                        </Button>
                    </View> : (inviteFriends && page ===1) ? <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <View style={{ alignSelf: 'flex-end', height: 60, marginTop: 20 }}>
                            <Button onPress={this.toPageMap} style={{ backgroundColor: 'teal', marginRight: 20 }}>
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
                    {
                        page === 3 && <DetailCat toPageRecom={this.toPageRecom} cat={cat}/>
                    }
                    {
                        (myList[0] && showPanel) &&  <SlidingUpPanel
                        showBackdrop={false}
                        draggableRange={{top: height / 1.10, bottom: 100}}
                        animatedValue={this._draggedValue}>
                        <View style={s.panel}>
                            <Animated.View style={[s.favoriteIcon, {transform}]}>
                                <Text style={{ textAlign: 'center', fontSize: 23}}> {myList.length} </Text>
                            </Animated.View>
                            <View>
                                {
                                    myList.map((el, i) => {
                                        if (i <= 6) {
                                            return <SinglePlace key={i} type="close"/> 
                                        } 
                                    })
                                }

                                <Text style={{ color: 'blue', marginLeft: 25}}>
                                    View More
                                </Text>

                            </View>
                            <View style={{ alignSelf: 'flex-end', height: 60, marginTop: 10 }}>
                            <Button onPress={this.toPageMap} style={{ backgroundColor: 'teal', marginRight: 20 }}>
                                <Text>
                                    Lets go!
                                </Text>
                            </Button>
                            </View>
                        </View>
                        </SlidingUpPanel>
                    }
                   {
                       page === 4 && <View style={{ flex: 1, height: 550}}>
                            <RouteOp />
                       </View> 
                   }
                   
                </Content>
            </Container>
        </SafeAreaView>
    )
  }
}