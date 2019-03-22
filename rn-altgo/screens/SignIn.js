import React, { Component } from 'react'
import { View, SafeAreaView, TouchableHighlight } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Button, Text, } from 'native-base';
import s from '../style'

export default class SignIn extends Component {
    login = () => {
        this.props.navigation.navigate('Home')
    }

    register = () => {
        this.props.navigation.navigate('Regis')
    }

  render() {
    return (
        <SafeAreaView style={{ flex: 1}}>
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 120, marginHorizontal: 15 }}>
                <Text style={{ fontSize: 30 , textAlign: 'center'}}>Login</Text>
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
                <TouchableHighlight onPress={() => this.register()}>
                    <Text style={{ textAlign: 'center', fontSize: 14, color: '#3378e8' }}>
                        Register Here
                    </Text>
                </TouchableHighlight>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row' }}>
                <Button onPress={this.login} dark style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 15 }}>
                    <Text>Login</Text>
                </Button>
            </View>
        </SafeAreaView>
    )
  }
}
