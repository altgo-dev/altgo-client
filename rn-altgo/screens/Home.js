import React, { Component } from 'react'
import { SafeAreaView, View, Animated, Text, Dimensions, ScrollView, TouchableHighlight, AsyncStorage } from 'react-native'
import { Content, Container, Header, Button } from 'native-base'
import s from '../style'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { connect } from 'react-redux'
import {getUserData, getAllUser } from '../store/actions/UsersAction'
const {height, width} = Dimensions.get('window')
import { db } from '../api/firestore'
import { LinearGradient } from 'expo'

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

class Home extends Component {
    _draggedValue = new Animated.Value(120)

    state = {
        status: true,
        page: 1,
        inviteFriends: false,
        friendsList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        myList: [{},1,1,1,1,1],
        cat: 'food',
        showPanel: false,
        members: [{}, {},],
    }

    componentDidMount = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            await this.props.getUserData(token)
            await this.props.getAllUser(token)
      
        } catch (error) {
            console.log(error)
        }
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

    toPage1 = () => {
        this.setState({
            page: 1
        })
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

            <Container >
                <LinearGradient colors={['black', '#1f1135', '#391f60', '#4c2982','#603f91', '#7b57af', '#B9ABCF']} style={{ flex: 1, flexDirection: 'column', backgroundColor: '#5E548E' }}>
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
                        <Button onPress={this.toPageRecom} style={{ backgroundColor: '#ebb903', marginRight: 20, width: 60, justifyContent: 'center', alignSelf: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 22}}>
                                Go
                            </Text>
                        </Button>
                    </View> : (inviteFriends && page ===1) ? <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <View style={{ alignSelf: 'flex-end', height: 60, marginTop: 20 }}>
                            <Button onPress={this.toPageMap} style={{ backgroundColor: '#ebb903', marginRight: 20, width: 90, justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 22, textAlign: 'center'}}>
                                    Hangout 
                                </Text>
                            </Button>
                        </View>
                        <View style={{ alignSelf: 'flex-end', height: 60, marginTop: 20 }}>
                            <Button onPress={this.toPageRecom} style={{ backgroundColor: '#ebb903', marginRight: 20, width: 70, justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 22}}>
                                    Travel
                                </Text>
                            </Button>
                        </View>
                        </View> : null
                    }
                   
                    {
                        inviteFriends && <View>
                                <View style={{ backgroundColor: 'rgba(245, 245, 245, 0.6)'}}>
                                    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '500', marginBottom: 5 }}>
                                        My friends
                                    </Text>
                                </View>
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
                        page === 2 && <Recom toPage1={this.toPage1} toPageDetail={this.toPageDetail }/>
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
                            <Button onPress={this.toPageMap} style={{ backgroundColor: '#ebb903', marginRight: 20 }}>
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
        </LinearGradient>
            </Container>
        </SafeAreaView>
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
    getUserData: (token) => (dispatch(getUserData(token))),
    getAllUser: (token) => (dispatch(getAllUser(token)))

})

const mapStateToProps = (state) => ({
    isLoggedIn: state.Users.isLoggedIn,
    errors: state.Users.errors,
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
