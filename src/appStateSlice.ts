import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

export type AppScreen = 'presentation' | 'selectAction' | 'showText'

type AppState = {
  openAiKey: string,
  currentScreen: AppScreen,
}

const initialState: AppState = {
  openAiKey: '',
  currentScreen: 'presentation',
}

export const counterSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setOpenAiKey: (state: AppState, action: PayloadAction<string>) => {
      state.openAiKey = action.payload
    },
    setScreen: (state: AppState, action: PayloadAction<AppScreen>) => {
      state.currentScreen = action.payload
    },
  },
})

export const { setOpenAiKey, setScreen } = counterSlice.actions

export const selectScreen = (state: RootState) => state.appState.currentScreen
export const selectOpenAiKey = (state: RootState) => state.appState.openAiKey

export const actionSetScreen = (screen: AppScreen) => ({type: 'appState/setScreen', payload: screen})
export const actionSetOpenAiKey = (key: string) => ({type: 'appState/setOpenAiKey', payload: key})

export default counterSlice.reducer