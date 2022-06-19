import { Dispatch, PayloadAction, AnyAction, createSlice } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import { actionSetScreen, actionAddMessage } from './appStateSlice'

import type { RootState } from './store'

import { Fact, PlayerAction, Context, interactions } from './PlayerActions';

import { getCompletion, getSmallCompletion, answerQuestion } from './OpenAiApi'

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
        addFact: (state: GameState, action: PayloadAction<Fact>) => {
            state.facts.push(action.payload);
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
export const actionAddFact = (newFact: Fact) => ({type: 'gameState/addFact', payload: newFact})

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

function learnFact(
    dispatch: Dispatch<AnyAction>, 
    openAiKey: string, 
    finalText: string, 
    context: Context[]
){
    getCompletion(openAiKey, `${finalText}
In one sentence, a new thing we learned is that:\n-`)
        .then((factTextResult) => {  
            dispatch(actionAddFact({
                fact: factTextResult,
                context: context
            }));
        });
}

function interactWithWaitress(
    dispatch: Dispatch<AnyAction>, 
    openAiKey: string,
    finalText: string,
    action: string,
    textResult: string
){
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
}

function interactWithFriend(
    dispatch: Dispatch<AnyAction>, 
    openAiKey: string,
    finalText: string,
    action: string,
    textResult: string
){
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

    if(action.startsWith('friend:talk')){
        learnFact(
            dispatch, 
            openAiKey, 
            finalText, 
            ['friendConversation']
        );
    }

    furtherQuestion(`Does Jonas liked what you said?`, () => batch(() => {
        dispatch(actionIncreaseFriendTrustOnPlayer());
        dispatch(actionAddMessage('You gained more trust from Jonas.'));
    }), () => furtherQuestion(`Is Jonas annoyed by what you said?`, () => batch(() => {
        dispatch(actionDecreaseFriendTrustOnPlayer());
        dispatch(actionAddMessage('Jonas is annoyed by this interaction.'));
    })));
    
    dispatch(actionSetLastText(textResult));
}

function doSomething(
    dispatch: Dispatch<AnyAction>, 
    textResult: string,
){   
    dispatch(actionSetLastText(textResult));
}

function textWrapper(
    restaurantDescription: string, 
    facts: string[], 
    action: string
): string {
    const talkingTo = action.startsWith('waitress') ? 'the waitress' : 'Jonas' ;

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
    
    let interaction = interactions[action];
    const facts = getFactsFromGamestate(currentState, interaction.contexts);
    const openAiQuery = textWrapper(
        currentState.restaurantDescription, 
        facts, 
        interaction.interaction
    );

    dispatch(actionSetScreen('showText'));
    getCompletion(openAiKey, openAiQuery).then((textResult) => {  
        const finalText = `${openAiQuery}\n${textResult}`;
        if(action.startsWith('waitress')){
            interactWithWaitress(
                dispatch, 
                openAiKey, 
                finalText,
                action,
                textResult
            );
        }
        if(action.startsWith('friend')){
            interactWithFriend(
                dispatch, 
                openAiKey, 
                finalText,
                action,
                textResult
            );
        }
    
        if(action.startsWith('you')){
            doSomething(
                dispatch, 
                textResult
            );
        }
    }).catch(() => dispatch(actionSetScreen('error')));
}

export default gameStateSlice.reducer