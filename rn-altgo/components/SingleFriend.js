import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Thumbnail, Left, Body, Right, CardItem, Icon } from 'native-base'
import { connect } from 'react-redux'

<<<<<<< HEAD
export default class SingleFriend extends Component {
  render() {
    return (
        <CardItem style={{ margin: 0, padding: 0, backgroundColor: 'rgba(245, 245, 245, 0.5)' }}>
            <Left style={{ width: 80, flex: 0 }}>
                <Thumbnail source={{uri: 'https://st.depositphotos.com/2170303/2736/i/950/depositphotos_27361601-stock-photo-very-old-woman-showing-her.jpg'}}/>
            </Left>
            <Body style={{ marginTop: 4}}>
                <Text style={{ fontSize: 18, fontWeight: '500'}}> NAme </Text>
                <Text style={{ color: 'black', marginLeft: 4, fontWeight: '400'}}>
                    smaller desck abidh jndfui
                </Text>
            </Body>
            {/* {
                !this.props.icon && <Right style={{ width: 30, flex: 0 }}>
                    <Icon style={{ fontSize: 28, color: 'black' }} name="close"/>
                </Right>
            } */}
         
        </CardItem>
    )
  }
=======
//actions
import { addFriend } from '../store/actions/UsersAction'

class SingleFriend extends Component {
    onPress = () => {
        var friendId= this.props.data._id
        var friendName = this.props.data.name
        this.props.addFriend(friendId, friendName)
    }

    render() {
        const { data } = this.props
        return (
            <CardItem style={{ margin: 0, padding: 0, backgroundColor: 'rgba(245, 245, 245, 0.5)' }}>
                <Left style={{ width: 80, flex: 0 }}>
                    <Thumbnail source={{ uri: 'https://st.depositphotos.com/2170303/2736/i/950/depositphotos_27361601-stock-photo-very-old-woman-showing-her.jpg' }} />
                </Left>
                <Body style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 18, fontWeight: '500' }}> {data ? data.name : null} </Text>
                    <Text style={{ color: 'black', marginLeft: 4, fontWeight: '400' }}>
                        {data ? data.email : null}
                    </Text>
                </Body>
                {
                    !this.props.icon && <Right style={{ width: 30, flex: 0 }}>
                        <Icon onPress={this.onPress} style={{ fontSize: 28, color: 'black' }} name="add" />
                    </Right>
                }

            </CardItem>
        )
    }
>>>>>>> add friend
}

const mapDispatchToProps = (dispatch) => ({
    addFriend: (friendId, friendName) => (dispatch(addFriend(friendId, friendName)))
})

export default connect(null, mapDispatchToProps)(SingleFriend)
