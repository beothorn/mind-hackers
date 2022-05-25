# mind-hackers

A game/experiment using gpt-3 api.

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

# MVP

A text game where you try to get promoted inside a company, starting as an intern and climbing up the ladder.

Ideas:
 - Series of events, maybe partially created by gpt3, where the output updates your status on the company, how the coworkers perceive the player.
 - After a year gpt3 interview player and decide if they get a promotion or a raise.
 - At the start player only see the narrative part. Later player acquires mind reading powers. At some point the player is able to insert thoughts on other npcs.

