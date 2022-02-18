import './App.css';
import { Component } from 'react';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore';
import config from './config/firebase-config';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LoginPage from './component/container/LoginPage';
import MainPage from './component/container/MainPage';
import MyPage from './component/container/MyPage';

class App extends Component {
  constructor() {
    super();

    if(firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }
    firebase.firestore().settings({timestampsInSnapshots: true});
  }

  async componentDidMount() {
    firebase.firestore().collection('test').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log(doc.data());
      });
    });
  }

  render() {
    return(
      <BrowserRouter>
        <Switch>
          <Route exact path='/'><LoginPage /></Route>
          <Route exact path='/mainApp/:uid'><MainPage /></Route>
          <Route exact path='/myPage/:uid'><MyPage /></Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;