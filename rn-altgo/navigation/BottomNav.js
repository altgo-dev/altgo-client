import { 
    createBottomTabNavigator,
} from "react-navigation";
import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import { Icon } from 'native-base'
// import { Icon } from 'expo'

// Screens
import Home from '../screens/Home'
import Profile from '../screens/Profile'
import Friend from '../screens/Friends'


const RootNav = createBottomTabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            title: 'Home',
            tabBarIcon: ({tintColor}) => (
                <Icon name='home' style={{ color: tintColor }}/>
            )
            
        }
    },
    Friend: {
        screen: Friend,
        navigationOptions: {
            title: 'Social',
            tabBarIcon: ({tintColor}) => (
                <Icon name="people" style={{ color: tintColor }}/>
            )
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            title: 'Profile',
            tabBarIcon: ({tintColor}) => (
                <Icon name="person" style={{ color: tintColor }}/>
            )
        }
    }
}, {
    initialRouteName: 'Profile',
    tabBarOptions: {
        showLabel: false, // hide labels
        activeTintColor: 'white',
        inactiveTintColor: 'grey',  // inactive icon color
        style: {
            backgroundColor: 'black' // TabBar background
        }
    }
})
export default RootNav