import React, { Component } from 'react'
import { SafeAreaView, View, Animated, Text, Dimensions, ScrollView, TouchableHighlight, AsyncStorage } from 'react-native'
import { Content, Container, Header, Button, ActionSheet, Root } from 'native-base'
import s from '../style'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { connect } from 'react-redux'
import { getUserData, getAllUser } from '../store/actions/UsersAction'
const { height, width } = Dimensions.get('window')
import { db } from '../api/firestore'
import { LinearGradient } from 'expo'
import { Location } from 'expo'

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
import PendingRequest from '../screens/PendingHangout'

//ACTION SHEET
var BUTTONS = ["AtoZ", "RoundTrip","Straight","Cancel"]
var DESTRUCTIVE_INDEX = 3
var CANCEL_INDEX = 4

class Home extends Component {
    _draggedValue = new Animated.Value(120)

    state = {
        status: true,
        page: 1,
        inviteFriends: false,
        friendsList: [],
        cat: 'food',
        showPanel: true,
        members: [],
        destinationList: [],
        permission: '',
        chatid: '',
        friendsListDef: [],
        clicked: '',
        typeTrip:'',
        groupTravel: {}
    }

    componentDidMount = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            await this.props.getUserData(token)
            await this.props.getAllUser(token)
            // await AsyncStorage.removeItem('token')
            this.setState({
                friendsList: this.props.userInfo.friends,
                // friendsListDef: this.props.userInfo.friends
            })
        } catch (error) {
            console.log(error)
        }
    }

    addMember = (input, i) => {
        let temp = [...this.state.friendsList]
        temp.splice(i, 1)
        this.setState({
            members: this.state.members.concat(input),
            friendsList: temp
        })
    }

    removeMem = (el, i) => {
        let temp = [...this.state.members]
        temp.splice(i, 1)
        // alert(JSON.stringify(a))
        if (i === 0 && temp.length === 0) {
            this.setState({
                members: []
            })
        } else {
            let heh = [...this.state.friendsList]
            // alert(JSON.stringify(el))
            this.setState({
                members: temp,
                // friendsList: this.state.friendsList.concat(a[0])
            })
        }
    }

    toPage1 = () => {
        this.setState({
            page: 1
        })
    }

    toPageFriends = () => {
        this.setState({
            inviteFriends: !this.state.inviteFriends
        })
    }

    toPageRecom = () => {
        if (!this.props.originCity) {
            alert(`destination can't be empty`)
        } else {
            this.setState({
                page: 2,
                inviteFriends: false
            })
        }
    }

    toPageDetail = (cat) => {
        //logic detail sini woy
        this.setState({
            page: 3,
            cat
        })
    }

    toPageMap = async () => {
        console.log('THIS')
        // this.setState({
        //     page: 4,
        //     showPanel: false,
        //     inviteFriends: false
        // })
    }
    
    showOp = async () => {
        if(this.state.groupTravel.state) {
            alert('Invitation sent!')
            const permisstionStatus = await Location.hasServicesEnabledAsync()
            if(permisstionStatus) {
                const chat = await db.collection('chat').add({
                    createdAt: new Date(),
                    messages: [],
                    route: {},
                    pending: this.state.members,
                    accept: [this.props.userInfo],
                    status: false,
                    type: 'travel',
                    places : this.props.destinationList
                })
                this.setState({chatid: chat.id})
                const createGroup = this.state.members.map(member => {
                    db.collection('users').add({
                        chatid: chat.id,
                        id: member._id,
                        status: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        user: member,
                        lat:null,
                        long: null,
                        status: false,
                        members: this.state.members.concat(this.props.userInfo)
                    })
                })
                let location = await Location.getCurrentPositionAsync({})
                createGroup.push(
                    db.collection('users').add({
                        chatid: chat.id,
                        id: this.props.userInfo._id,
                        user: this.props.userInfo,
                        status: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        lat: location.coords.latitude,
                        long: location.coords.longitude,
                        members: this.state.members.concat(this.props.userInfo)
                    })
                )
                await Promise.all(createGroup)
                this.setState({
                    status: true,
                    page: 1,
                    inviteFriends: true,
                    showPanel: true,
                    members: [],
                    // destinationList: [],
                    permission: '',
                    chatid: ''
                })
                this.props.navigation.navigate('Friend')
            } else {
                
            }

        } else {
            ActionSheet.show({
                options: ['Point to point', 'Round Trip','Straightest Line', 'cancel'],
                cancelButtonIndex: 3,
                title: 'route options'
            }, 
            buttonIndex => {
                this.setState({
                    typeTrip: BUTTONS[buttonIndex]
                }, () => {
                    this.setState({
                        page: 4,
                        showPanel: false,
                        inviteFriends: false
                    })
                })
            })

        }
    }


    setShowPanel = (payload) => {
        this.setState({
            showPanel: payload
        })
    }

    createGroup = async (type) => {
        if(type === "hangout") {
            alert('Invitation sent!')
            const permisstionStatus = await Location.hasServicesEnabledAsync()
            if(permisstionStatus) {
                const chat = await db.collection('chat').add({
                    createdAt: new Date(),
                    messages: [],
                    route: {},
                    pending: this.state.members,
                    accept: [this.props.userInfo],
                    status: false,
                    type: type
                })
                this.setState({chatid: chat.id})
                const createGroup = this.state.members.map(member => {
                    db.collection('users').add({
                        chatid: chat.id,
                        id: member._id,
                        status: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        user: member,
                        lat:null,
                        long: null,
                        status: false,
                        members: this.state.members.concat(this.props.userInfo)
                    })
                })
                let location = await Location.getCurrentPositionAsync({})
                createGroup.push(
                    db.collection('users').add({
                        chatid: chat.id,
                        id: this.props.userInfo._id,
                        user: this.props.userInfo,
                        status: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        lat: location.coords.latitude,
                        long: location.coords.longitude,
                        members: this.state.members.concat(this.props.userInfo)
                    })
                )
                await Promise.all(createGroup)
                this.setState({
                    status: true,
                    page: 1,
                    inviteFriends: true,
                    // friendsList: [], 
                    //friend list g usah dikosongin
                    showPanel: true,
                    members: [],
                    destinationList: [],
                    permission: '',
                    chatid: ''
                })
            } else {
    
            }

        } else {
            this.setState({
                groupTravel: {state: true}
            }, () => {
                this.setState({
                    page: 2,
                    inviteFriends: false
                })
            })
        }
    }

    render() {
        const draggedValue = this._draggedValue.interpolate({
            inputRange: [120, height / 1.75],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
        const transform = [{ scale: draggedValue }]
        let { status, page, inviteFriends, friendsList, cat, showPanel, members } = this.state
        let { destinationList, myList } = this.props

        return (
            <Root>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <Content style={{ backgroundColor: 'rgb(255, 190, 30)'}}>
                        {
                            page === 1 && !inviteFriends && <View style={{ flex: 1, marginTop: 200, backgroundColor: 'white', marginHorizontal: 8, shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 7, }}><SearchHead inviteFriends={true} toPageFriends={this.toPageFriends} /></View> 
                            
                        }
                        {
                            page === 1 && inviteFriends &&  <View style={{ flex: 1, marginHorizontal: 8, shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 7, }}><SearchHead toPageFriends={this.toPageFriends} /></View> 
                        }

                        {
                            inviteFriends && <View>
                                <AddMem members={members} removeMem={this.removeMem} />
                            </View>
                        }
                        {
                            ((!inviteFriends && page === 1) || (members.length === 0 && page === 1)) ? <View style={{ alignSelf: 'flex-end', height: 60, marginTop: 20 }}>
                                <Button onPress={this.toPageRecom} style={{ backgroundColor: 'black', marginRight: 20, width: 60, justifyContent: 'center', alignSelf: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 22 }}>
                                        Go
                        </Text>
                                </Button>
                            </View> : (inviteFriends && page === 1) ? <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <View style={{ alignSelf: 'flex-end', height: 60, marginTop: 20 }}>
                                    <Button onPress={() =>this.createGroup('hangout')} style={{ backgroundColor: 'black', marginRight: 20, width: 90, justifyContent: 'center' }}>
                                        <Text style={{ color: 'white', fontSize: 22, textAlign: 'center' }}>
                                            Hangout
                                        </Text>
                                    </Button>
                                </View>
                                <View style={{ alignSelf: 'flex-end', height: 60, marginTop: 20 }}>
                                    <Button onPress={() =>this.createGroup('travel')}style={{ backgroundColor: 'black', marginRight: 20, width: 70, justifyContent: 'center' }}>
                                        <Text style={{ color: 'white', fontSize: 22 }}>
                                            Travel
                                        </Text>
                                    </Button>
                                </View>
                            </View> : null
                        }

                        {
                            inviteFriends && <View style={{ backgroundColor: 'rgb(250, 250, 250)', shadowColor: 'grey', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 10, marginHorizontal: 5 }}>
                                <View style={{ borderBottomColor: 'rgb(242, 180, 30)', borderBottomWidth: 4}}>
                                    <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: '500', marginBottom: 5, color: 'black' }}>
                                        My friends
                                    </Text>
                                </View>
                                <ScrollView style={{ minHeight: 50 }}>
                                    {
                                        this.state.friendsList.map((el, i) => {
                                            if (el.UserId2._id === this.props.userInfo._id) {
                                                return <TouchableHighlight underlayColor="#ffffff00" key={i} onPress={() => this.addMember(el.UserId1, i)}>
                                                    <SingleFriend icon="no" data={el.UserId1} />
                                                </TouchableHighlight>
                                            } else {
                                                return <TouchableHighlight underlayColor="#ffffff00" key={i} onPress={() => this.addMember(el.UserId2, i)}>
                                                    <SingleFriend icon="no" data={el.UserId2} />
                                                </TouchableHighlight>
                                            }
                                        })
                                    }
                                </ScrollView>
                            </View>
                        }
                        {
                            page === 2 && <Recom toPage1={this.toPage1} toPageDetail={this.toPageDetail} setShowPanel={this.setShowPanel} groupTravel={this.state.groupTravel}  />
                        }
                        {
                            page === 3 && <View style={{ backgroundColor: 'white'}}><DetailCat toPageRecom={this.toPageRecom} cat={cat} /></View>
                        }
                        {
                            (destinationList[0] && showPanel) && <SlidingUpPanel
                                showBackdrop={false}
                                draggableRange={{ top: height / 1.10, bottom: 180 }}
                                animatedValue={this._draggedValue}>
                                <View style={s.panel}>
                                    <Animated.View style={[s.favoriteIcon, { transform }]}>
                                        <Text style={{ textAlign: 'center', fontSize: 23 }}> {destinationList.length} </Text>
                                    </Animated.View>
                                    <View>
                                        {
                                            destinationList[0] && destinationList.map((el, i) => {
                                                if (i <= 6) {
                                                    return <SinglePlace key={i} data={el} type="close" />
                                                }
                                            })
                                        }
                                    </View>
                                    <View style={{ alignSelf: 'flex-end', height: 60, marginTop: 10 }}>
                                        <Button onPress={this.showOp} style={{ backgroundColor: 'rgb(255, 190, 30)', marginRight: 20, width: 90, justifyContent: 'center', shadowColor: 'rgb(209, 152, 12)', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4, }}>
                                            <Text style={{ color: 'white', fontSize: 21 }}>
                                                Lets go!
                                            </Text>
                                        </Button>
                                    </View>
                                </View>
                            </SlidingUpPanel>
                        }
                        {
                            page === 4 && <View style={{ flex: 1, height: 800 }}>
                                <RouteOp typeTrip={this.state.typeTrip} toPageRecom={this.toPageRecom}/>
                            </View>
                        }
                        {
                            page === 5 && <View style={{ flex: 1 }}>
                                <PendingRequest chatid={this.state.chatid}/>
                            </View>
                        }

                    </Content>
            </SafeAreaView>
            </Root>
        )
    }
}


const mapDispatchToProps = (dispatch) => ({
    getUserData: (token) => (dispatch(getUserData(token))),
    getAllUser: (token) => (dispatch(getAllUser(token))),
    

})


const mapStateToProps = (state) => ({
    isLoggedIn: state.Users.isLoggedIn,
    errors: state.Users.errors,
    userInfo: state.Users.userInfo,
    myList: state.Users.myList,
    originCity: state.Meetup.originCity,
    destinationList: state.Meetup.destinationList,
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
