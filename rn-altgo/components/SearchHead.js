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
        <Text style={{ fontWeight: '700', textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
          Where do you want to go?
        </Text>
        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 20 }}>
          <Item style={{ width: 250, marginTop: 8, marginBottom: 8}}>
            <Input onChangeText={(destination) => { this.onSearch( destination ) }} style={{ ...s.textLight, color: 'black', borderBottomColor: 'black', borderBottomWidth: 2, }} placeholderTextColor="rgb(50, 50, 50)" placeholder="City" />
          </Item>
          <TouchableHighlight>
            <Icon style={{ color: 'black', fontSize: 37, marginHorizontal: 25, marginTop: 20 }} name="search" />
          </TouchableHighlight>
        </View>
           <TouchableHighlight underlayColor="#ffffff00" onPress={this.props.toPageFriends} style={{ marginBottom: 20, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{ textAlign: 'center', color: 'grey', marginTop: 30, fontWeight: '500', backgroundColor: 'white', width: 100, margin: 5, padding: 5 }}>
            {
              this.props.inviteFriends ? 'Invite friends' : 'Go Alone'
            }
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
