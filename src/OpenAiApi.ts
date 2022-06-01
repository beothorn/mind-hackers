import axios from 'axios';

export const getCompletion = (openAiKey: string, query: string) => axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions', {
    "prompt": query,
    "max_tokens": 256,
    "temperature": 0.9,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0,
}, {
    headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json'
    }
});

export const listEngines = (openAiKey: string) => axios.get('https://api.openai.com/v1/engines', {
    headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json'
    }
});