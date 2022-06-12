// Just throwing some ideas here.
// If I can make one structure to describe the game
// maybe it can have more dynamic parts
// but still allow traditional logic

const game = {
    /*
        We need to be able to update facts depending on the ai answer, for this we use an
        identification field subject.

        We need to be able to render only relevant facts, for this we use relatesTo

        value is the actual fact
    */
    actions: [
        {
            name: 'orderFood',
            description: 'Order food',
            text: 'You call the waitress to order food, but do not order drinks',
            tree: ['waitress', 'order', 'food'],
            updateFacts: [
                {
                    updates: 'waitressAnnoyed',
                    question: 'Did the waitress gave you the key to the employees bathroom?',
                    ifTrue: {
                        value: 'The waitress is annoyed by you.',
                    },
                    ifFalse: {
                        value: 'The waitress is not annoyed by you.',
                    },
                }
            ]
        }
    ],
    facts: [
        {
            subject: 'restaurantDescription',
            relatesTo: 'restaurant',
            value: 'None given yet.',
        },
        {
            subject: 'needsBathroom',
            relatesTo: 'you',
            value: 'You really need to go to the bathroom.',
        },
        {
            subject: 'forgotWallet',
            relatesTo: 'you',
            value: 'You forgot to bring your wallet.',
        },
        {
            subject: 'friendPays',
            relatesTo: 'friend',
            value: 'Jonas does not want to pay the dinner for you.',
            update: {
                question: 'Did Jonas agreed to pay for dinner?',
                ifTrue: {
                    value: 'Jonas does not want to pay the dinner for you.',
                },
                ifFalse: {
                    value: 'Jonas want to pay the dinner for you.',
                },
            }
        },
        {
            subject: 'waitressAnnoyed',
            relatesTo: 'waitress',
            value: 'The waitress is not annoyed by you.',
        },
        {
            subject: 'waitressTrust',
            relatesTo: 'waitress',
            value: 0,
            update: {
                question: 'Is the waitress annoyed by what you said?',
                ifTrue: {
                    value: 'The waitress is annoyed by you.',
                },
                ifFalse: {
                    value: 'The waitress is not annoyed by you.',
                },
            }
        },
        {
            subject: 'employeesBathroomKey',
            relatesTo: 'you',
            value: 'The waitress is not annoyed by you.',
            update: {
                question: 'Is the waitress annoyed by what you said?',
                ifTrue: {
                    value: 'The waitress is annoyed by you.',
                },
                ifFalse: {
                    value: 'The waitress is not annoyed by you.',
                },
            }
        },
    ],
    
    player: {
        hasBathroomKey: false,
    },
    waitress: {
        player: {
            thinksIsAnEmployee: false,
            trust: 0, 
        },
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