import axios from 'axios';

const openAiUrl = 'https://api.openai.com/v1';
const engine = 'text-davinci-002';

export const getCompletion = (openAiKey: string, query: string) => axios.post(`${openAiUrl}/engines/${engine}/completions`, {
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
}).then((result) => {
    const text = result.data.choices[0].text.trim();
    console.log({query, text});
    return text;
});

export const listEngines = (openAiKey: string) => axios.get(`${openAiUrl}/engines`, {
    headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json'
    }
});