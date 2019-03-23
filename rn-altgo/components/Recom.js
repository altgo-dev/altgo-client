import React, { Component } from 'react'
import { Text, View, Image, FlatList, TouchableHighlight } from 'react-native'
import {} from 'native-base'
import s from '../style'
export default class Recom extends Component {
    state = {
        category: [{title: 'food'}, {title: 'museum'}, {title: 'c'}, { title: 'd'}, { title: 'e'}, { title: 'others'}]
    }

  render() {
    return (
      <View>
        <FlatList
             numColumns={2}
             keyExtractor={(item) => item.title}
            data={this.state.category}
            renderItem={({item}) =><TouchableHighlight onPress={() => this.props.toPageDetail(item.title)}>
                <Image style={s.catImg} key={item.title} source={{ uri: 'https://www.conversational.com/wp-content/uploads/2016/03/badstock4.jpg' }}/>
            </TouchableHighlight>}
        />
      </View>
    )
  }
}
