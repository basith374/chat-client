import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './chatwindow.css'

class ChatWindow extends React.Component {
    state = {
        msg_list: [],
        msg: '',
        scrollDirty: false
    }
    constructor() {
        super()
        this.markScrollDirty = this.markScrollDirty.bind(this)
    }

    componentDidMount() {
        var socket = io.connect('http://lightsail.basithkunimal.com:3000')
        socket.on('message', (msg) => {
            var doScroll = false;
            var scroller = this.refs.scroller;
            var content = scroller.querySelector('.msg-list')
            var totalHeight = content.getBoundingClientRect().height
            var visibleHeight = scroller.getBoundingClientRect().height
            if(scroller.scrollTop == (totalHeight - visibleHeight)) {
                doScroll = true;
            }
            this.setState({
              msg_list: this.state.msg_list.concat(msg)
            }, () => {
                if(doScroll || !this.state.scrollDirty) {
                    scroller.scrollTop = content.getBoundingClientRect().height - visibleHeight;
                }
            })
        })
        this.socket = socket;
        this.refs.scroller.addEventListener('wheel', this.markScrollDirty)
    }

    markScrollDirty() {
        console.log('foo')
        this.setState({scrollDirty: true})
        this.refs.scroller.removeEventListener('wheel', this.markScrollDirty)
    }

    sendMsg() {
        if(!this.state.msg) return
        axios.post('http://lightsail.basithkunimal.com:3000/sendmsg', {
            msg: this.state.msg,
            token: localStorage.getItem('token')
        }).then(rsp => {
            this.setState({ msg: '' })
        })
    }

    onKeyDown(e) {
        if (e.keyCode == 13) this.sendMsg()
    }

    _renderItem(m, i) {
        return (
            <div key={i} className={'msg-itm' + (this.props.username == m.from ? ' right' : '')}>
                <div className="msg-itm-b">{m.from} : {m.msg}</div>
            </div>
        )
    }

    render() {
        return (
            <main>
                <div className="msg-list-outer" ref="scroller">
                    <div className="msg-list">
                        {this.state.msg_list.map((m, i) => this._renderItem(m, i))}
                    </div>
                </div>
                <div className="input-area">
                    <input type="text" value={this.state.msg} onChange={e => this.setState({ msg: e.target.value })} onKeyDown={this.onKeyDown.bind(this)} />
                    <button onClick={this.sendMsg.bind(this)}>Send</button>
                </div>
            </main>
        )
    }
}

export default ChatWindow;