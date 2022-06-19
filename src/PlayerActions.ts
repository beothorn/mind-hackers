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

export type Context = 'bathroom' | 'waitress' | 'friend' | 'friendConversation' | 'payment' | 'wallet' | 'order';

export type Fact = {
    fact: string,
    context: Context[]
}

type Interactions = {
    [key in PlayerAction as string]: {interaction: string, contexts: Context[]};
};

export const interactions: Interactions = {
    //Waitress
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
    // Friend
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
        contexts: ['friend', 'friendConversation'],
    },
    'friend:talk:cars': {
        interaction: 'You start a conversation about cars with Jonas. Jonas really likes to talk about cars',
        contexts: ['friend', 'friendConversation'],
    },
    'friend:talk:photography': {
        interaction: 'You start a conversation about photography with Jonas. Jonas really likes to talk about photography',
        contexts: ['friend', 'friendConversation']
    },
    'friend:talk:computers': {
        interaction: 'You start a conversation about computers with Jonas. Jonas hates to talk about computers',
        contexts: ['friend', 'friendConversation'],
    },
    'friend:talk:pets': {
        interaction: 'You start a conversation about pets with Jonas. Jonas hates to talk about pets',
        contexts: ['friend', 'friendConversation'],
    },
    'friend:talk:tv': {
        interaction: 'You start a conversation about tv shows with Jonas. Jonas hates to talk about tv shows',
        contexts: ['friend', 'friendConversation']
    },
    'friend:talk:weather': {
        interaction: 'You start a conversation about the weather with Jonas',
        contexts: ['friend', 'friendConversation'],
    },
    'friend:talk:food': {
        interaction: 'You start a conversation about the food from this restaurant with Jonas',
        contexts: ['friend', 'friendConversation', 'order'],
    },
    'friend:talk:drink': {
        interaction: 'You start a conversation about the drinks from this restaurant with Jonas',
        contexts: ['friend', 'friendConversation', 'order'],
    },
    'friend:compliment:intelligence': {
        interaction: 'You compliment Jonas on his intelligence',
        contexts: ['friend']
    },
    'friend:compliment:appearance': {
        interaction: 'You compliment Jonas on his appearance',
        contexts: ['friend'],
    },
    'friend:compliment:personality': {
        interaction: 'You compliment Jonas on his personality',
        contexts: ['friend'],
    },
    //You
    'you:go:employeeBathroom': {
        interaction: 'You can finally go to the employees bathroom, and getting there you see something that changes your life forever',
        contexts: ['bathroom'],
    },
};