import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Header, Icon, Left, Right } from 'native-base'
import SinglePlace from './SinglePlace'
import axios from 'axios'

export default class DetailCat extends Component {
  state = {
    list: [1, 1, 1, 1, 1, 1, 1],
    recomendationsResponse: { results: [] }
  }

  getList = async () => {
    try {
      let response = await axios({
        baseURL: 'http://h8-p2-portocombo1.app.dev.arieseptian.com',
        url: '/recommendations',
        method: 'POST',
        data: {
          type: this.props.cat,
          city: 'jakarta'
        }
      })
      this.setState({
        recomendationsResponse: response.data
      })
      console.log(response.data.results[0])
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
