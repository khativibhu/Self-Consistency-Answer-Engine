import OpenAI from 'openai';
import "dotenv/config";
import {z} from "zod";
import { zodTextFormat, zodResponseFormat } from "openai/helpers/zod";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.ROUTER_API_KEY,
});

const outputSchema = z.object({
  name: z.string().describe("model name of the ai assistant used"),
  reply: z.string().describe("actual response in string format"),
});

async function main() {
   const claudeStyleBot = `
     ╭──────────────────────────────────────╮
     │  ◈  MULTI-MODEL AI ASSISTANT         │
     │     Multiple Model's responses + final evaluator │
     ╰──────────────────────────────────────╯
              ┌───────────────┐
              │   ◉       ◉   │
              │       ▱       │
              └───────┬───────┘
                  ┌───┴───┐
               ┌──┘       └──┐
              /   AI ASSISTANT ╲
             /_________________╲
`;

  console.log(claudeStyleBot);


    const rl = readline.createInterface({ input, output});

    const userPrompt = await rl.question("Enter your prompt: ");
    rl.close();

    try{
  const completion = await openai.responses.parse({
   // model: "nousresearch/hermes-3-llama-3.1-405b:free",
   //model: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
   model:'tencent/hy3:free',
    input: [
      {
        role: "system",
        "content": "You are hermes-3-llama model. Always gives response in less than 50 words."
      }, 
      {
        "role": "user",
        "content": userPrompt,
      }
    ],
    text: {
     format: zodTextFormat(outputSchema,"reply"),
    }
  });

 // console.log(completion.choices[0].message);
  console.log(completion.output_parsed);
  const json = JSON.stringify(completion.output_parsed);
  console.log("model1:",json);
  const answer1 = json;

  //for model 2
  const client = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


   const result = await client.chat.completions.create({
      model: "gemini-3.1-flash-lite",
      messages: [
      {
        role: "system",
        "content": "You are gemini-3.1-flash-lite model. Always gives response in less than 50 words."
      },  
      {
        "role": "user",
        "content": userPrompt,
      }
    ],
    response_format: zodResponseFormat(outputSchema, "reply"),
     
    });

 // console.log("model2:",result.choices[0].message);
 console.log("model2:",result.choices[0].message.content);

  const answer2 = result.choices[0].message.content;


  //our thinking model
  const finalMessageArray =  [
       {
        "role": "assistant",
        "content": answer1,
       },
        {
        "role": "assistant",
        "content": answer2,
       },

        {
        role: 'system',
        content: "You are a final evaluator model. You are asked to compare the responses of the models, identify the strongest parts, and generate the best possible final response. The final answer shown to the user should not simply copy one model’s response. It should be a refined output created after analyzing all model responses.",
        }
    ];

  const finalResult = await client.chat.completions.create({
    model: "gemini-3.1-flash-lite",
    messages: finalMessageArray,
    }); 

  console.log(finalResult.choices[0].message.content);

}
catch(error){
    console.log("Rate Limit:",error);
}
}

main();
