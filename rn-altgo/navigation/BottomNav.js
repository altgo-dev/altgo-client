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
import RouteOptimizer from '../screens/RouteOptimizer'


const RootNav = createBottomTabNavigator({
    Friend: {
        screen: Friend,
        navigationOptions: {
            title: 'Social',
            tabBarIcon: ({tintColor}) => (
                <Icon name="people" style={{ color: tintColor }}/>
            )
        }
    },
    Home: {
        screen: Home,
        navigationOptions: {
            title: 'Home',
            tabBarIcon: ({tintColor}) => (
                <Icon name='home' style={{ color: tintColor }}/>
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
    initialRouteName: 'Home',
    tabBarOptions: {
        showLabel: false, // hide labels
        activeTintColor: 'black',
        inactiveTintColor: 'lightgrey',  // inactive icon color
        style: {
            // backgroundColor: '#A2CCCD' // TabBar background
            backgroundColor: 'white'
        }
    }
})
export default RootNav