import { Dispatch, PayloadAction, AnyAction, createSlice } from '@reduxjs/toolkit'
import { actionSetScreen } from './appStateSlice'

import type { RootState } from './store'

import { getCompletion } from './OpenAiApi'

type GameState = {
    lastText: string,
    player: {
        hasBathroomKey: boolean,
    },
    waitress: {
        player: {
            thinksIsAnEmployee: boolean,
            trust: number, 
        },
        friend: {
            trust: number, 
        }
    },
    friend: {
        willPayForDinner: boolean,
        willGiveAGoodTip: boolean,
        likes: string[],
        dislikes: string[],
        player: {
            trust: number, 
        },
        waitress: {
            isSatisfiedWithTheService: boolean,
        }
    }
}

const initialState: GameState = {
    lastText: 'Loading...',
    player: {
        hasBathroomKey: false,
    },
    waitress: {
        player: {
            thinksIsAnEmployee: false,
            trust: 0, 
        },
        friend: {
            trust: 0, 
        }
    },
    friend: {
        willPayForDinner: false,
        willGiveAGoodTip: false,
        likes: ['boats', 'cars', 'photography'],
        dislikes: ['computers', 'pets', 'tv'],
        player: {
            trust: 5, 
        },
        waitress: {
            isSatisfiedWithTheService: true,
        }
    }
}

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        setPlayerHasBathroomKey: (state: GameState, action: PayloadAction<boolean>) => {
          state.player.hasBathroomKey = action.payload;
        },
        setLastText: (state: GameState, action: PayloadAction<string>) => {
          state.lastText = action.payload;
        },
    },
})

export const selectGameState = (state: RootState) => state.gameState;
export const selectLastText = (state: RootState) => state.gameState.lastText;

export const actionSetPlayerHasBathroomKey = (hasBathroomKey: boolean) => ({type: 'gameState/setPlayerHasBathroomKey', payload: hasBathroomKey})
export const actionSetLastText = (text: string) => ({type: 'gameState/setLastText', payload: text})

function trust(person1:string, person2:string, score: number): string{
    if(score > 9){
        return `${person1} trust ${person2} completely.`;
    }
    if(score > 5){
        return `${person1} trust ${person2}.`;
    }
    if(score > 3){
        return `${person1} does not know ${person2}.`;
    }
    return `${person1} do not trust ${person2}`;
}

function renderStateAsText(gameState: GameState): string {
    let whoHasTheBathroomKey = 'The waitress have the key to the employees bathroom.';
    if(gameState.player.hasBathroomKey){
        whoHasTheBathroomKey = 'You have the key to the employees bathroom.';
    }

    let waitressThinksPlayerIsAnEmployee = 'The waitress knows you do not work at this restaurant.';
    if(gameState.waitress.player.thinksIsAnEmployee){
        waitressThinksPlayerIsAnEmployee = 'The waitress thinks you work at this restaurant.';
    }

    let friendWillPayForDinner = 'Jonas does not want to pay the dinner for you.';
    if(gameState.friend.willPayForDinner){
        friendWillPayForDinner = 'Jonas wants to pay the dinner for you.';
    }

    let friendWillGiveAGoodTip = 'Jonas does not want to give a good tip for the waitress, just the regular amount.';
    if(gameState.friend.willGiveAGoodTip){
        friendWillGiveAGoodTip = 'Jonas wants to give the waitress a very good tip.';
    }

    const friendLikes =`Jonas likes to talk about ${gameState.friend.likes.join(', ')}.`;
    const friendDislikes =`Jonas does not like conversations about ${gameState.friend.dislikes.join(', ')}.`;

    const friendSatisfaction = `Jonas is ${gameState.friend.waitress.isSatisfiedWithTheService? 'satisfied':'not satisfied'} with the service.`;

    return `${whoHasTheBathroomKey} 
    ${waitressThinksPlayerIsAnEmployee}
    ${trust('The waitress', 'you', gameState.waitress.player.trust)}}
    ${trust('The waitress', 'Jonas', gameState.waitress.player.trust)}}
    ${friendWillPayForDinner}
    ${friendWillGiveAGoodTip}
    ${friendLikes}
    ${friendDislikes}
    ${trust('Jonas', 'you', gameState.friend.player.trust)}}
    ${friendSatisfaction}
    On this restaurant you pay the bill at the end of your meal.`;
}

export type PlayerAction = 'waitress:order:food' | 'NOT_IMPLEMENTED'

function orderFood(
    dispatch: Dispatch<AnyAction>, 
    openAiKey: string,
    stateAsText: string
){
    dispatch(actionSetScreen('showText'));

    const openAiQuery = `${stateAsText} 
    You call the waitress to order food. This is how it goes:`;
    
        getCompletion(openAiKey, openAiQuery)
        .then((textResult) => {
            getCompletion(openAiKey, `${stateAsText} ${textResult}. Did the waitress gave you the key to the employees bathroom?`)
                .then((answer) => {
                    if(answer.toLocaleLowerCase().includes('yes')){
                        dispatch(actionSetPlayerHasBathroomKey(true));
                    }
                });
            dispatch(actionSetLastText(textResult));
        })
        .catch(() => dispatch(actionSetScreen('error')));
}

export async function dispatchPlayerAction(
    dispatch: Dispatch<AnyAction>, 
    currentState: GameState, 
    openAiKey: string,
    action: PlayerAction
) {
      /*
      - Read action
- Render state as text
- If action has an outcome (ex: success or failure)
  - Append action to text
  - Append yes/no question to outcome
- Append action to text, if action has outcome also append it. This is the final text.
- Ask for narration
- Print only narration
- For each state, send final text and a yes/no question, update the state accordingly
- Go back to read action
*/
    const stateAsText = renderStateAsText(currentState);
    
    switch(action){
        case 'waitress:order:food':
            orderFood(
                dispatch,
                openAiKey,
                stateAsText
            );
            break;
    }
}

export default gameStateSlice.reducer