import { BedrockAgentCoreApp } from 'bedrock-agentcore/runtime';
import { Agent } from '@strands-agents/sdk';
import { OpenAIModel } from '@strands-agents/sdk/openai';

// Create a Fireworks AI model
const fireworksModel = new OpenAIModel({
  apiKey: "fw_8t7XL9LmtdcwCTzcTD8MCJ",
  clientConfig: {
    baseURL: 'https://api.fireworks.ai/inference/v1',
  },
  modelId: 'accounts/fireworks/models/gpt-oss-20b',
  maxTokens: 5000,
  temperature: 0.7,
});

// Create a Strands agent with Fireworks model
const agent = new Agent({ model: fireworksModel });

// Create and start the server
const app = new BedrockAgentCoreApp({
  invocationHandler: {
    process: async function* (payload, context) {
      const prompt = (payload as { prompt?: string }).prompt ?? 'Hello!';
      console.log(`Session ${context.sessionId} - Received prompt:`, prompt);
      
      for await (const event of agent.stream(prompt)) {
        if (event.type === 'modelContentBlockDeltaEvent' && event.delta?.type === 'textDelta') {
          yield { event: 'message', data: { text: event.delta.text } };
        }
      }
    }
  }
});

app.run();