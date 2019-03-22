import React, { Component } from 'react'
import { View, SafeAreaView, TouchableHighlight } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Button, Text, } from 'native-base';
import s from '../style'

export default class Regis extends Component {
    login = () => {
        this.props.navigation.navigate('Auth')
    }

    register = () => {
        this.props.navigation.navigate('Home')
    }

  render() {
    return (
        <SafeAreaView style={{ flex: 1}}>
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 120, marginHorizontal: 15 }}>
                <Text style={{ fontSize: 30 , textAlign: 'center'}}>Register</Text>
                <Item>
                    <Input placeholder="Email" />
                </Item>
                <Item last>
                    <Input placeholder="Password" secureTextEntry/>
                </Item>
            </View>
            <View style={{ height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{ textAlign: 'center', fontSize: 14 }}>
                    Don't have an account yet?
                </Text>
                <TouchableHighlight onPress={this.login}>
                    <Text style={{ textAlign: 'center', fontSize: 14, color: '#3378e8' }}>
                        Login Here
                    </Text>
                </TouchableHighlight>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row' }}>
                <Button onPress={this.register} dark style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 15 }}>
                    <Text>Register</Text>
                </Button>
            </View>
        </SafeAreaView>
    )
  }
}
