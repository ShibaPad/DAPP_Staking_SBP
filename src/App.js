import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './component/Main';
import Store from './store/store';
// import AlertTemplate from './component/alert';
import AlertTemplate from 'react-alert-template-basic';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';

const options = {
  // you can also just use 'bottom center'
  position: positions.MIDDLE,
  timeout: 3000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

function App() {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Main />
    </AlertProvider>
  );
}

export default App;
