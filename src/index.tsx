import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import { Provider } from 'react-redux'


import store from './store'
import '@fontsource/roboto/300.css';
import { SnackbarProvider } from 'notistack';

const rootElement = document.getElementById('root');
if(!rootElement){
    throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(<Provider store={store}><SnackbarProvider><App /></SnackbarProvider>
    
</Provider>);