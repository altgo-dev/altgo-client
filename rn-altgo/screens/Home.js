import React, { Component } from 'react'
import { SafeAreaView, View } from 'react-native'
import MyMap from '../components/MyMap'
import { Content, Container, Header } from 'native-base'
import HeaderLoc from '../components/HeaderLoc'
import SlidingPanel from 'react-native-sliding-up-down-panels'

export default class Home extends Component {
  render() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container style={{ flex: 1, flexDirection: 'column' }}>
                {/* <SlidingPanel
                headerLayoutHeight = {100}
                headerLayout = { () =>
                    <View style={styles.headerLayoutStyle}>
                    <Text style={styles.commonTextStyle}>My Awesome sliding panel</Text>
                    </View>
                }
                slidingPanelLayout = { () =>
                    <View style={styles.slidingPanelLayoutStyle}>
                    <Text style={styles.commonTextStyle}>The best thing about me is you</Text>
                    </View>
                }
                /> */}
                <Content>
                <HeaderLoc />
                    <MyMap />
                </Content>
            </Container>
        </SafeAreaView>

    )
  }
}
