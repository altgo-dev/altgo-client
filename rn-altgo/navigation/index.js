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

const SwitchNav = createSwitchNavigator({
    App: BottomNav,
    Auth: Signin,
    Regis: Regis,
    AddFriend,
    AuthLoading,
    PendingHangout
}, {
    initialRouteName: 'Auth'
})


export default createAppContainer(SwitchNav)