import React, { Component } from 'react'
import { View, SafeAreaView, TouchableHighlight, Text } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Button } from 'native-base';
import s from '../style'
import { connect } from 'react-redux'
import { ImagePicker, Camera, Permissions } from 'expo'

//actions
import { register } from '../store/actions/UsersAction'

class Regis extends Component {

    state = {
        name: '',
        password: '',
        email: '',
        isLoggedIn: this.props.isLoggedIn || false,
        image: '',
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted' })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.isLoggedIn !== this.props.isLoggedIn) {
            this.setState({ isLoggedIn: this.props.isLoggedIn })
            if (this.props.isLoggedIn) {
                this.props.navigation.navigate('Home')
            }
        }

    }

    login = () => {
        this.props.navigation.navigate('Auth')
    }

    register = () => {
        var userInfo = {
            email: this.state.email,
            name: this.state.name,
            password: this.state.password,
            image: this.state.image
        }
        this.props.register(userInfo)
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        })
        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    }

    render() {

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 120, marginHorizontal: 15 }}>
                    <Text style={{ fontSize: 30, textAlign: 'center' }}>Register</Text>
                    <Item>
                        <Input onChangeText={(name) => this.setState({ name })} placeholder="Name" />
                    </Item>
                    <Item>
                        <Input onChangeText={(email) => this.setState({ email })} placeholder="Email" />
                    </Item>
                    <Item last>
                        <Input onChangeText={(password) => this.setState({ password })} placeholder="Password" secureTextEntry />
                    </Item>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <Button onPress={this._pickImage}>
                        <Text>Upload profile picture</Text>
                    </Button>
                </View>
                <View style={{ height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
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

const mapDispatchToProps = (dispatch) => ({
    register: (userInfo) => (dispatch(register(userInfo)))
})

const mapStateToProps = (state) => ({
    isLoggedIn: state.Users.isLoggedIn
})

export default connect(mapStateToProps, mapDispatchToProps)(Regis)