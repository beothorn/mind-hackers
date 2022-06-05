import { Dispatch, PayloadAction, AnyAction, createSlice } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import { actionSetScreen, actionAddMessage } from './appStateSlice'

import type { RootState } from './store'

import { getCompletion, answerQuestion } from './OpenAiApi'

type GameState = {
    lastText: string,
    restaurantDescription: string,
    facts: string[],
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
    facts: [],
    restaurantDescription: '',
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
        setRestaurantDescription: (state: GameState, action: PayloadAction<string>) => {
          state.restaurantDescription = action.payload;
        },
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
export const selectRestaurantDescription = (state: RootState) => state.gameState.restaurantDescription

export const actionSetRestaurantDescription = (description: string) => ({type: 'gameState/setRestaurantDescription', payload: description})
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

function getFactsFromGamestate(gameState: GameState): string[] {
    const facts = [];

    facts.push(gameState.player.hasBathroomKey ?
        'You have the key to the employees bathroom.'
        : 'The waitress have the key to the employees bathroom.');

    facts.push(gameState.waitress.player.thinksIsAnEmployee ?
        'The waitress thinks you work at this restaurant..'
        : 'The waitress knows you do not work at this restaurant.');

    facts.push(gameState.friend.willPayForDinner ?
        'Jonas wants to pay the dinner for you.'
        : 'Jonas does not want to pay the dinner for you.');

    facts.push(gameState.friend.willGiveAGoodTip ?
        'Jonas wants to give the waitress a very good tip.'
        : 'Jonas does not want to give a good tip for the waitress, just the regular amount.');

    facts.push(gameState.friend.waitress.isSatisfiedWithTheService ?
        'Jonas is satisfied with the service.'
        : 'Jonas is unhappy with the service.');

    facts.push(trust('The waitress', 'you', gameState.waitress.player.trust));
    facts.push(trust('The waitress', 'Jonas', gameState.waitress.player.trust));
    facts.push(trust('Jonas', 'you', gameState.friend.player.trust));
    facts.push('On this restaurant you pay the bill at the end of your meal, so they don\'t pay the bill in this scene.');

    return facts.concat(gameState.facts);
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
    openAiQuery: string,
    action: string,
){
    dispatch(actionSetScreen('showText'));
    
    getCompletion(openAiKey, openAiQuery)
        .then((textResult) => {
            const finalText = `${openAiQuery}\n${textResult}`;
            if(action === 'waitress:ask:employeeBathroom'){
                answerQuestion(openAiKey, finalText,'Did the waitress gave you the key to the employees bathroom?')
                    .then((answer) => {
                        if(answer){
                            batch(() => {
                                dispatch(actionSetPlayerHasBathroomKey(true));
                                dispatch(actionAddMessage('You now you have the key to the employees bathroom.'));
                            })
                        }
                    });
            }
            answerQuestion(openAiKey, finalText, 'Does the waitress liked what you said?')
                .then((answer) => {
                    if(answer){
                        batch(() => {
                            dispatch(actionIncreaseWaitressTrustOnPlayer());
                            dispatch(actionAddMessage('You gained more trust from the waitress.'));
                        })
                    }else{
                        answerQuestion(openAiKey, finalText, `Is the waitress annoyed by what you said?`)
                            .then((answer) => {
                                if(answer){
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
    openAiQuery: string,
    action: string,
){
    dispatch(actionSetScreen('showText'));
    getCompletion(openAiKey, openAiQuery)
        .then((textResult) => {
            const finalText = `${openAiQuery}\n${textResult}`;
            if(action === 'friend:ask:payForDinner'){
                answerQuestion(openAiKey, finalText, `Did Jonas agreed to pay for dinner?`)
                .then((answer) => {
                    if(answer){
                        batch(() => {
                            dispatch(actionFriendPaysForDinner());
                            dispatch(actionAddMessage('Jonas will pay the dinner.'));
                        })
                    }
                });
            }
            if(action === 'friend:ask:giveGoodTip'){
                answerQuestion(openAiKey, finalText, `Did Jonas agreed to give the waitress a good tip?`)
                    .then((answer) => {
                        if(answer){
                            batch(() => {
                                dispatch(actionFriendWillGiveAGoodTip());
                                dispatch(actionAddMessage('Jonas will give the waitress a good tip.'));
                            })
                        }
                    });
            }
            answerQuestion(openAiKey, finalText, `Does Jonas liked what you said?`)
                .then((answer) => {
                    if(answer){
                        batch(() => {
                            dispatch(actionIncreaseFriendTrustOnPlayer());
                            dispatch(actionAddMessage('You gained more trust from Jonas.'));
                        })
                    }else{
                        answerQuestion(openAiKey, finalText, `Is Jonas annoyed by what you said?`)
                            .then((answer) => {
                                if(answer){
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
    'waitress:order:food': 'You call the waitress to order food, but not drinks yet',
    'waitress:order:drink': 'You call the waitress to order only the drinks',
    'waitress:ask:bill': 'You call the waitress and asks for the bill',
    'waitress:ask:bathroom': 'You call the waitress and asks to use the bathroom. There is no bathroom on this restaurant, only the bathroom for employees',
    'waitress:ask:employeeBathroom': 'You call the waitress and asks to use the employees bathroom. The bathroom is only for employees with the key',
    'waitress:compliment:service': 'You are very happy with the service and decides to give the waitress a compliment on her service',
    'waitress:compliment:waitress': 'You decide to compliment the waitress on her wonderfull service',
    'waitress:compliment:restaurant': 'You like the restaurant atmosphere and decides to call the waitress to give a compliment to the restaurant',
    'waitress:compliment:food': 'You decide to call the waitress to tell her you really like the food',
    'waitress:complain:service': 'You are dissatisfied with the service and decides to complain to the waitress',
    'waitress:complain:waitress': 'You call the waitress to complain about her and tell her how awfull she is',
    'waitress:complain:restaurant': 'You hated this restaurant and decides to call the waitress to let her know about it',
    'waitress:complain:food': 'You did not liked the food and decides to call the waitress to let her know about it',
}

const interactionsWithFriend: Interactions = {
    'friend:ask:payForDinner': 'You ask Jonas if he can pay the bill for the dinner',
    'friend:ask:giveGoodTip': 'You ask Jonas to give a good tip for the waitress',
    'friend:talk:boats': 'You start a conversation about boats with Jonas. Jonas really likes to talk about boats',
    'friend:talk:cars': 'You start a conversation about cars with Jonas. Jonas really likes to talk about cars',
    'friend:talk:photography': 'You start a conversation about photography with Jonas. Jonas really likes to talk about photography',
    'friend:talk:computers': 'You start a conversation about computers with Jonas. Jonas hates to talk about computers',
    'friend:talk:pets': 'You start a conversation about pets with Jonas. Jonas hates to talk about pets',
    'friend:talk:tv': 'You start a conversation about tv shows with Jonas. Jonas hates to talk about tv shows',
    'friend:talk:weather': 'You start a conversation about the weather with Jonas',
    'friend:talk:food': 'You start a conversation about the food from this restaurant with Jonas',
    'friend:talk:drink': 'You start a conversation about the drinks from this restaurant with Jonas',
    'friend:compliment:intelligence': 'You compliment Jonas on his intelligence',
    'friend:compliment:appearance': 'You compliment Jonas on his appearance',
    'friend:compliment:personality': 'You compliment Jonas on his personality',
}

function textWrapper(
    restaurantDescription: string, 
    facts: string[], 
    talkingTo: string,
    action: string
): string {
    return `This scene happens at the restaurant. You are having dinner with your friend Jonas.

Restaurant description:

${restaurantDescription}

This is a dialog between you and ${talkingTo}.
Please notice that:
${facts.map(fact => '- '+fact).join('\n')}
${action}. This is how the scene goes:`;
}

export async function dispatchActionQueryRestaurantDescription(dispatch: Dispatch<AnyAction>, openAiKey: string) {
    const openAiQuery = `This is the restaurant description:`;
  
    getCompletion(openAiKey, openAiQuery)
      .then((result) => dispatch(actionSetRestaurantDescription(result)))
      .catch((e) =>{
        console.error(e);
        dispatch(actionSetScreen('error'));
      });
  }

export async function dispatchPlayerAction(
    dispatch: Dispatch<AnyAction>, 
    currentState: GameState, 
    openAiKey: string,
    action: PlayerAction
) {
    const talkingTo = action.startsWith('waitress') ? 'the waitress' : 'Jonas' ;
    const facts = getFactsFromGamestate(currentState);
    
    if(action.startsWith('waitress')){
        let interaction = interactionsWithWaitress[action];
        interactWithWaitress(
            dispatch, 
            openAiKey, 
            textWrapper(
                currentState.restaurantDescription, 
                facts, 
                talkingTo, 
                interaction
            ),
            action
        );
    }
    if(action.startsWith('friend')){
        let interaction = interactionsWithFriend[action];
        interactWithFriend(
            dispatch, 
            openAiKey, 
            textWrapper(
                currentState.restaurantDescription, 
                facts, 
                talkingTo, 
                interaction
            ),
            action
        );
    }
}

export default gameStateSlice.reducer