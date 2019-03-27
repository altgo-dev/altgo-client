import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

//reducers
import Meetup from './reducers/Meetup'
import Users from './reducers/Users'

const store = createStore(
   combineReducers({Meetup, Users}),
   applyMiddleware((thunk))
)

export default store