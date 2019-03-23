import React, { Component } from 'react'
import { View, SafeAreaView, TouchableHighlight } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Button, Text, } from 'native-base';
import s from '../style'
import { connect } from 'react-redux'

//actions
import { login } from '../store/actions/UsersAction'

class SignIn extends Component {
    state = {
        password: '',
        email: '',
        isLoggedIn: this.props.isLoggedIn || false,
        errors: this.props.errors || {}
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.isLoggedIn !== this.props.isLoggedIn) {
            this.setState({ isLoggedIn: this.props.isLoggedIn })
            if (this.props.isLoggedIn) {
                this.props.navigation.navigate('Home')
            }
        }

        if (prevState.errors !== this.props.errors) {
            this.setState({ errors: this.props.errors})
        }

    }

    login = () => {
        var userInfo = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.login(userInfo)
    }

    register = () => {
        this.props.navigation.navigate('Regis')
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 120, marginHorizontal: 15 }}>
                    <Text style={{ fontSize: 30, textAlign: 'center' }}>Login</Text>
                    <Text style={{ fontSize: 15, textAlign: 'center', color: 'red' }}>{this.props.errors ? this.props.errors.message : null}</Text>
                    <Item>
                        <Input onChangeText={(email) => this.setState({ email })}  placeholder="Email" />
                    </Item>
                    <Item last>
                        <Input onChangeText={(password) => this.setState({ password })} placeholder="Password" secureTextEntry />
                    </Item>
                </View>
                <View style={{ height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
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

const mapDispatchToProps = (dispatch) => ({
    login: (userInfo) => (dispatch(login(userInfo)))
})

const mapStateToProps = (state) => ({
    isLoggedIn: state.Users.isLoggedIn,
    errors: state.Users.errors
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
