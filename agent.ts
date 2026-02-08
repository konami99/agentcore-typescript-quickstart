import { BedrockAgentCoreApp } from 'bedrock-agentcore/runtime';
import { Agent } from '@strands-agents/sdk';

// Create a Strands agent
const agent = new Agent();

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