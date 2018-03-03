import React from 'react';
import './login.css';
import {serverURL} from './config';
import axios from 'axios';
import images from './images';

class Login extends React.Component {
    state = {
        username: '',
        password: '',
        loading: false
    }
    onLogin() {
        const {username, password} = this.state;
        if(!username || !password) {
            return alert('Invalid credentials')
        }
        this.setState({loading: true})
        axios.post(serverURL + '/authenticate', {
            username,
            password
        }).then(rsp => {
            const {token} = rsp.data.data;
            localStorage.setItem('token', token)
            this.props.onLogin({username})
        }).catch(err => {
            if(err.response) {
                this.setState({
                    loading: false
                })
            }
        })
    }
    onKeyDown(e) {
        if(e.keyCode == 13) this.onLogin()
    }
    _renderForm() {
        return (
                <div onKeyDown={this.onKeyDown.bind(this)}>
                    <div className="title">
                        <h1>Signin</h1>
                    </div>
                    <div className="group">
                        <input type="text"
                            className={this.state.usernameError ? 'error' : null}
                            value={this.state.username}
                            onChange={e => this.setState({username: e.target.value})}
                            placeholder="Username"
                            ref="username" />
                    </div>
                    <div className="group">
                        <input type="password"
                            className={this.state.passwordError ? 'error' : null}
                            value={this.state.password}
                            onChange={e => this.setState({password: e.target.value})}
                            placeholder="Password" />
                    </div>
                    <div className="group">
                        <button onClick={this.onLogin.bind(this)}>Login</button>
                    </div>
                </div>
        )
    }
    render() {
        return (
            <div className="login-overlay">
                <div className="login-box">
                    {(this.props.loading || this.state.loading) ? <div className="placeholder"><img src={images.loading} /></div> : this._renderForm()}
                </div>
            </div>
        )
    }
}

export default Login;