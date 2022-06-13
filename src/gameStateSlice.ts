import { Dispatch, PayloadAction, AnyAction, createSlice } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import { actionSetScreen, actionAddMessage } from './appStateSlice'

import type { RootState } from './store'

import { getCompletion, getSmallCompletion, answerQuestion } from './OpenAiApi'

type Context = 'bathroom' | 'waitress' | 'friend' | 'payment' | 'wallet' | 'order';

type Fact = {
    fact: string,
    context: Context[]
}

const waitressHasKey: Fact = {
    fact: 'The waitress have the key to the employees bathroom.',
    context: ['bathroom', 'waitress']
};
const playerHasKey: Fact = {
    fact: 'You have the key to the employees bathroom.',
    context: ['bathroom', 'waitress']
};
const friendWantsToPay: Fact = {
    fact: 'Jonas wants to pay the dinner for you.',
    context: ['payment']
};
const friendDontWantToPay: Fact = {
    fact: 'Jonas does not want to pay the dinner for you.',
    context: ['payment']
};
const friendWillGiveTheWaitressAGoodTip: Fact = {
    fact: 'Jonas wants to give the waitress a very good tip.',
    context: ['payment']
};
const friendWontGiveTheWaitressAGoodTip: Fact = {
    fact: 'Jonas does not want to give a good tip for the waitress, just the regular amount.',
    context: ['payment']
};

type GameState = {
    lastText: string,
    restaurantDescription: string,
    restaurantType: string,
    facts: Fact[],
    order: string,
    waitress: {
        player: {
            trust: number, 
        },
    },
    friend: {
        player: {
            trust: number, 
        },
    }
}

const initialState: GameState = {
    lastText: 'Loading...',
    facts: [
        {
            fact: 'You really need to go to the bathroom.',
            context: ['bathroom']
        } as Fact,
        {
            fact: 'You forgot to bring your wallet',
            context: ['wallet']
        } as Fact,
        waitressHasKey,
        friendDontWantToPay,
        friendWontGiveTheWaitressAGoodTip,
    ],
    order: '',
    restaurantDescription: '',
    restaurantType: '',
    waitress: {
        player: {
            trust: 0, 
        },
    },
    friend: {
        player: {
            trust: 5, 
        },
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
            if(action){
                state.facts = state.facts.filter(fact => fact !== waitressHasKey);
                state.facts.push(playerHasKey);
            }else{
                state.facts = state.facts.filter(fact => fact !== playerHasKey);
                state.facts.push(waitressHasKey);
            }
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
        setRestaurantType: (state: GameState, action: PayloadAction<string>) => {
          state.restaurantType = action.payload;
        },
        setOrder: (state: GameState, action: PayloadAction<string>) => {
          state.order = action.payload;
        },
        friendPaysForDinner: (state: GameState) => {
            state.facts = state.facts.filter(fact => fact !== friendDontWantToPay);
            state.facts.push(friendWantsToPay);
        },
        friendWillGiveAGoodTip: (state: GameState) => {
            state.facts = state.facts.filter(fact => fact !== friendWontGiveTheWaitressAGoodTip);
            state.facts.push(friendWillGiveTheWaitressAGoodTip);
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
export const selectRestaurantType = (state: RootState) => state.gameState.restaurantType
export const selectOrder = (state: RootState) => state.gameState.order

export const selectPlayerHasKey = (state: RootState) => state.gameState.facts.findIndex(f => f.fact === playerHasKey.fact) > -1;

export const actionSetRestaurantDescription = (description: string) => ({type: 'gameState/setRestaurantDescription', payload: description})
export const actionSetPlayerHasBathroomKey = (hasBathroomKey: boolean) => ({type: 'gameState/setPlayerHasBathroomKey', payload: hasBathroomKey})
export const actionSetRestaurantType= (restaurantType: string) => ({type: 'gameState/setRestaurantType', payload: restaurantType})
export const actionSetOrder= (restaurantType: string) => ({type: 'gameState/setOrder', payload: restaurantType})
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

function getFactsFromGamestate(gameState: GameState, contexts: Context[]): string[] {
    const facts = [];

    if(contexts.includes('waitress')){
        facts.push(trust('The waitress', 'you', gameState.waitress.player.trust));
        facts.push(trust('The waitress', 'Jonas', gameState.waitress.player.trust));
    }

    if(contexts.includes('friend')){
        facts.push(trust('Jonas', 'you', gameState.friend.player.trust));
    }
    
    if(contexts.includes('order')){
        if(gameState.order !== ''){
            facts.push(`You ordered ${gameState.order}`);
        }
    }

    facts.push('On this restaurant you pay the bill at the end of your meal, so they don\'t pay the bill in this scene.');

    for(const fact of Array.from(gameState.facts)){
        if(fact.context.filter(context => contexts.includes(context)).length > 0){
            facts.push(fact.fact);
        }
    }

    return facts;
}

export type PlayerAction = 'waitress:order:placeOrder' | 
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

function inquirer(openAiKey:string, finalText:string){
    return (question: string, ifTrue: () => void, ifFalse?: () => void) => 
        answerQuestion(openAiKey, finalText, question).then( answer => {
            if(answer){
                ifTrue();
            }else{
                if(ifFalse){
                    ifFalse();
                }
            }
        } );
}

function interactWithWaitress(
    dispatch: Dispatch<AnyAction>, 
    openAiKey: string,
    openAiQuery: string,
    action: string,
){
    dispatch(actionSetScreen('showText'));
    
    getCompletion(openAiKey, openAiQuery).then((textResult) => {
        const finalText = `${openAiQuery}\n${textResult}`;
        const furtherQuestion = inquirer(openAiKey, finalText);

        if(action === 'waitress:order:placeOrder'){
            getSmallCompletion(openAiKey, `${finalText}\nThe waitress wrote down the order:\n-`)
                .then((textResult) => dispatch(actionSetOrder(textResult)));
        }

        if(action === 'waitress:ask:employeeBathroom'){
            furtherQuestion('Did the waitress gave you the key to the employees bathroom?', () => batch(() => {
                dispatch(actionSetPlayerHasBathroomKey(true));
                dispatch(actionAddMessage('You now you have the key to the employees bathroom.'));
            }));
        }

        furtherQuestion('Does the waitress liked what you said?', () => batch(() => {
            dispatch(actionIncreaseWaitressTrustOnPlayer());
            dispatch(actionAddMessage('You gained more trust from the waitress.'));
        }), () => furtherQuestion(`Is the waitress annoyed by what you said?`, () => batch(() => {
            dispatch(actionDecreaseWaitressTrustOnPlayer());
            dispatch(actionAddMessage('The waitress is annoyed by this interaction.'));
        })));

        dispatch(actionSetLastText(textResult));
    }).catch(() => dispatch(actionSetScreen('error')));
}

function interactWithFriend(
    dispatch: Dispatch<AnyAction>, 
    openAiKey: string,
    openAiQuery: string,
    action: string,
){

    dispatch(actionSetScreen('showText'));
    getCompletion(openAiKey, openAiQuery).then((textResult) => {
        const finalText = `${openAiQuery}\n${textResult}`;
        const furtherQuestion = inquirer(openAiKey, finalText);

        if(action === 'friend:ask:payForDinner'){
            furtherQuestion(`Did Jonas agreed to pay for dinner?`,() => batch(() => {
                dispatch(actionFriendPaysForDinner());
                dispatch(actionAddMessage('Jonas will pay the dinner.'));
            }));
        }

        if(action === 'friend:ask:giveGoodTip'){
            furtherQuestion(`Did Jonas agreed to give the waitress a good tip?`,() => batch(() => {
                dispatch(actionFriendWillGiveAGoodTip());
                dispatch(actionAddMessage('Jonas will give the waitress a good tip.'));
            }));
        }

        furtherQuestion(`Does Jonas liked what you said?`, () => batch(() => {
            dispatch(actionIncreaseFriendTrustOnPlayer());
            dispatch(actionAddMessage('You gained more trust from Jonas.'));
        }), () => furtherQuestion(`Is Jonas annoyed by what you said?`, () => batch(() => {
            dispatch(actionDecreaseFriendTrustOnPlayer());
            dispatch(actionAddMessage('Jonas is annoyed by this interaction.'));
        })));
        
        dispatch(actionSetLastText(textResult));
    }).catch(() => dispatch(actionSetScreen('error')));
}

function doSomething(
    dispatch: Dispatch<AnyAction>, 
    openAiKey: string,
    openAiQuery: string
){

    dispatch(actionSetScreen('showText'));
    getCompletion(openAiKey, openAiQuery).then((textResult) => {        
        dispatch(actionSetLastText(textResult));
    }).catch(() => dispatch(actionSetScreen('error')));
}

type Interactions = {
    [key in PlayerAction as string]: {interaction: string, contexts: Context[]};
};

const interactionsWithWaitress: Interactions = {
    'waitress:order:placeOrder': {
        interaction: 'You call the waitress to place the order',
        contexts: ['waitress']
    },
    'waitress:ask:bill': {
        interaction: 'You call the waitress and asks for the bill',
        contexts: ['waitress', 'payment'],
    },
    'waitress:ask:bathroom': {
        interaction: 'You call the waitress and asks to use the bathroom. There is no bathroom on this restaurant, only the bathroom for employees',
        contexts: ['waitress', 'bathroom'],
    },
    'waitress:ask:employeeBathroom': {
        interaction: 'You call the waitress and asks to use the employees bathroom. The bathroom is only for employees with the key',
        contexts: ['waitress', 'bathroom'],
    },
    'waitress:compliment:service': {
        interaction: 'You are very happy with the service and decides to give the waitress a compliment on her service',
        contexts: ['waitress']
    },
    'waitress:compliment:waitress': {
        interaction: 'You decide to compliment the waitress on her wonderfull service',
        contexts: ['waitress']
    },
    'waitress:compliment:restaurant': {
        interaction: 'You like the restaurant atmosphere and decides to call the waitress to give a compliment to the restaurant',
        contexts: ['waitress', 'order']
    },
    'waitress:compliment:food': {
        interaction: 'You decide to call the waitress to tell her you really like the food',
        contexts: ['waitress']
    },
    'waitress:complain:service': {
        interaction: 'You are dissatisfied with the service and decides to complain to the waitress',
        contexts: ['waitress']
    },
    'waitress:complain:waitress': {
        interaction: 'You call the waitress to complain about her and tell her how awfull she is',
        contexts: ['waitress']
    },
    'waitress:complain:restaurant': {
        interaction: 'You hated this restaurant and decides to call the waitress to let her know about it',
        contexts: ['waitress']
    },
    'waitress:complain:food': {
        interaction: 'You did not liked the food and decides to call the waitress to let her know about it',
        contexts: ['waitress', 'order']
    },
}

const interactionsWithFriend: Interactions = {
    'friend:ask:payForDinner': {
        interaction: 'You ask Jonas if he can pay the bill for the dinner',
        contexts: ['friend', 'payment'],
    },
    'friend:ask:giveGoodTip': {
        interaction: 'You ask Jonas to give a good tip for the waitress',
        contexts: ['friend', 'payment'],
    },
    'friend:talk:boats': {
        interaction: 'You start a conversation about boats with Jonas. Jonas really likes to talk about boats',
        contexts: ['friend'],
    },
    'friend:talk:cars': {
        interaction: 'You start a conversation about cars with Jonas. Jonas really likes to talk about cars',
        contexts: ['friend'],
    },
    'friend:talk:photography': {
        interaction: 'You start a conversation about photography with Jonas. Jonas really likes to talk about photography',
        contexts: ['waitress']
    },
    'friend:talk:computers': {
        interaction: 'You start a conversation about computers with Jonas. Jonas hates to talk about computers',
        contexts: ['friend'],
    },
    'friend:talk:pets': {
        interaction: 'You start a conversation about pets with Jonas. Jonas hates to talk about pets',
        contexts: ['friend'],
    },
    'friend:talk:tv': {
        interaction: 'You start a conversation about tv shows with Jonas. Jonas hates to talk about tv shows',
        contexts: ['waitress']
    },
    'friend:talk:weather': {
        interaction: 'You start a conversation about the weather with Jonas',
        contexts: ['friend'],
    },
    'friend:talk:food': {
        interaction: 'You start a conversation about the food from this restaurant with Jonas',
        contexts: ['friend', 'order'],
    },
    'friend:talk:drink': {
        interaction: 'You start a conversation about the drinks from this restaurant with Jonas',
        contexts: ['friend', 'order'],
    },
    'friend:compliment:intelligence': {
        interaction: 'You compliment Jonas on his intelligence',
        contexts: ['waitress']
    },
    'friend:compliment:appearance': {
        interaction: 'You compliment Jonas on his appearance',
        contexts: ['friend'],
    },
    'friend:compliment:personality': {
        interaction: 'You compliment Jonas on his personality',
        contexts: ['friend'],
    },
};

const interactionsWithNoone: Interactions = {
    'you:go:employeeBathroom': {
        interaction: 'You can finally go to the employees bathroom, and getting there you see something that changes your life forever',
        contexts: ['bathroom'],
    },
};

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
It is very important to notice that:
${facts.map(fact => '- '+fact).join('\n')}

${action}. This is how the scene goes:`;
}

export async function dispatchActionQueryRestaurantDescription(dispatch: Dispatch<AnyAction>, openAiKey: string, restaurantType: string) {
    const openAiQuery = `This is the ${restaurantType} restaurant description:`;
  
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
    
    
    if(action.startsWith('waitress')){
        let interaction = interactionsWithWaitress[action];
        const facts = getFactsFromGamestate(currentState, interaction.contexts);
        interactWithWaitress(
            dispatch, 
            openAiKey, 
            textWrapper(
                currentState.restaurantDescription, 
                facts, 
                talkingTo, 
                interaction.interaction
            ),
            action
        );
    }
    if(action.startsWith('friend')){
        let interaction = interactionsWithFriend[action];
        const facts = getFactsFromGamestate(currentState, interaction.contexts);
        interactWithFriend(
            dispatch, 
            openAiKey, 
            textWrapper(
                currentState.restaurantDescription, 
                facts, 
                talkingTo, 
                interaction.interaction
            ),
            action
        );
    }

    if(action.startsWith('you')){
        let interaction = interactionsWithNoone[action];
        const facts = getFactsFromGamestate(currentState, interaction.contexts);
        doSomething(
            dispatch, 
            openAiKey, 
            textWrapper(
                currentState.restaurantDescription, 
                facts, 
                talkingTo, 
                interaction.interaction
            )
        );
    }
}

export default gameStateSlice.reducer