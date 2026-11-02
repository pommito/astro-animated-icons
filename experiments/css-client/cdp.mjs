import assert from "node:assert/strict";

export async function connect() {
  const version = await (await fetch((process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:45385") + "/json/version")).json();
  const socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener("open", resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const task = pending.get(message.id);
    pending.delete(message.id);
    message.error ? task.reject(Error(JSON.stringify(message.error))) : task.resolve(message.result);
  });
  const call = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const key = ++id;
    pending.set(key, { resolve, reject });
    socket.send(JSON.stringify({ id: key, method, params, sessionId }));
  });
  const evaluate = async (session, expression) => {
    const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, timeout: 300000 }, session);
    assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  return { version, call, evaluate, close: () => socket.close() };
}
