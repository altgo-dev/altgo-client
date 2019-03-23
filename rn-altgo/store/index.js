import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

//reducers
import Meetup from './reducers/Meetup'

const store = createStore(
   combineReducers({Meetup}),
   applyMiddleware((thunk))
)

export default store