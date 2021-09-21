import React, { createContext,useContext,useReducer,useEffect } from 'react';
import { BrowserRouter,Switch,Route,useHistory } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import MainPage from './components/MainPage/MainPage';
import {reducer1,initialState1} from './reducers/UserReducer'
import {reducer2,initialState2} from './reducers/ConversationReducer'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state,dispatch1} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch1({type:"USER",payload:user})
      history.push("/mainpage")
    }
    else{
      if(!history.location.pathname.startsWith("/reset")){
        history.push("/")
      }
    }
  }, [])
  return (
    <Switch>
        <Route exact path="/"><Home/></Route>
        <Route path="/mainPage"><MainPage/></Route>
        <Route path="/mainpage/:convId"><MainPage/></Route>
      </Switch>
  )
}

function App() {
  const [state,dispatch1] = useReducer(reducer1,initialState1)
  const [convId,dispatch2] = useReducer(reducer2,initialState2)
  return (
  <UserContext.Provider value={{convId,state,dispatch1,dispatch2}}>
    <BrowserRouter>
      <Routing/>
    </BrowserRouter>
  </UserContext.Provider>
  );
}

export default App;