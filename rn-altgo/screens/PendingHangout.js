import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'

class PendingHangout extends Component {
  componentDidMount = () => {
    console.log(this.props.chatId)
  }
  render() {
    return (
      <SafeAreaView>
        <Text> textInComponent </Text>
      </SafeAreaView>
    )
  }
}



const mapDispatchToProps = (dispatch) => ({
  getUserData: (token) => (dispatch(getUserData(token)))
})

const mapStateToProps = (state) => ({
  userInfo: state.Users.userInfo
})

export default connect(mapStateToProps, mapDispatchToProps)(PendingHangout)

