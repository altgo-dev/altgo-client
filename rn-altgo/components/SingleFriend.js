import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Thumbnail, Left, Body, Right, CardItem, Icon } from 'native-base'
import { connect } from 'react-redux'

//actions
import { addFriend } from '../store/actions/UsersAction'
import Users from '../store/reducers/Users';

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
                    <Thumbnail source={{ uri: data.profilePicture }} />
                </Left>
                <Body style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 18, fontWeight: '500' }}> {data ? data.name : null} </Text>
                    <Text style={{ color: 'grey', marginLeft: 4, fontWeight: '400' }}>
                        { data && data.friends && data.friends.length !== 0 && data.friends.length + ' friends on altgo'} 
                    </Text>
                </Body>
                {
                    !this.props.icon && data && data.friends && data.friends.map((el, i) => el._id).indexOf(this.props.userid) === -1 && <Right style={{ width: 30, flex: 0 }}>
                        <Icon onPress={this.onPress} style={{ fontSize: 28, color: 'black' }} name="add" />
                    </Right>
                }

            </CardItem>
        )
    }
}
const mapStatetoProps = (state) => ({
    userid: state.Users.userInfo._id
})
const mapDispatchToProps = (dispatch) => ({
    addFriend: (friendId, friendName) => (dispatch(addFriend(friendId, friendName)))
})

export default connect(mapStatetoProps, mapDispatchToProps)(SingleFriend)
