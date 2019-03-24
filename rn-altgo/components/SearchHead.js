import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Container, Header, Content, Item, Input, Label, Icon } from 'native-base';
import s from '../style'
import { connect } from 'react-redux'

//actions
import { setOriginCity } from '../store/actions/MeetupAction'

class SearchHead extends Component {
  state = {
    field: 1,
    destination: ''
  }

  onSearch = (destination) => {
    // var { destination } = this.state
    this.props.setOriginCity(destination)
  }

  render() {
    return (
      <View style={s.searchHead}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Item style={{ ...s.ml5, ...s.searhBox }}>
            <Input onChangeText={(destination) => { this.onSearch( destination ) }} style={{ ...s.textLight, color: 'white' }} placeholderTextColor="#dddddd" placeholder="Destination" />
          </Item>
          <TouchableHighlight>
            <Icon style={{ ...s.textLight, fontSize: 37, marginHorizontal: 25, marginTop: 8 }} name="search" />
          </TouchableHighlight>
        </View>
        <TouchableHighlight underlayColor="#ffffff00" onPress={this.props.toPageFriends}>
          <Text style={{ textAlign: 'center', color: 'white', marginTop: 30, fontWeight: '500' }}>
            Invite friends
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  setOriginCity: (destination) => (dispatch(setOriginCity(destination)))
})

export default connect(null, mapDispatchToProps)(SearchHead)
