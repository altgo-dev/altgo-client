import React, { Component } from 'react'
import { View, SafeAreaView, TouchableHighlight, Text, TextInput, Image, AsyncStorage} from 'react-native'
import { Container, Header, Content, Form, Item, Input, Button } from 'native-base';

import s from '../style'
import { connect } from 'react-redux'
import { LinearGradient } from 'expo'
//actions
import { login } from '../store/actions/UsersAction'
import logo from '../assets/algo.png'

class SignIn extends Component {

    componentDidMount = async () => {
        try {
            const value = await AsyncStorage.getItem('token')
            if (value) {
                this.props.navigation.navigate('Home')
            }
        } catch (error) {
        }
    }

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
            this.setState({ errors: this.props.errors })
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
            <SafeAreaView style={{ flex: 1 , justifyContent: 'center', }}>
                <LinearGradient colors={['orange', '#ff0a6c', 'red']} style={{ flex: 1}}>

                <View style={{ backgroundColor: 'rgba(96, 37, 18, 0.6)', height: 370, marginHorizontal: 10, borderRadius: 20, padding: 10, marginTop: 180}}>

                <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginHorizontal: 15, marginVertical: 20 }}>
                    <Image style={{ height: 78, width: 350}} source={logo} />
                    {/* ERROR MESSAGE */}
                    <Text style={{ fontSize: 15, textAlign: 'center', color: 'red' }}>{this.props.errors ? this.props.errors.message : null}</Text>
                    <Item style={{borderBottomWidth: 0, backgroundColor: 'rgba(245, 245, 245, 0.4)', borderRadius: 10 }} >
                        <Input style={{ color: 'white' }} onChangeText={(email) => this.setState({ email })} placeholderTextColor="white" placeholder="Email"  />
                    </Item>
                    <Item last style={{ marginTop: 10, borderBottomWidth: 0, backgroundColor: 'rgba(245, 245, 245, 0.4)', borderRadius: 10}} >
                        <Input style={{ color: 'white' }} onChangeText={(password) => this.setState({ password })} placeholderTextColor="white" placeholder="Password" secureTextEntry />
                    </Item>
                </View>

                <View style={{ height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 14, color: 'lightgrey' }}>
                        Don't have an account yet?
                </Text>
                    <TouchableHighlight onPress={() => this.register()}>
                        <Text style={{ textAlign: 'center', fontSize: 14, color: 'blue', fontWeight: '400' }}>
                            Register Here
                    </Text>
                    </TouchableHighlight>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row' }}>
                    <Button onPress={this.login} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 15, backgroundColor: 'rgb(255, 190, 10)', borderRadius: 30 }}>
                        <Text style={{ color: 'white', fontSize: 24, fontWeight: '500'}}>Login</Text>
                    </Button>
                </View>

                </View>
                </LinearGradient>

            </SafeAreaView>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    login: (userInfo) => (dispatch(login(userInfo)))
})

const mapStateToProps = (state) => ({
    isLoggedIn: state.Users.isLoggedIn,
    errors: state.Users.errors,
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
