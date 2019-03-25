import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Container, Header, Content, Item, Input, Label, Icon } from 'native-base';
import s from '../style'
import { connect } from 'react-redux'

//actions
import { setOriginCity, autoComplete } from '../store/actions/MeetupAction'

class SearchHead extends Component {
  state = {
    field: 1,
    destination: '',
    autocompleteResult: []
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.autocompleteResult !== this.props.autocompleteResult){
      this.setState({autocompleteResult: this.props.autocompleteResult})
    }
  }

  onSearch = async (destination) => {
    // var { destination } = this.state
    this.props.setOriginCity(destination)
    // var input = destination
    // await this.props.autoComplete(input)
    // this.setState({autocompleteResult:this.props.autocompleteResult})
    // alert(destination)
  }

  render() {
    return (
      <View style={s.searchHead}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Item style={{ ...s.ml5, ...s.searhBox }}>
            <Input onChangeText={(destination) => { this.onSearch( destination ) }} style={{ ...s.textLight, color: 'white' }} placeholderTextColor="#dddddd" placeholder="City" />
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
        {this.props.autocompleteResult && this.props.autocompleteResult.map((each, index) =><Text key={index} style={{ textAlign: 'center', color: 'white', marginTop: 30, fontWeight: '500' }}>{each.description}</Text>)}
        
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  setOriginCity: (destination) => (dispatch(setOriginCity(destination))),
  autoComplete: (input) => (dispatch(autoComplete(input)))
})

const mapStateToProps = (state) => ({
  autocompleteResult: state.Meetup.autocompleteResult
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchHead)
