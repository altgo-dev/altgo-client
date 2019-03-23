import { 
    createStackNavigator,
} from "react-navigation";

// Screens
import Friend from '../screens/Friends'


const RootNav = createStackNavigator({
    Friend: {
        screen: Friend,
        navigationOptions: {
            title: 'Social',
            tabBarIcon: ({tintColor}) => (
                <Icon name="people" style={{ color: tintColor }}/>
            )
        }
    }
}, {
    initialRouteName: 'Friend',
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