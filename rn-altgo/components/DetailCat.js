import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Header, Icon, Left, Right } from 'native-base'
import SinglePlace from './SinglePlace'
import axios from 'axios'
import { connect } from 'react-redux'

class DetailCat extends Component {
  state = {
    list: [1, 1, 1, 1, 1, 1, 1],
    recomendationsResponse: { results: [] }
  }

  getList = async () => {
    // alert(this.props.cat)
    try {
      let result = {}
      let arrResult = []

      if (this.props.cat == 'attraction') {
        let response1 = await axios({
          baseURL: 'http://h8-p2-portocombo1.app.dev.arieseptian.com',
          url: '/recommendations',
          method: 'POST',
          data: {
            type: 'amusement_park',
            city: this.props.originCity
          }
        })

        let response2 = await axios({
          baseURL: 'http://h8-p2-portocombo1.app.dev.arieseptian.com',
          url: '/recommendations',
          method: 'POST',
          data: {
            type: 'park',
            city: this.props.originCity
          }
        })

        let response3 = await axios({
          baseURL: 'http://h8-p2-portocombo1.app.dev.arieseptian.com',
          url: '/recommendations',
          method: 'POST',
          data: {
            type: 'night_club',
            city: this.props.originCity
          }
        })

        arrResult = response1.data.results.concat(response2.data.results).concat(response3.data.results)
        // .concat(response2.data.results)
        result = { results: arrResult }

      } else if (this.props.cat === 'lifestyle') {
        let response1 = await axios({
          baseURL: 'http://h8-p2-portocombo1.app.dev.arieseptian.com',
          url: '/recommendations',
          method: 'POST',
          data: {
            type: 'shopping_mall',
            city: this.props.originCity
          }
        })

        let response2 = await axios({
          baseURL: 'http://h8-p2-portocombo1.app.dev.arieseptian.com',
          url: '/recommendations',
          method: 'POST',
          data: {
            type: 'movie_theater',
            city: this.props.originCity
          }
        })

        let response3 = await axios({
          baseURL: 'http://h8-p2-portocombo1.app.dev.arieseptian.com',
          url: '/recommendations',
          method: 'POST',
          data: {
            type: 'gym',
            city: this.props.originCity
          }
        })

        arrResult = response1.data.results.concat(response2.data.results).concat(response3.data.results)
        // .concat(response2.data.results)
        result = { results: arrResult }
      } else {
        let response = await axios({
          baseURL: 'http://h8-p2-portocombo1.app.dev.arieseptian.com',
          url: '/recommendations',
          method: 'POST',
          data: {
            type: this.props.cat,
            city: this.props.originCity
          }
        })
        result = response.data
      }


      this.setState({
        recomendationsResponse: result
      })
    } catch (err) {
      alert(JSON.stringify(err.data))
    }
  }

  componentDidMount() {
    this.getList()
  }

  render() {
    let { list, recomendationsResponse } = this.state
    return (
      <View>
        <Header style={{ height: 60 }}>
          <Left>
            <TouchableHighlight onPress={this.props.toPageRecom}>
              <Icon name="arrow-back" />
            </TouchableHighlight>
          </Left>
          <Text style={{ fontSize: 24, fontWeight: '500' }}>
            {this.props.cat}
          </Text>
          <Right></Right>
        </Header>
        {
          recomendationsResponse.results.map((el, i) => <SinglePlace type="ios-add" key={i} data={el} />)
        }
      </View>
    )
  }
}

const mapStateToprops = (state) => ({
  originCity: state.Meetup.originCity
})

export default connect(mapStateToprops, null)(DetailCat)
