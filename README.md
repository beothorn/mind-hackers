# mind-hackers

A game/experiment using gpt-3 api.

You can skip to the conlcusion at the end or play the protype [here](http://www.isageek.com.br/mind-hackers/)

# Core idea

If we use gpt3 to decide state transition, would the results be consistent? Would it be a fun game?
We can constraint the player to a list of predetermined actions to have control over the narrative.
Then after every interaction we ask gpt3 very specific questions to update the game state.
The game state is hidden from the player. Only the gpt narrative of the events is shown.

The steps would be:
- Generate a text based on state
- Ask gpt3 if a state should be changed
- Update game state
- Describe situation and state change, ask gpt3 to narrate this (gpt3 is treated like a renderer for the game state)

For example, given the state we generate a text:

```
let playerAStatus = {
    name: "Warrior",
    attack: 8,
    weapon: 'fire sword' 
}

let npc = {
    name: "Zombie",
    life: 2,
    defense: 4,
    strength: 'fire',
    weakness: 'cold',
}

let situation = {
    place: 'Mount foo',
    weather: 'snowing'
}

`Warrior and Zombie are fighting on Mount foo. It is snowing. 
The Zombie is strong against fire. The Zombie is weak against cold.
The Warrior attack is two times the Zombie defense.
The Warrior attacks the Zombie with a fire sword.

Does the Zombie gets hurt, yes or no?
`

GPT3 = `Yes`

npc.life --;


GPT_INPUT = `
This text was written by someone who does not know how to write a good story:

Warrior and Zombie are fighting on Mount foo. It is snowing. 
The Zombie is strong against fire. The Zombie is weak against cold.
The Warrior attack is two times the Zombie defense.
The Warrior attacks the Zombie with a fire sword.
The Zombie is hurt by the Warrior.
The Zombie is still alive, but weaker.

If this was written by Tolkien on lord of the rings it would have a lot more details.
Like a description of Mount Foo and the Warrior and The Zombie and the attack. 
It would be very different, like this:

`

GPT3 = `
On Mount Foo, a warrior and a zombie are locked in combat. The air is frigid and snow falls in thick blankets, coating the ground. The zombie is strong against fire, but weak against cold.

The warrior attacks with a fire sword. The zombie is hurt, but does not fall. The battle continues.`

// funny how you need to convince gpt3 to improve the text


```

# The idea

If we have a game like "The sims", describe in a text the log of interactions, the player statuses, the social status and then ask gpt-3 to decide what to do next, what would happen?

If the player is not allowed to write anything on the input, and the whole premise is generated from the game data, would it be fun? 

For example, given the player status and setting we can generate this and ask gpt-3 for more input for the game: 
```
Lucas live in a house with one stove, one fridge, one table, one chair, one television.
Lucas like reading. You are lazy. You want to be a scientist.
Lucas like boats, cars and taking pictures.
Lucas dislike travelling, sports, animals and children.

Lucas likes Jhon.
Lucas hates Mary.

Lucas are well rested.
Lucas are not hungry.
Lucas are a little bored.
Lucas need to go to the bathroom.

Six hours ago, Lucas ate a sandwich.
Five hours ago, Lucas slept 30 minutes.
Four hours and twenty minutes ago, Lucas slept 30 minutes.
Four hours and thirty minutes ago, Lucas talked to Mary.
Four hours and thirty three minutes ago, Lucas told something about boats that you liked. 
Four hours and twenty minutes ago, Lucas told something about sports that you disliked.
Three hours ago, Lucas said goodbye to Mary. 
Two hours ago, Lucas started reading a book.
One hour ago, Lucas stopped reading a book.
Half an hour ago Mary Coldsilver called and Lucas answered the phone.
Fifteen minutes ago Mary told something about animals that Lucas disliked.
Five minutes ago Mary told something about vacations that Lucas disliked.

Mary talks to Lucas about sports, does Lucas like it, yes or no?
```

Another idea is to allow the player to add one phrase to this premise to try hacking the output from gpt-3 by doing an idea inception on the npcs.

That would be the mind-hacking part.

# Proof of concept

A simulation where you are having dinner with a friend.

There are two goals, get your friend to pay for the dinner (including a good tip) and get a key for the employees only bathroom.

There is a fixed list of possible interactions, but you can insert a thought inside the other persons head on each interaction. 

The insertion is a sentence of maximum 5 words and will work only sometimes.

## Game loop

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

## Characters
- Player
- Waitress
- Friend

## Game State:
### Player:
```
Name: text
HasBathroomKey: boolean = false
```
### Waitress
```
Name: text
HasBathroomKey: boolean = true

On Player:
  ThinksIsAnEmployee: boolean = false
  Trust: int: 0 // scale from 0 to 10, interactions can increase this value
  
On Friend:
  Trust: int: 0 // scale from 0 to 10, interactions can increase this value
```

### Friend

```
Name: text
WillPayForDinner: boolean = false
WillGiveAGoodTip: boolean = false
Likes: string[] = ['boats', 'cars', 'photography']
Dislikes: string[] = ['computers', 'pets', 'tv']

On Player:
  Trust: int: 5 // scale from 0 to 10, interactions can increase this value
  
On Waitress:
  IsSatisfiedWithTheService: boolean = true
```

## Interactions

### Waitress

Order 
- Food
- Drink
Ask 
- For the bill
- To use the bathroom
- For the employees bathroom key
Compliment
- Service
- Waitress
- Restaurant
- Food
Complain about
- Service
- Waitress
- Restaurant
- Food


### Friend

Ask
- to pay for the dinner
- to give the waitress a good tip
Talk about
 - Boats
 - Cars
 - Photography
 - Computers
 - Pets
 - Tv
 - Weather
 - Food
 - Drink
Give a compliment

# Conclusion

It is not a feasible idea. It is too hard to keep the text and the state coherent.

Some issues:

GPT3 has a really hard time understanding who said what. 

It usually mistake who is thinking what, even when the text explicitly says to whom that thought or line belongs to.

It likes to go on tangents. I think it is because the temperature.

It would be ok if it was just creative, but usually it drops whathever the text is on about very abruptly and talks about something else.

Sometimes it also likes to just close the story. Even if the text says that something should not happen right now (like paying the bill), gpt3 just
goes and tell the bill is paid and everyone went home.
