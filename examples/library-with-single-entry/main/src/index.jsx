import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import routes from './routes';
import MyLibrary from 'MyLibrary';


MyLibrary.configure({publicPath: 'http://localhost:9001/'});

const renderApp = () => {
  render(
    <AppContainer>
      <Router history={browserHistory} routes={routes} />
    </AppContainer>,
    document.querySelector('#app')
  );
};

renderApp();

if (module && module.hot) {
  module.hot.accept('./app', renderApp);
}
