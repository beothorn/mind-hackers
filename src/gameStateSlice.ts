import { Dispatch, PayloadAction, AnyAction, createSlice } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import { actionSetScreen, actionAddMessage } from './appStateSlice'

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
        increaseWaitressTrustOnPlayer: (state: GameState) => {
            state.waitress.player.trust+= 1;
            state.waitress.player.trust = state.waitress.player.trust > 10 ? 10: state.waitress.player.trust;
        },
        decreaseWaitressTrustOnPlayer: (state: GameState) => {
            state.waitress.player.trust-= 1;
            state.waitress.player.trust = state.waitress.player.trust < 0 ? 0: state.waitress.player.trust;
        },
        setLastText: (state: GameState, action: PayloadAction<string>) => {
            state.lastText = action.payload;
        },
        friendPaysForDinner: (state: GameState) => {
            state.friend.willPayForDinner = true;
        },
        friendWillGiveAGoodTip: (state: GameState) => {
            state.friend.willGiveAGoodTip = true;
        },
        increaseFriendTrustOnPlayer: (state: GameState) => {
            state.friend.player.trust+= 1;
            state.friend.player.trust = state.friend.player.trust > 10 ? 10: state.friend.player.trust;
        },
        decreaseFriendTrustOnPlayer: (state: GameState) => {
            state.friend.player.trust-= 1;
            state.friend.player.trust = state.friend.player.trust < 0 ? 0: state.friend.player.trust;
        },
    },
})

export const selectGameState = (state: RootState) => state.gameState;
export const selectLastText = (state: RootState) => state.gameState.lastText;

export const actionSetPlayerHasBathroomKey = (hasBathroomKey: boolean) => ({type: 'gameState/setPlayerHasBathroomKey', payload: hasBathroomKey})
export const actionIncreaseWaitressTrustOnPlayer = () => ({type: 'gameState/increaseWaitressTrustOnPlayer'})
export const actionDecreaseWaitressTrustOnPlayer = () => ({type: 'gameState/decreaseWaitressTrustOnPlayer'})
export const actionFriendPaysForDinner = () => ({type: 'gameState/friendPaysForDinner'})
export const actionFriendWillGiveAGoodTip = () => ({type: 'gameState/friendWillGiveAGoodTip'})
export const actionIncreaseFriendTrustOnPlayer = () => ({type: 'gameState/increaseFriendTrustOnPlayer'})
export const actionDecreaseFriendTrustOnPlayer = () => ({type: 'gameState/decreaseFriendTrustOnPlayer'})
export const actionSetLastText = (text: string) => ({type: 'gameState/setLastText', payload: text})

function trust(person1:string, person2:string, score: number): string{
    if(score > 9){
        return `${person1} trust ${person2} completely.`;
    }
    if(score > 5){
        return `${person1} trust ${person2}.`;
    }
    if(score > 3){
        return `${person1} is not very familiar with ${person2}.`;
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

    const friendSatisfaction = `Jonas is ${gameState.friend.waitress.isSatisfiedWithTheService? 'satisfied':'not satisfied'} with the service.`;

    return `${whoHasTheBathroomKey} 
    ${waitressThinksPlayerIsAnEmployee}
    ${trust('The waitress', 'you', gameState.waitress.player.trust)}
    ${trust('The waitress', 'Jonas', gameState.waitress.player.trust)}
    ${friendWillPayForDinner}
    ${friendWillGiveAGoodTip}
    ${trust('Jonas', 'you', gameState.friend.player.trust)}
    ${friendSatisfaction}
    On this restaurant you pay the bill at the end of your meal.`;
}

export type PlayerAction = 'waitress:order:food' | 
    'waitress:order:drink' | 
    'waitress:ask:bill' | 
    'waitress:ask:bathroom' |
    'waitress:ask:employeeBathroom' |
    'waitress:compliment:service' |
    'waitress:compliment:waitress' |
    'waitress:compliment:restaurant' |
    'waitress:compliment:food' |
    'waitress:complain:service' |
    'waitress:complain:waitress' |
    'waitress:complain:restaurant' |
    'waitress:complain:food' |
    'friend:ask:payForDinner' |
    'friend:ask:giveGoodTip' |
    'friend:talk:boats' |
    'friend:talk:cars' |
    'friend:talk:photography' |
    'friend:talk:computers' |
    'friend:talk:pets' |
    'friend:talk:tv' |
    'friend:talk:weather' |
    'friend:talk:food' |
    'friend:talk:drink' |
    'friend:compliment:intelligence' |
    'friend:compliment:appearance' |
    'friend:compliment:personality';

function interactWithWaitress(
    dispatch: Dispatch<AnyAction>, 
    openAiKey: string,
    stateAsText: string,
    interaction: string,
    action: string,
){
    dispatch(actionSetScreen('showText'));

    const openAiQuery = `${stateAsText} \n${interaction}`;
    
        getCompletion(openAiKey, openAiQuery)
        .then((textResult) => {
            if(action === 'waitress:ask:employeeBathroom'){
                getCompletion(openAiKey, `${stateAsText} ${textResult}.\nDid the waitress gave you the key to the employees bathroom, yes or no?`)
                .then((answer) => {
                    if(answer.toLocaleLowerCase().includes('yes')){
                        batch(() => {
                            dispatch(actionSetPlayerHasBathroomKey(true));
                            dispatch(actionAddMessage('You now you have the key to the employees bathroom.'));
                        })
                    }
                });
            }
            getCompletion(openAiKey, `${stateAsText} ${textResult}.\nDoes the waitress liked what you said, yes or no?`)
                .then((answer) => {
                    if(answer.toLocaleLowerCase().includes('yes')){
                        batch(() => {
                            dispatch(actionIncreaseWaitressTrustOnPlayer());
                            dispatch(actionAddMessage('You gained more trust from the waitress.'));
                        })
                    }else{
                        getCompletion(openAiKey, `${stateAsText} ${textResult}.\nIs the waitress annoyed by what you said, yes or no?`)
                            .then((answer) => {
                                if(answer.toLocaleLowerCase().includes('yes')){
                                    batch(() => {
                                        dispatch(actionDecreaseWaitressTrustOnPlayer());
                                        dispatch(actionAddMessage('The waitress is annoyed by this interaction.'));
                                    })
                                }
                            });
                    }
                });
            dispatch(actionSetLastText(textResult));
        })
        .catch(() => dispatch(actionSetScreen('error')));
}

function interactWithFriend(
    dispatch: Dispatch<AnyAction>, 
    openAiKey: string,
    stateAsText: string,
    interaction: string,
    action: string,
){
    dispatch(actionSetScreen('showText'));

    const openAiQuery = `${stateAsText} \n${interaction}`;
    
        getCompletion(openAiKey, openAiQuery)
        .then((textResult) => {
            if(action === 'friend:ask:payForDinner'){
                getCompletion(openAiKey, `${stateAsText} ${textResult}.\nDid Jonas agreed to pay for dinner, yes or no?`)
                .then((answer) => {
                    if(answer.toLocaleLowerCase().includes('yes')){
                        batch(() => {
                            dispatch(actionFriendPaysForDinner());
                            dispatch(actionAddMessage('Jonas will pay the dinner.'));
                        })
                    }
                });
            }
            if(action === 'friend:ask:giveGoodTip'){
                getCompletion(openAiKey, `${stateAsText} ${textResult}.\nDid Jonas agreed to give the waitress a good tip, yes or no?`)
                .then((answer) => {
                    if(answer.toLocaleLowerCase().includes('yes')){
                        batch(() => {
                            dispatch(actionFriendWillGiveAGoodTip());
                            dispatch(actionAddMessage('Jonas will give the waitress a good tip.'));
                        })
                    }
                });
            }
            getCompletion(openAiKey, `${stateAsText} ${textResult}.\nDoes Jonas liked what you said, yes or no?`)
                .then((answer) => {
                    if(answer.toLocaleLowerCase().includes('yes')){
                        batch(() => {
                            dispatch(actionIncreaseFriendTrustOnPlayer());
                            dispatch(actionAddMessage('You gained more trust from Jonas.'));
                        })
                    }else{
                        getCompletion(openAiKey, `${stateAsText} ${textResult}.\nIs Jonas annoyed by what you said, yes or no?`)
                            .then((answer) => {
                                if(answer.toLocaleLowerCase().includes('yes')){
                                    batch(() => {
                                        dispatch(actionDecreaseFriendTrustOnPlayer());
                                        dispatch(actionAddMessage('Jonas is annoyed by this interaction.'));
                                    })
                                }
                            });
                    }
                });
            dispatch(actionSetLastText(textResult));
        })
        .catch(() => dispatch(actionSetScreen('error')));
}

type Interactions = {
    [key in PlayerAction as string]: string;
  };

const interactionsWithWaitress: Interactions = {
    'waitress:order:food': 'You call the waitress to order food.',
    'waitress:order:drink': 'You call the waitress to order drinks.',
    'waitress:ask:bill': 'You call the waitress and asks for the bill.',
    'waitress:ask:bathroom': 'You call the waitress and asks to use the bathroom. There is no bathroom on this restaurant, only the bathroom for employees.',
    'waitress:ask:employeeBathroom': 'You call the waitress and asks to use the employees bathroom. The bathroom is only for employees with the key.',
    'waitress:compliment:service': 'You are very happy with the service and decides to give the waitress a compliment on her service.',
    'waitress:compliment:waitress': 'You decide to compliment the waitress on her wonderfull service.',
    'waitress:compliment:restaurant': 'You like the restaurant atmosphere and decides to call the waitress to give a compliment to the restaurant.',
    'waitress:compliment:food': 'You decide to call the waitress to tell her you really like the food.',
    'waitress:complain:service': 'You are dissatisfied with the service and decides to complain to the waitress.',
    'waitress:complain:waitress': 'You call the waitress to complain about her and tell her how awfull she is.',
    'waitress:complain:restaurant': 'You hated this restaurant and decides to call the waitress to let her know about it.',
    'waitress:complain:food': 'You did not liked the food and decides to call the waitress to let her know about it.',
}

const interactionsWithFriend: Interactions = {
    'friend:ask:payForDinner': 'You ask Jonas if he can pay the bill for the dinner.',
    'friend:ask:giveGoodTip': 'You ask Jonas to give a good tip for the waitress.',
    'friend:talk:boats': 'You start a conversation about boats with Jonas. Jonas really likes to talk about boats.',
    'friend:talk:cars': 'You start a conversation about cars with Jonas. Jonas really likes to talk about cars.',
    'friend:talk:photography': 'You start a conversation about photography with Jonas. Jonas really likes to talk about photography.',
    'friend:talk:computers': 'You start a conversation about computers with Jonas. Jonas hates to talk about computers.',
    'friend:talk:pets': 'You start a conversation about pets with Jonas. Jonas hates to talk about pets.',
    'friend:talk:tv': 'You start a conversation about tv shows with Jonas. Jonas hates to talk about tv shows.',
    'friend:talk:weather': 'You start a conversation about the weather with Jonas.',
    'friend:talk:food': 'You start a conversation about the food from this restaurant with Jonas.',
    'friend:talk:drink': 'You start a conversation about the drinks from this restaurant with Jonas.',
    'friend:compliment:intelligence': 'You comliment Jonas on his intelligence.',
    'friend:compliment:appearance': 'You comliment Jonas on his appearance.',
    'friend:compliment:personality': 'You comliment Jonas on his personality.',
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
    
    if(action.startsWith('waitress')){
        let interaction = interactionsWithWaitress[action];
        interactWithWaitress(
            dispatch, 
            openAiKey, 
            stateAsText, 
            interaction + ' This is how it goes:\n',
            action
        );
    }
    if(action.startsWith('friend')){
        let interaction = interactionsWithFriend[action];
        interactWithFriend(
            dispatch, 
            openAiKey, 
            stateAsText, 
            interaction + ' This is how it goes:\n',
            action
        );
    }
}

export default gameStateSlice.reducer