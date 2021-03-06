import { 
    createAppContainer,
    createSwitchNavigator
} from "react-navigation"

import Signin from '../screens/SignIn'
import Regis from '../screens/Regis'
import BottomNav from './BottomNav'
import AddFriend from '../screens/AddFriends'
import AuthLoading from '../screens/AuthLoading'
import PendingHangout from '../screens/PendingHangout'
import GroupRoute from '../screens/GroupRoute'
import RouteOptimizer from '../screens/RouteOptimizer'
import TravelMap from '../screens/TravelMap'

const SwitchNav = createSwitchNavigator({
    App: BottomNav,
    Auth: Signin,
    Regis: Regis,
    AddFriend,
    AuthLoading,
    PendingHangout,
    GroupRoute,
    RouteOptimizer,
    TravelMap

}, {
    initialRouteName: 'Auth'
})


export default createAppContainer(SwitchNav)