import { Classes, FocusStyleManager } from '@blueprintjs/core';
import classNames from 'classnames';
import React, { lazy, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import LazyPage from './components/lazy-page';
import Navbar from './components/navbar';
import Home from './pages/home';

import './index.scss';

const LIGHT_THEME = '';
const DARK_THEME = Classes.DARK;

FocusStyleManager.onlyShowFocusOnTabs();

function App() {
  const [mode, setMode] = useState(LIGHT_THEME);
  const toggleMode = () =>
    setMode(mode === LIGHT_THEME ? DARK_THEME : LIGHT_THEME);
  return (
    <Router>
      <div className={classNames(mode)}>
        <Navbar mode={mode} toggleMode={toggleMode} />
        <Route path="/" exact component={Home} />
        <Route
          path="/feed"
          component={LazyPage(lazy(() => import('./pages/feed')))}
        />
        <Route
          path="/claims"
          exact
          component={LazyPage(lazy(() => import('./pages/claims')))}
        />
        <Route
          path="/claims/:vin"
          exact
          component={LazyPage(lazy(() => import('./pages/single-claim')))}
        />
      </div>
    </Router>
  );
}

render(<App />, document.getElementById('root'));
