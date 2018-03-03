import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import ChatWindow from './ChatWindow';
import { serverURL } from './config';
import Login from './Login';
import images from './images'

const EmptyBox = () => {
  return (
    <div className="empty-cont">
      <div className="empty-box">
        <img src={images.disconnected} />
        <div className="txt">Offline</div>
      </div>
    </div>
  )
}

class App extends Component {
  state = {
    loggedIn: false,
    loading: true,
    username: ''
  }
  componentDidMount() {
    this.checkLoggedIn()
  }

  checkLoggedIn() {
    const token = localStorage.getItem('token')
    if (token) {
      axios.post(serverURL + '/verify', {
        token
      }).then(rsp => {
        const {username} = rsp.data.data.user;
        this.setState({
          loggedIn: true,
          loading: false,
          username
        })
      }).catch(rsp => {
        if (rsp.response) {
          this.setState({loading: false})
          localStorage.removeItem('token')
        }
      })
    } else {
      this.setState({loading: false})
    }
  }
  onLogout() {
    localStorage.removeItem('token')
    this.setState({loggedIn: false})
  }
  onLogin(info) {
    this.setState({
      loggedIn: true,
      username: info.username
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="leading"><h1 className="App-title"><img src={images.logo} /> msg</h1></div>
          {this.state.loggedIn && <div><button onClick={this.onLogout.bind(this)}>logout</button></div>}
        </header>
        {this.state.loggedIn && <ChatWindow username={this.state.username} />}
        {!this.state.loggedIn && <Login onLogin={this.onLogin.bind(this)} loading={this.state.loading} />}
        {!this.state.loggedIn && <EmptyBox />}
      </div>
    );
  }
}

export default App;
