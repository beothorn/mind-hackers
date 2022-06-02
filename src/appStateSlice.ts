import { AnyAction, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import type { RootState } from './store'

import { listEngines, getCompletion } from './OpenAiApi'

export type AppScreen = 'testOpenAiToken' | 'presentation' | 'selectAction' | 'showText' | 'showIntro' | 'error'

type AppState = {
  openAiKey: string,
  currentScreen: AppScreen,
  restaurantDescription: string,
}

const initialState: AppState = {
  openAiKey: '',
  currentScreen: 'testOpenAiToken',
  restaurantDescription: 'Loading...',
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
    setRestaurantDescription: (state: AppState, action: PayloadAction<string>) => {
      state.restaurantDescription = action.payload;
    },
  },
})

export const { setOpenAiKey, setScreen } = appStateSlice.actions

export const selectScreen = (state: RootState) => state.appState.currentScreen
export const selectOpenAiKey = (state: RootState) => state.appState.openAiKey
export const selectRestaurantDescription = (state: RootState) => state.appState.restaurantDescription

export const actionSetScreen = (screen: AppScreen) => ({type: 'appState/setScreen', payload: screen})
export const actionSetOpenAiKey = (key: string) => ({type: 'appState/setOpenAiKey', payload: key})
export const actionSetRestaurantDescription = (description: string) => ({type: 'appState/setRestaurantDescription', payload: description})

export async function dispatchActionCheckOpenAiKey(dispatch: Dispatch<AnyAction>, openAiKey: string) {
  listEngines(openAiKey)
    .then(() => {
      localStorage.setItem('openAiKey', openAiKey);
      return batch(() => {
        dispatch(actionSetOpenAiKey(openAiKey));
        dispatch(actionSetScreen('showIntro'));
      })
    })
    .catch(() => dispatch(actionSetScreen('error')));
}

export async function dispatchActionQueryRestaurantDescription(dispatch: Dispatch<AnyAction>, openAiKey: string) {
  const openAiQuery = `You were invited to dinner by your friend Jonas. The restaurant is small but looks nice. I will try to describe this restaurant:`;

  getCompletion(openAiKey, openAiQuery)
    .then((result) => dispatch(actionSetRestaurantDescription(result)))
    .catch((e) =>{
      console.error(e);
      dispatch(actionSetScreen('error'));
    });
}

export default appStateSlice.reducer