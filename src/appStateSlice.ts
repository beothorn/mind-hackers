import { AnyAction, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import type { RootState } from './store'

import { listEngines } from './OpenAiApi'

export type AppScreen = 'testOpenAiToken' | 
  'presentation' | 
  'selectAction' | 
  'showText' | 
  'showIntro' | 
  'error' | 
  'askRestaurantType' |
  'insertThought';

type AppState = {
  openAiKey: string,
  currentScreen: AppScreen,
  restaurantDescription: string,
  messages: string[],
}

const initialState: AppState = {
  openAiKey: '',
  currentScreen: 'testOpenAiToken',
  restaurantDescription: 'Loading...',
  messages: [],
}

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setOpenAiKey: (state: AppState, action: PayloadAction<string>) => {
      state.openAiKey = action.payload;
    },
    setScreen: (state: AppState, action: PayloadAction<AppScreen>) => {
      state.currentScreen = action.payload;
    },
    addMessage: (state: AppState, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    },
    removeMessage: (state: AppState, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(message => message !== action.payload);
    },
  },
})

export const { setOpenAiKey, setScreen } = appStateSlice.actions

export const selectScreen = (state: RootState) => state.appState.currentScreen
export const selectMessages = (state: RootState) => state.appState.messages
export const selectOpenAiKey = (state: RootState) => state.appState.openAiKey

export const actionSetScreen = (screen: AppScreen) => ({type: 'appState/setScreen', payload: screen})
export const actionSetOpenAiKey = (key: string) => ({type: 'appState/setOpenAiKey', payload: key})
export const actionAddMessage = (key: string) => ({type: 'appState/addMessage', payload: key})
export const actionRemoveMessage = (key: string) => ({type: 'appState/removeMessage', payload: key})

export async function dispatchActionCheckOpenAiKey(dispatch: Dispatch<AnyAction>, openAiKey: string) {
  listEngines(openAiKey)
    .then(() => {
      localStorage.setItem('openAiKey', openAiKey);
      return batch(() => {
        dispatch(actionSetOpenAiKey(openAiKey));
        dispatch(actionSetScreen('askRestaurantType'));
      })
    })
    .catch(() => dispatch(actionSetScreen('error')));
}

export default appStateSlice.reducer