async function run() {
  const url = 'https://ai-agent-v01.onrender.com/chat?message=hello';
  console.log(`Testing POST ${url}`);
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'accept': 'application/json' } });
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Body: ${text.substring(0, 200)}\n`);
  } catch (e) {}

  const url2 = 'https://ai-agent-v01.onrender.com/chat';
  console.log(`Testing POST ${url2} with form data`);
  try {
    const fd = new URLSearchParams();
    fd.append('message', 'hello');
    const res2 = await fetch(url2, { method: 'POST', body: fd });
    console.log(`Status: ${res2.status}`);
    const text2 = await res2.text();
    console.log(`Body: ${text2.substring(0, 200)}\n`);
  } catch(e) {}
}
run();
