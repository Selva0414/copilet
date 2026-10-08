const testUrls = [
  'https://ai-agent-v01.onrender.com',
  'https://ai-agent-v01.onrender.com/chat',
  'https://ai-agent-v01.onrender.com/api/chat',
  'https://ai-agent-v01.onrender.com/message'
];

async function run() {
  for (const url of testUrls) {
    try {
      console.log(`Testing POST ${url}`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "hello", prompt: "hello" })
      });
      console.log(`Status: ${res.status}`);
      const text = await res.text();
      console.log(`Body: ${text.substring(0, 100)}\n`);
    } catch (e) {
      console.log(`Error: ${e.message}\n`);
    }
  }
}

run();
