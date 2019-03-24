import React, { Component } from 'react'
import { Text, View, TouchableHighlight, SafeAreaView, ScrollView } from 'react-native'
import { Header, Left, Icon, Content, Right, Item, Input  } from 'native-base'
import SingleFriend from '../components/SingleFriend'
import s from '../style'
import { connect } from 'react-redux'

//screens
import { searchFriend } from '../store/actions/UsersAction'

class AddFriends extends Component {
    state = {
        data: [1, 2, 3, 4, 5, 6,2,3,4,54,5,6,7,8],
        email: ''
    }

    search = () => {
        let{ email } = this.state
        this.props.searchFriend(email)
    }

  render() {
      return (
          <SafeAreaView style={{ flex: 1 }}>
              <Header transparent style={{ height: 50, paddingTop: 5}}>
                    <Left>
                        <TouchableHighlight underlayColor="#ffffff00" onPress={() => this.props.navigation.navigate('Profile')}>
                            <Icon name="arrow-back"/>
                        </TouchableHighlight>
                    </Left>
                    <Content>
                        <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 20, fontWeight: '700' }}>
                            Add Friend
                        </Text>
                    </Content>
                    <Right>
                    </Right>
                </Header>

                <View style={{ minHeight: '100%'}}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Item style={s.inputEmailSearch}>
                            <Input onChangeText={(email) => {this.setState({email})} } placeholder="Email" returnKeyType="search"/>
                        </Item>
                        <Icon name="search" onPress={this.search} style={{marginTop: 8, marginLeft: 5, color: 'grey' }}/>
                    </View>
                    <View style={{ flex: 12 }}>

                        <View style={{ height: 30, backgroundColor: '#e8e8e8'}}>
                            <Text style={{ textAlign: 'center', marginVertical: 5}}>People you might know</Text>
                        </View>

                        <Content>
                            {
                                this.props.searchFriendResult.map((el, i) => <SingleFriend key={i} data={el} />)
                            }
                        </Content>
                    </View>
                </View>

          </SafeAreaView>
      )
  }
}

const mapDispatchToProps = (dispatch) => ({
    searchFriend : (email) => (dispatch(searchFriend(email)))
})

const mapStateToProps = (state) => ({
    searchFriendResult : state.Users.searchFriendResult
})

export default connect(mapStateToProps, mapDispatchToProps)(AddFriends)
