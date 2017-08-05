import React from 'react';
import { Link } from 'react-router';

import '../styles/index.scss';

export default class App extends React.Component {
  render () {
    return (
      <div>
        <div
          style={{
            display: 'inline-block',
            width: '15%',
            border: '2px solid grey',
            background: '#767676',
            position: 'absolute',
            top: 0,
            height: '700px',
            padding: 20
          }}
        >
          <div>
            <Link to="/page1">Page 1</Link>
          </div>
        </div>
        <div
          style={{
            display: 'inline-block',
            width: '85%',
            background: '#fff',
            position: 'absolute',
            left: '15%',
            top: 0,
            height: '700px'
          }}
        >
          <div style={{ backgroundColor: 'papayawhip', padding: 20 }}>Main app Header</div>
          <div style={{ padding: 20 }}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}
