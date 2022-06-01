import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import type { RootState } from './store'

import { listEngines } from './OpenAiApi'

export type AppScreen = 'testOpenAiToken' | 'presentation' | 'selectAction' | 'showText'

type AppState = {
  openAiKey: string,
  currentScreen: AppScreen,
}

const initialState: AppState = {
  openAiKey: '',
  currentScreen: 'testOpenAiToken',
}

export const counterSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setOpenAiKey: (state: AppState, action: PayloadAction<string>) => {
      state.openAiKey = action.payload;
    },
    setScreen: (state: AppState, action: PayloadAction<AppScreen>) => {
      state.currentScreen = action.payload;
    },
  },
})

export const { setOpenAiKey, setScreen } = counterSlice.actions

export const selectScreen = (state: RootState) => state.appState.currentScreen
export const selectOpenAiKey = (state: RootState) => state.appState.openAiKey

export const actionSetScreen = (screen: AppScreen) => ({type: 'appState/setScreen', payload: screen})
export const actionSetOpenAiKey = (key: string) => ({type: 'appState/setOpenAiKey', payload: key})

export async function actionCheckOpenAiKey(dispatch: any, openAiKey: string) {
  listEngines(openAiKey)
    .then(() => {
      localStorage.setItem('openAiKey', openAiKey);
      return batch(() => {
        dispatch(actionSetOpenAiKey(openAiKey));
        dispatch(actionSetScreen('showText'));
      })
    })
    .catch(() => dispatch(actionSetScreen('presentation')));
}

export default counterSlice.reducer