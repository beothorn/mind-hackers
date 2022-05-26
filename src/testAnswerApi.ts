import fetch from 'node-fetch';

let apiToken = process.env.GPT3_API_TOKEN

let aboutCompany = `Computerz is a big company. It specializes in network systems.`
let aboutPlayer = `Lucas is an internal at Computerz. 
Lucas is hard working. Lucas is not very smart. Lucas likes reading. Lucas like boats, cars and taking pictures.
Lucas dislikes travelling, sports, animals and children.`
let aboutBoss = `Jhon is a manager at Computerz. Jhon do not know Lucas. Jhon does not like Jake.`
let aboutCoworker = `Jake is an internal at Computerz. Jake is lazy. Jake is rich. Jake likes travelling, robots and beaches.
Jake dislikes fruits, birds and cold.`
let situation = `There was a meeting where a big issue with the servers was discussed.
The boss asked what the interns thought was the issue.
Lucas said he thought it was a virus.
Jake  said he thought it was a hardware issue.
Jake was wrong.
Was Jake idea good, yes or no?`

let data = {
    "documents": [aboutCompany, aboutPlayer, aboutBoss, aboutCoworker],
    "question": situation,
    "search_model": "ada",
    "model": "curie",
    "examples_context": "There was a meeting with the engineer team. They discussed about issues. Jhon said the problem was server X. Bob said the problem was server B.",
    "examples": [["Was Bob idea good, yes or no?","Yes."], ["Was Jhon idea good, yes or no?","No."]],
    "max_tokens": 100,
    "stop": ["\n", "<|endoftext|>"]
}

fetch("https://api.openai.com/v1/answers", {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
}).then(r => r.json()).then(j => console.log(j))