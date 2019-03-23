import React, { Component } from 'react'
import { View, TouchableHighlight, Image, ScrollView } from 'react-native'
import { Thumbnail, Text, Icon, Left, Item, Input, Body, CardItem, Button, Right, Content } from 'native-base'
import s from '../style'
import SingleFriend from './SingleFriend'

export default class AddMem extends Component {
    state = {
        members: [{}, {},],
        friendsList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        tripName: ''
    }

    addMember = (input) => {
        //logic add friend disini
        this.setState({
            members: this.state.members.concat(input)
        })
    }

    removeMem = (i) => {
        let temp = [...this.state.members]
        temp.splice(i, 1)
        this.setState({
            members: temp
        })
    }

    createTrip = () => {
        //logic create trip disini 
        this.props.toChat()
    }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
            <Text style={{ fontSize: 32, fontWeight: '500', textAlign: 'center', marginTop: 5 }}>
                Plan trip
            </Text>
            <Item style={s.inputCenter}>
                <Input placeholder="Trip Name" />
            </Item>
            {
                this.state.members[0] && this.state.members.map((el, i) => {
                    return  <CardItem key={i}>
                    <Left>
                        <Thumbnail source={{ uri: 'https://www.conversational.com/wp-content/uploads/2016/03/badstock4.jpg' }}/>
                        <Text style={{ fontWeight: '500', fontSize: 20 }}> Vene (userny)</Text>
                    </Left>
                    {
                        i !== 0 && <Icon onPress={() => this.removeMem(i)} name='close' />
                    }
                </CardItem>
                })
            }
            <View style={{ alignSelf: 'flex-end', height: 60 }}>
                <Button onPress={this.createTrip} style={{ backgroundColor: 'black', marginRight: 20 }}>
                    <Text>
                        Go
                    </Text>
                </Button>
            </View>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '500', marginBottom: 5 }}>
                My friends
            </Text>
            
            <ScrollView style={{ height: 500}}>
                {
                    this.state.friendsList[0] && this.state.friendsList.map((el, i) =>{
                        return <TouchableHighlight  key={i} onPress={() => this.addMember(el)}>
                            <SingleFriend icon={'no'}/>
                        </TouchableHighlight>
                    })
                }
            </ScrollView>
        </ScrollView>
      </View>
    )
  }
}
