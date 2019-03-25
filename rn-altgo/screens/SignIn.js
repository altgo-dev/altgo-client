import React, { Component } from 'react'
import { View, SafeAreaView, TouchableHighlight, Text, TextInput, Image, AsyncStorage} from 'react-native'
import { Container, Header, Content, Form, Item, Input, Button, Toast, Root } from 'native-base';

import { connect } from 'react-redux'
import { LinearGradient } from 'expo'

//actions
import { login, setError } from '../store/actions/UsersAction'
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
        errors: this.props.errors || {},
        showToast: false

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.errors.message) {
            Toast.show({
                text: this.props.errors.message,
                duration: 3500,
                textStyle: { textAlign: 'center' }
              })

        }

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
        if( !this.state.email || !this.state.password) {
            this.props.setError({ message: 'All fields must be filled!' })
        } else {
            var userInfo = {
                email: this.state.email,
                password: this.state.password
            }
            this.props.login(userInfo)

        }
    }

    register = () => {
        this.props.navigation.navigate('Regis')
    }

    render() {
        return (
            <Root>
            <SafeAreaView style={{ flex: 1 , justifyContent: 'center',backgroundColor: 'rgb(255, 190, 30)' }}>
                <View style={{ backgroundColor: 'white', height: 370, marginHorizontal: 10, padding: 10, shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 7,}}>
                    <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginHorizontal: 15, }}>
                        <Image style={{ height: 78, width: 350}} source={logo} />
                        <Item style={{borderBottomWidth: 0, backgroundColor: 'rgba(246, 247, 249, 1)', borderRadius: 5 }} >
                            <Input style={{ color: 'black' }} onChangeText={(email) => this.setState({ email })} placeholderTextColor="rgba(0,0,0, 0.7)" placeholder="Email"  />
                        </Item>
                        <Item last style={{ marginTop: 10, borderBottomWidth: 0, backgroundColor: 'rgba(246, 247, 249, 1)', borderRadius: 5 }} >
                            <Input style={{ color: 'black' }} onChangeText={(password) => this.setState({ password })} placeholderTextColor="rgba(0,0,0, 0.7)" placeholder="Password" secureTextEntry />
                        </Item>
                    </View>

                    <View style={{ height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 14, color: 'grey' }}>
                            Don't have an account yet?
                    </Text>
                        <TouchableHighlight underlayColor="#ffffff00" onPress={() => this.register()}>
                            <Text style={{ textAlign: 'center', fontSize: 14, color: 'midnightblue', fontWeight: '400' }}>
                                Register Here
                        </Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row' }}>
                        <Button onPress={this.login} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 15, backgroundColor: 'black', borderRadius: 1 }}>
                            <Text style={{ color: 'white', fontSize: 24, fontWeight: '500'}}>Login</Text>
                        </Button>
                    </View>

                </View>
            </SafeAreaView>
            </Root>

        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    login: (userInfo) => (dispatch(login(userInfo))),
    setError: (err) => (dispatch(setError(err)))
})

const mapStateToProps = (state) => ({
    isLoggedIn: state.Users.isLoggedIn,
    errors: state.Users.errors,
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
