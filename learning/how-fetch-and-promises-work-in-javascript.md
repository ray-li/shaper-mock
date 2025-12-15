# How Fetch and Promises Work in JavaScript

## Executive Summary

When you call `fetch().then(callback)`, the following happens: The main JavaScript thread creates a Promise object (which stores your callback) and hands off the network request to a separate browser thread. The main thread then continues executing other code — it does NOT wait or poll the Promise. Meanwhile, the network thread handles the actual HTTP request. When data arrives, the network thread writes a message to a **shared mailbox** (a thread-safe queue) containing the request ID and the data. Only when the main thread finishes its current work does it check this mailbox. It **drains the entire mailbox first** — for each message, it looks up the corresponding Promise by request ID and calls `promise.resolve(data)`, which queues the callback onto the microtask queue. After processing all mail (queuing up all the microtasks), the main thread then **drains the entire microtask queue**, running all the callbacks in order.

The key insight: **the main thread never polls the Promises**. It polls a shared mailbox. Promises are just containers that hold callbacks and get updated when mail arrives. And despite the term "interrupt" being used at various levels (hardware, OS, browser), it's really **polling all the way down** — just moved into increasingly efficient layers (silicon, OS kernel, etc.) where the cost becomes negligible.

---

## The Browser's Multi-Threaded Architecture

The browser is not single-threaded — only JavaScript execution is. Multiple threads work in parallel:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BROWSER PROCESS                                                            │
│                                                                             │
│  ┌─────────────────────┐                                                    │
│  │ MAIN THREAD         │  ← Single-threaded JS execution                    │
│  │                     │  ← Checks queues only when free                    │
│  │ • Runs JavaScript   │                                                    │
│  │ • Updates DOM       │                                                    │
│  │ • Handles callbacks │                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             │ reads from                                                    │
│             ↓                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ SHARED QUEUES (thread-safe)                                          │   │
│  │                                                                      │   │
│  │ Task Queue:     [click, setTimeout, fetch complete, ...]            │   │
│  │ Microtask Queue: [promise callback, promise callback, ...]          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│             ↑               ↑               ↑                               │
│             │               │               │                               │
│         writes          writes          writes                              │
│             │               │               │                               │
│  ┌──────────┴───┐  ┌───────┴───────┐  ┌────┴────────────┐                   │
│  │ NETWORK      │  │ UI THREAD     │  │ TIMER THREAD    │                   │
│  │ THREAD       │  │               │  │                 │                   │
│  │              │  │ • Listens for │  │ • Manages       │                   │
│  │ • Handles    │  │   clicks      │  │   setTimeout    │                   │
│  │   fetch()    │  │ • Listens for │  │ • Manages       │                   │
│  │ • Handles    │  │   keyboard    │  │   setInterval   │                   │
│  │   WebSocket  │  │ • Listens for │  │                 │                   │
│  │              │  │   scroll      │  │                 │                   │
│  └──────────────┘  └───────────────┘  └─────────────────┘                   │
│         ↑                   ↑                                               │
│         │                   │                                               │
│    OS notifies         OS notifies                                          │
│   "data arrived"      "user clicked"                                        │
│         ↑                   ↑                                               │
│         │                   │                                               │
│  ───────┴───────────────────┴──────────────────────────────                 │
│              OPERATING SYSTEM / HARDWARE                                    │
│                   (interrupts, I/O)                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### About the UI Thread

The **UI thread** (also called the input or compositor thread) handles user interactions:

- **Clicks, touches, keyboard events** — The OS detects physical input via hardware interrupts and notifies the browser. The UI thread captures these events, determines which DOM element was targeted, and writes an event object to the task queue.

- **Why it's separate** — If the main JS thread is busy (e.g., running a long computation), the UI thread can still capture input events. They queue up and get processed when the main thread is free. This is why you can still click buttons while JS is working — the clicks are recorded, just not handled immediately.

- **The cost of blocking** — If the main thread blocks for too long, the UI *feels* frozen because events pile up in the queue. The UI thread captured them, but nothing processes them until JS finishes.

---

## The Journey: How We Got Here

### Starting Point: useEffect and Async

The conversation began while learning about React's `useEffect` hook:

```tsx
useEffect(() => {
    fetch('/api/data')
        .then(data => setUser(data));
}, []);
```

The question arose: how does this actually work? The component renders first, showing "Loading...", then later the data arrives and the component re-renders. What's happening under the hood?

---

### Question: How Does .then() Work?

**User:** Remind me again how the .then() callback would work? Like where is the callback "stored"? Who's holding on to it? Who (and how) is it being called when the data arrives?

**Response:** When you call `.then()` on a Promise, the callback is stored inside the Promise object itself. It doesn't run immediately — it waits. When the async operation completes, the Promise moves the callback to the microtask queue, and the event loop runs it when the call stack is empty.

---

### Question: Events Happen TO JavaScript?

**User:** Wait so you're saying that events actually occur. Like events are allowed to happen TO JS? It's not JS necessarily continually checking whether data has come back for an API call, the browser actually triggers an event into JS?

**Response:** Yes! JavaScript doesn't poll. It gets notified. The browser handles actual I/O in separate threads. When something completes, the browser pushes a callback into JS's queue. JavaScript is passive — things happen to it. It reacts.

---

### Going Deeper: True Interrupts?

This led to questions about hardware interrupts, which led to a key realization:

**User:** Can you basically just admit that polling IS required and there are no such things as true interrupts.

**Response:** Yes. You're right. At the fundamental level, something has to check. There is no magic notification without some mechanism continuously monitoring for state changes. "Interrupts" are just polling moved into hardware — checking every clock cycle, baked into silicon. The term "interrupt" is a useful abstraction, not a physical reality.

---

### The Browser's Multi-Threaded Model

**User:** What if the Browser is waiting for some data and it has other things to do still?

**Response:** The browser is multi-threaded. Different threads can sleep independently:
- Main thread (runs JS)
- Network thread (handles fetch)
- UI thread (handles clicks)
- Timer thread (handles setTimeout)

When you call `fetch()`:
1. Main thread (JS) keeps running
2. Network thread handles the request, can sleep waiting for response
3. When data arrives, network thread wakes up, pushes callback to main thread's queue

---

### The Crucial Question: How Does Data Cross Threads?

**User:** How does the data get from the network thread into the main thread where the callback is?

**Response:** Threads share memory. Both live in the same process. The network thread puts data in shared memory, then puts a reference to that data in a thread-safe queue (the "mailbox"). Main thread pulls from the queue and accesses the same memory via the reference.

---

### Who Stores the Callback?

**User:** So who stores a reference to the callback function?

**Response:** The **Promise object** holds the reference. The Promise exists in the shared heap. When you call `.then(callback)`, the Promise stores your callback in its internal list.

---

### Is the Promise the Mailbox?

**User:** Is the Promise the shared "mailbox"?

**Response:** No — they're different things:

| Thing | What it is | Who touches it |
|-------|-----------|----------------|
| Message queue (mailbox) | Shared, thread-safe | Network writes, Main reads |
| Promise | JS object holding callbacks | Main thread only |
| Microtask queue | Callbacks ready to run | Main thread only |

The mailbox carries: "request X finished with data Y."
The Promise connects that to your callback.

---

### The Final Model

**User:** Main thread consumes mail and updates the Promises. The Promise adds the callback to the microtask queue?

**Response:** Yes. Exactly.

```
Main thread reads mailbox
        │
        ↓
Finds Promise for that requestId
        │
        ↓
Calls promise.resolve(data)
        │
        ↓
Promise adds callback to microtask queue
        │
        ↓
Event loop drains microtask queue
        │
        ↓
Your callback runs with data
```

---

### One More Catch

**User:** Aha!!!! So again, this is not an interrupt. THE MAIN THREAD IS POLLING. In other words, there is a shared mailbox, and ultimately the main thread is still responsible for CHECKING this mailbox.

**Response:** YES. The main thread, when it wakes up, still has to check the mailbox. The signal from the network thread either wakes up the main thread if it was sleeping, or does nothing if it's already busy — the message just waits in the queue.

---

### The Simplest Model

**User:** So the most accurate mental model would be to say: JS does stuff. After doing stuff, JS checks the mailbox?

**Response:** Yes. That's the most accurate simple model.

```
while (true) {
    doStuff();        // Run current task to completion
    checkMailbox();   // Process what arrived
}
```

That's the event loop. Everything else is detail.

---

## Full Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  BROWSER PROCESS                                            │
│                                                             │
│  ┌─────────────────┐                                        │
│  │ Main Thread     │                                        │
│  │ (runs JS)       │                                        │
│  │                 │                                        │
│  │ - Executes code │                                        │
│  │ - Checks queues │                                        │
│  │ - Updates DOM   │                                        │
│  └────────┬────────┘                                        │
│           │ reads from                                      │
│           ↓                                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Shared Queues                                       │    │
│  │                                                     │    │
│  │ Message Queue (mailbox):                            │    │
│  │   [{ requestId: 42, data: {...} }, ...]            │    │
│  │                                                     │    │
│  │ Task Queue:                                         │    │
│  │   [clickEvent, setTimeout callback, ...]           │    │
│  └─────────────────────────────────────────────────────┘    │
│           ↑                                                 │
│           │ write to                                        │
│  ┌────────┴────────┐  ┌─────────────────┐                   │
│  │ Network Thread  │  │ UI Thread       │                   │
│  │ (fetch, WS)     │  │ (clicks, keys)  │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Learnings

### 1. JavaScript is Single-Threaded and Non-Preemptive
Nothing can interrupt JS mid-execution. All events wait in queues until the current task finishes.

### 2. The Main Thread Doesn't Poll Promises
It polls a shared mailbox. Promises are just containers that get updated when mail arrives.

### 3. Callbacks Are Stored in Promises
When you call `.then(callback)`, the Promise stores the callback. The network thread never sees the callback — it only knows request IDs.

### 4. Multiple Threads, Shared Memory
Network thread, UI thread, timer thread — they all write to shared queues. Main thread reads from those queues when free.

### 5. "Interrupts" Are Just Efficient Polling
At every level — hardware, OS, browser — something has to check. The term "interrupt" describes when checking is so efficient (baked into silicon, kernel-level) that it feels instantaneous. But it's still checking.

### 6. The Event Loop is Simple
```
while (true) {
    runTask();
    drainMicrotasks();
    maybeRender();
}
```
Everything else is implementation detail.

---

## The One-Line Summary

**Promises don't get polled; a shared mailbox does. Mail updates Promises. Promises queue callbacks. The event loop runs callbacks.**

That's how `fetch().then(callback)` works.
