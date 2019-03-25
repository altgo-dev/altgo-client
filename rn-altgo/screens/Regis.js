import React, { Component } from 'react'
import { View, SafeAreaView, TouchableHighlight, Text } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Button, Toast, Root, Icon } from 'native-base';
import s from '../style'
import { connect } from 'react-redux'
import { ImagePicker, Camera, Permissions } from 'expo'

//actions
import { register, setError } from '../store/actions/UsersAction'

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

    }

    login = () => {
        this.props.navigation.navigate('Auth')
    }

    register = () => {
        if( !this.state.email || !this.state.password || !this.state.image ) {
            this.props.setError({ message: 'All fields must be filled!' })
        } else {
        var userInfo = {
            email: this.state.email,
            name: this.state.name,
            password: this.state.password,
            image: this.state.image
        }
        this.props.register(userInfo)
        }
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
            <Root>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(255, 190, 30)', justifyContent: 'center'}}>
            
                <View style={{ backgroundColor: 'white', height: 370, marginHorizontal: 5, padding: 5, shadowColor: '#555556', shadowOffset: { width: 5, height: 2 }, shadowOpacity: 0.8, shadowRadius: 7}}>
                 
                    
                    <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginHorizontal: 15 }}>
                        <Item  style={{borderBottomWidth: 0, backgroundColor: 'rgba(246, 247, 249, 1)', borderRadius: 5, marginTop: 50 }} >
                            <Input onChangeText={(name) => this.setState({ name })} placeholder="Name" />
                        </Item>
                        <Item  style={{borderBottomWidth: 0, backgroundColor: 'rgba(246, 247, 249, 1)', borderRadius: 5, marginTop: 5 }} >
                            <Input onChangeText={(email) => this.setState({ email })} placeholder="Email" />
                        </Item>
                        <Item style={{borderBottomWidth: 0, backgroundColor: 'rgba(246, 247, 249, 1)', borderRadius: 5, marginTop: 5 }}  last>
                            <Input onChangeText={(password) => this.setState({ password })} placeholder="Password" secureTextEntry />
                        </Item>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row', marginTop: 25, marginRight: 20 }}>
                        <Button onPress={this._pickImage} style={{ borderRadius: 40}}>
                        {/* <Text style={{ color: 'white', marginLeft: 10 }}>
                            Upload your image here
                        </Text> */}
                            <Icon name="camera" />
                        </Button>
                    </View>

                    <View style={{ height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 14 }}>
                            Don't have an account yet?
                    </Text>
                        <TouchableHighlight underlayColor="#ffffff00"  onPress={this.login}>
                            <Text style={{ textAlign: 'center', fontSize: 14, color: '#3378e8' }}>
                                Login Here
                        </Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row' }}>
                        <Button onPress={this.register} dark style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 15 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 20, fontWeight: '500'}}>Register</Text>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
            </Root>

        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    register: (userInfo) => (dispatch(register(userInfo))),
    setError: (err) => (dispatch(setError(err)))

})

const mapStateToProps = (state) => ({
    isLoggedIn: state.Users.isLoggedIn,
    errors: state.Users.errors,
})

export default connect(mapStateToProps, mapDispatchToProps)(Regis)