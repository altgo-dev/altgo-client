import React, { Component } from 'react'
import { SafeAreaView, View, Animated, Dimensions, ScrollView } from 'react-native'
import { Content, Container, Header, Text } from 'native-base'
import s from '../style'
import SlidingUpPanel from 'rn-sliding-up-panel'
const {height, width} = Dimensions.get('window')

//COMPONENTS
import ResList from '../components/ResList'
import MyMap from '../components/MyMap'
import SearchHead from '../components/SearchHead'

export default class Home extends Component {
    _draggedValue = new Animated.Value(120)

    state = {
        status: true
    }

  render() {
    const draggedValue = this._draggedValue.interpolate({
        inputRange: [120, height/1.75],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      })
    const transform = [{scale: draggedValue}]
    let { status } = this.state
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container style={{ flex: 1, flexDirection: 'column' }}>
                <Content>
                    <SearchHead />
                    <MyMap />

                    {
                        status &&
                        <SlidingUpPanel
                            showBackdrop={false}
                            draggableRange={{top: height / 1.10, bottom: 100}}
                            animatedValue={this._draggedValue}>
                            <View style={s.panel}>
                                <Animated.View style={[s.favoriteIcon, {transform}]}>
                                    {/* <Image
                                        source={require('./favorite_white.png')}
                                        style={{width: 32, height: 32}}
                                    /> */}
                                    <Text> hahaha </Text>
                                </Animated.View>
                                <View style={s.container}>
                                    <ResList />
                                </View>
                            </View>
                        </SlidingUpPanel>
                    }
                   
                </Content>
            </Container>
        </SafeAreaView>
    )
  }
}