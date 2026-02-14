import { randomUUID } from 'crypto';

const localRuntimeUrl = 'http://localhost:8080/invocations';
const prompt = 'Tell me a joke';
const runtimeSessionId = randomUUID();

// agentcore deploy --local
const response = await fetch(localRuntimeUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
    'x-amzn-bedrock-agentcore-runtime-session-id': runtimeSessionId,
  },
  body: JSON.stringify({ prompt }),
});

if (!response.ok) {
  const errorBody = await response.text();
  throw new Error(`Local invoke failed: ${response.status} ${response.statusText} - ${errorBody}`);
}

const textResponse = await response.text();

console.log('Response:', textResponse);