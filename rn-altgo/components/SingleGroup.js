import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Thumbnail, Left, Body, Right, CardItem, Icon } from 'native-base'
import { connect } from 'react-redux'



//ASSETS
import noUser from '../assets/nouser.png'

class SingleGroup extends Component {
    onPress = () => {
        
    }

    render() {
        const { data } = this.props
        return (
            <CardItem style={{ margin: 0, padding: 0, backgroundColor: 'rgba(245, 245, 245, 0.5)' }}>
                <Left style={{ width: 80, flex: 0 }}>
                {
                    data && data.profilePicture ? <Thumbnail source={{ uri: data.profilePicture }} /> : <Thumbnail source={ noUser } />
                }
                </Left>
                <Body style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 18, fontWeight: '500' }}> Nama Semuanya </Text>
                    <Text style={{ color: 'grey', marginLeft: 4, fontWeight: '400' }}>

                    </Text>
                </Body>
                  <Right style={{ width: 30, flex: 0 }}>
                    <Icon onPress={this.onPress} style={{ fontSize: 28, color: 'black' }} name="send" />
                  </Right>
            </CardItem>
        )
    }
}
const mapStatetoProps = (state) => ({
    userid: state.Users.userInfo._id
})

// const mapDispatchToProps = (dispatch) => ({
//     addFriend: (friendId, friendName) => (dispatch(addFriend(friendId, friendName)))
// })

export default connect(mapStatetoProps, null)(SingleGroup)

