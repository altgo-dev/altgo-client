import React, { Component } from 'react'
import { Text, View, Image, FlatList, TouchableHighlight } from 'react-native'
import { Header, Left, Right, Icon, Input, Item } from 'native-base'
import s from '../style'
import ImageOverlay from "react-native-image-overlay";
import { connect } from 'react-redux'

//actions
import { autoComplete, addDestination } from '../store/actions/MeetupAction'

class Recom extends Component {
  state = {
    category: [
      { title: 'Restaurant', cat: 'restaurant', img: 'https://media.istockphoto.com/photos/caffee-on-table-and-blured-cafe-picture-id652628318?k=6&m=652628318&s=612x612&w=0&h=6K5ioW-NNIFD0WP9gwzPdJFc3bc178twHqzoOjV2k1w=', color: 'black' },
      { title: 'Museum', cat: 'museum', img: 'https://www.motionplaces.com/wp-content/uploads/2017/08/paris-night-timelapse-free-stock-1280x720.jpg', color: '#22467f' },
      { title: 'Hotel', cat: 'hotel', img: 'https://www.merakiva.com/wp-content/uploads/2016/09/Beautiful-sunset-view-from-pexels.jpg', color: '#78217c' },
      { title: 'Attraction', cat: 'attraction', img: 'https://i.pinimg.com/originals/a0/3d/4b/a03d4bf4d825267d6a20a28a5ed15469.jpg', color: '#217c57' },
      { title: 'LifeStyle', cat: 'lifestyle', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU9jrcsgN6IYyOyovQ-WKXFIF7Jhk6taP8FzNiGgG9v-Zz5QF8', color: '#7c5921' },
      { title: 'others', cat: 'others', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeg39e3IEuTQzt8QYTx56NhGMLju1WquZG-6-_5Pp-2PeKJB4n', color: '#822323' }]
  }

  onSearch = async (input) => {
    this.props.autoComplete(input)
  }

  onClickSearch = async (place) => {
    var objInput = {
      name: place.structured_formatting.main_text,
      vicinity: place.structured_formatting.secondary_text
    }

    var destination = this.props.destinationList
    destination.push(objInput)
    this.props.addDestination(destination)
    this.props.setShowPanel(true)
  }

  render() {
    return (
      <>
        <Header style={{ height: 30, paddingTop: 0, backgroundColor: 'white' }}>
          <Left>
            <TouchableHighlight onPress={this.props.toPage1}>
              <Icon name="arrow-back" />
            </TouchableHighlight>
          </Left>
          <Text style={{ fontSize: 24, fontWeight: '500' }}>
            {this.props.cat}
          </Text>
          <Right></Right>
        </Header>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <Item style={{ width: 250, justifyContent: 'center', marginLeft: 20 }}>
            <Input style={{ color: 'black', borderBottomColor: 'black', borderBottomWidth: 2, height: 35 }} onChangeText={(destination) => { this.onSearch(destination) }} placeholderTextColor="rgb(30, 30, 30)" placeholder="Destination" />
          </Item>
          <TouchableHighlight>
            <Icon style={{ fontSize: 37, marginHorizontal: 25, marginTop: 8, color: 'black' }} name="search" />
          </TouchableHighlight>
        </View>
        {
          this.props.autocompleteResult && this.props.autocompleteResult.map((each, index) => (<View key={index}>
            <TouchableHighlight onPress={() => this.onClickSearch(each)}>
              <Text style={{ textAlign: 'center', color: 'white', marginTop: 30, fontWeight: '500' }}>
                {each.description}
              </Text>
            </TouchableHighlight>
          </View>
          ))
        }
        <FlatList
          numColumns={2}
          keyExtractor={(item) => item.title}
          data={this.state.category}
          renderItem={({ item }) => <TouchableHighlight underlayColor="#ffffff00" onPress={() => this.props.toPageDetail(item.cat)}>
            <ImageOverlay title={item.title} titleStyle={{ fontSize: 25, fontWeight: '500' }} overlayColor={item.color} overlayAlpha={0.6} containerStyle={{ ...s.catImg, borderRadius: 10 }} source={{ uri: item.img }} />
          </TouchableHighlight>}
        />
      </>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  autoComplete: (input) => (dispatch(autoComplete(input))),
  addDestination: (destination) => (dispatch(addDestination(destination)))
})

const mapStateToProps = (state) => ({
  originCity: state.Meetup.originCity,
  autocompleteResult: state.Meetup.autocompleteResult,
  destinationList: state.Meetup.destinationList
})

export default connect(mapStateToProps, mapDispatchToProps)(Recom)
