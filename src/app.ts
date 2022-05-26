import fetch from 'node-fetch';

let apiToken = process.env.OPENAI_API_KEY;

type Relation = {
    name: string,
    score: number
};

type Person = {
    name: string,
    age: number,
    job: string,
    hobbies: string[],
    dislikes: string[],
    relations?: Relation[],
};

const player: Person = {
    name: 'Luke',
    age: 36,
    job: 'Engineer',
    hobbies: ['reading', 'boats', 'cars', 'taking pictures'],
    dislikes: ['travelling', 'sports', 'animals', 'children'],
};

const people: Person[] = [
    {
        name: 'John',
        age: 20,
        job: 'intern',
        hobbies: ['reading', 'boats', 'cars', 'taking pictures'],
        dislikes: ['travelling', 'sports', 'animals', 'children'],
        relations: [
            {
                name: 'Luke',
                score: 1
            }
        ]
    },
];

function getPerson(name: string): Person {
    const p = people.find(p => p.name === name);
    if (!p) {
        throw new Error(`Person ${name} not found`);
    }
    return p;
}

function describePerson(person: Person) {
    return `${person.name} is ${person.age} years old. ${person.name} is a ${person.job}. 
    ${person.name} likes ${person.hobbies.join(', ')}. ${person.name} dislikes ${person.dislikes.join(', ')}.`
}

function increaseRelation(person1Name: string, person2Name: string) {
    const person1 = getPerson(person1Name);
    const relation = person1.relations?.find(r => r.name === person2Name);
    if (relation) {
        relation.score = (relation.score === 4)? 4 :  relation.score + 1;
    }else{
        person1.relations?.push({name: person2Name, score: 1});
    }
}

function decreaseRelation(person1Name: string, person2Name: string) {
    const person1 = getPerson(person1Name);
    const relation = person1.relations?.find(r => r.name === person2Name);
    if (relation) {
        relation.score = (relation.score === 0)? 0 :  relation.score - 1;
    }else{
        person1.relations?.push({name: person2Name, score: 0});
    }
}


function describeRelation(person1Name: string, person2Name: string, score?: number) {
    switch(score) {
        case 0:
            return `${person1Name} do not trust ${person2Name}.`;
        case 1:
            return `${person1Name} has no opinion on ${person2Name}.`;
        case 2:
            return `${person1Name} likes ${person2Name}.`;
        case 3:
            return `${person1Name} thinks ${person2Name} as a friend.`;
        case 4:
            return `${person1Name} really trusts ${person2Name} and think they are friends .`;
    }
    return `${person1Name} has no opinion on ${person2Name}.`;
}

function describePeopleRelation(person1: Person, person2: Person) {
    const relation = person1.relations?.find(r => r.name === person2.name);
    if(!relation) return '';
    const person1Person2Score = relation.score;
    return describeRelation(person1.name, person2.name, person1Person2Score);
}

function evaluateInteraction(person1Name: string, person2Name: string){
    return `Does ${person1Name} enjoyed the interaction with ${person2Name}, yes or no?`;
}

function gptCompletion(text: string): Promise<unknown> {
    return fetch("https://api.openai.com/v1/engines/text-davinci-002/completions", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
        },
        body: wrapTextToGPT(text)
        })
        .then(r => r.json())
        .then((r: any) => {
            const response = r.choices[0].text;
            console.log(`+++++++++++++++++++++++++++++++
            Local:${text}
            GPT:${response}
            ++++++++++++++++++++++++++++++++++`);
            return response;
        });
}

const personA = player;
const personB = getPerson('John');

let situations = [`meet at the company office.`];


const text = `${describePerson(personA)}
${describePeopleRelation(personA, personB)}
${describePerson(personB)}
${describePeopleRelation(personB, personA)}`;

// ACTUAL GAMEPLAY !!!!!!!!!!!!!!!!!!!!!!!!!

// Next situation (random?)
const situation = `${personA.name} and ${personB.name} ${situations[0]}`;
console.log(situation)
// Show options
const topicOptions = ['weather', 'sports', 'animals', 'children', 'travelling', 'robots', 'beaches', 'fruits', 'birds'];
const interactions = ['start a conversation about', 'tell a joke about', 'compliment'];
// Player chooses interaction
// 'start a conversation about' 'weather'
const interaction = 0;
const topic = 0;
// Player implants a thought on npc (sentence of maximun five words)
const inception = `I love talking to Luke.`;
//const inception = `I hate talking to Luke.`;

const inceptionTextForGPT = `${personB.name} is thinking: '${inception}'`;

// ========================================================= End turn

const chosenInteraction = `${personA.name} ${interactions[interaction]} ${topicOptions[topic]}`

console.log(chosenInteraction);

const askGPTToRenderScene = `${text}
${situation}
${chosenInteraction}
${inceptionTextForGPT}
This is what happens:

`;

function wrapTextToGPT(text: string):string{
    return JSON.stringify({
        "prompt": text,
        "max_tokens": 256,
        "temperature": 0.9,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
    });
}

gptCompletion(askGPTToRenderScene).then((text: any) => {

    console.log(text);

    const newSituation = `${askGPTToRenderScene} ${text}
    ${evaluateInteraction(personB.name, personA.name)}`;

    gptCompletion(newSituation).then((text: any) => {
        const gptRepsonse: string = text.trim().toLowerCase();
        if(gptRepsonse.includes('yes')){
            console.log(`${personB.name} opinion of ${personA.name} improved.`);
            increaseRelation(personB.name, personA.name);
        }else{
            console.log(`${personB.name} opinion of ${personA.name} worsened.`);
            decreaseRelation(personB.name, personA.name);
        }
        console.log(JSON.stringify(people, null, 2));
    })
});