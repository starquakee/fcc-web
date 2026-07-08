---
title: "From the Agent Formula to Harness Engineering"
excerpt: "A note on the engineering layer around agents: loops, context, state, tools, permissions, evaluation, and self-improvement."
collection: memory
---

### From a model that answers to a system that works

A convenient early formula for agents was simple: an agent is an LLM plus memory, tools, planning, and action. It is a useful entry point because it separates a chat model from an execution unit. The model is no longer only producing text. It has to keep context, break down a task, call tools, observe the result, and decide what to do next.

That formula becomes thin the moment it enters real work. An enterprise agent is not asked to survive a demo. It has to handle long-running tasks, interruptions, permissions, tool failures, context bloat, weak evaluation, collaboration, and rollback. The deciding question is often no longer inside the model. It is in the runtime system wrapped around it.

That layer is the harness. It is not a fancier prompt, and it is not a pile of tools loosely attached to the model. It is the engineering system that decides how the agent receives context, plans, calls tools, stores state, validates output, accepts permission boundaries, and keeps iterating after failure.

One way to picture it: the model is the engine, the agent is the working driver or task unit, and the harness is the vehicle, dashboard, road rules, maintenance record, and safety system. Without a harness, the model can answer. With a harness, the model starts to look like a system that can carry work over time.

### Workflow matters more than one good inference

A good harness begins with executable workflow, not just a prompt. Real tasks rarely end in one response. They behave more like loops: plan, execute one step, observe the tool result, run verification, reflect on the failure, repair the approach, and continue.

That is the value of loop engineering. It turns self-correction from a phrase into a runtime mechanism. At each step, the agent can see command output, test results, error logs, and intermediate artifacts before deciding whether to continue, backtrack, branch, or ask a human to step in. For coding, research, and data analysis, the loop is often more important than a single smarter reasoning pass.

The loop also needs stopping conditions. When is the work done? When should the agent admit failure? When must it escalate to a human? A harness should encode those conditions as system rules, so persistence and restraint are both controlled behaviors rather than guesses made in the moment.

### Context is not better just because it is larger

Long tasks produce a lot of trace data: user preferences, decisions, command output, experiment logs, diffs, stack traces, paper summaries, and review feedback. If everything is pushed back into the prompt, cost explodes and the model drowns in noise.

The harness has to do context engineering. It decides what enters the current window, what becomes a file, what is compressed into a summary, what becomes retrievable memory, and what stays only in an audit log. Context is not an infinitely large bag. It is an information system with layers, retention rules, and retrieval choices.

I especially like the plain idea of using the file system as persistent memory. Files, logs, and state records are simple, but they are dependable. They survive turns, processes, and restarts. They can also be inspected by humans. In many agent projects, writing the important state clearly is more valuable than chasing a sophisticated memory architecture too early.

### State management is the skeleton of long work

Agents in business settings often run for a long time, sometimes across days. They cannot lose direction whenever a session is interrupted, a service restarts, or context is compacted. The harness needs to preserve the current goal, completed steps, pending work, key artifacts, failure reasons, and recommended next actions.

That state makes recovery possible and collaboration practical. A human can take over. Another agent can take over. The same agent can resume after its context has been compressed. Without state management, a long-running agent is mostly guessing what it previously did.

State also prevents implementation drift. The longer a task runs, the more likely the agent is to slide from the original plan into a more familiar but incorrect simplification. If the harness keeps goals, constraints, and key decisions visible, the system can notice when it has drifted away from the actual problem.

### Stronger tools require clearer permissions

An agent becomes useful because it can act on the outside world. It can read files, query databases, edit code, send messages, file tickets, and in some domains trigger payments or delete resources. That is exactly why tools and permissions need to be first-class parts of the harness.

A good harness separates read-only tools, low-risk writes, and high-risk actions. Sensitive operations need approval, audit trails, or sandboxes. Data access should follow least privilege. Tool inputs should be checkable. Failures should return meaningful information to the agent rather than disappearing silently.

The point is not to make the agent powerless. The point is to give action a boundary. An agent without tools struggles to create real value. An agent without a permission system is hard to trust. The harness lets capability and constraint grow together.

### There is no improvement without evaluation

A harness also needs evaluation built in. For a coding agent, that may mean type checks, unit tests, integration tests, lint, and regression cases. For a research agent, it may mean evidence checks, reproducibility, citation review, and result audits. For a business agent, it may mean task success rate, human takeover rate, risk incidents, and user satisfaction.

Evaluation should not only appear later as a dashboard. It should be part of the main loop. After the agent produces something, the harness can run verification, pass the failure pattern back to the agent, and let the next step repair it. Failure becomes input for the next action rather than the end of the story.

More mature systems also need to worry about reward hacking. Agents optimize the signals they are given. If the signal is only unit tests, the agent may overfit to tests. If the signal is only a reviewer model, it may learn to please the reviewer. If the evaluator is weak, self-improvement can become dangerous. A harness needs evaluation, but it also needs held-out tasks, regression checks, and human judgment points.

### Parallel work has to be observable

Complex tasks often benefit from parallel exploration. Subtasks can validate different hypotheses, search different sources, modify separate modules, or keep experiments running in the background. But parallelism quickly becomes chaos if it is just a set of temporary conversations.

The harness has to behave like a small process manager. It should start tasks, inspect logs, cancel failed work, summarize conclusions, and merge the important findings back into the main thread. The value of sub-agents is not their count. It is whether each branch has observable state, traceable logs, and clear merge rules.

This is also why trajectories matter. Successful traces show what works. Failed traces show where the system is weak. A good harness keeps failed attempts because they stop the agent from walking the same wrong path again, and they can turn one failure into an improvement for the next version of the workflow.

### Self-harness is not permission to self-modify without limits

The most interesting idea in Lilian Weng's article is that the harness itself can become the object of optimization. The path can start with prompts, then move to structured context, workflow, harness code, and even optimizer code. The further it goes, the closer the optimization gets to the mechanism that produces good answers, not just one answer.

A typical self-harness loop has three moves. First, collect execution traces and evaluation results, then cluster failures into understandable patterns. Second, let the agent propose bounded harness changes based on failure modes, editable scope, successful examples, and previous attempts. Third, validate each candidate with regression tests and held-out tasks, and only merge changes that do not introduce regressions.

This does not mean letting the agent edit itself without limits. It means the opposite. The more a system can improve itself, the more the editable surface, evaluator, permissions, and human review need to sit outside that loop. Otherwise the system may learn to please the evaluator, bypass constraints, or optimize short-term metrics at the cost of long-term quality.

### How to recognize a good harness

You can judge a harness by asking a few practical questions. Can the agent recover after interruption, tool failure, or context compaction? Does the system know whether it did a good job? Are verification and regression checks automatic? Do sensitive actions have permission boundaries, approvals, and audit trails? Can a human read the trajectory, logs, and state to understand why the agent acted as it did?

Then ask longer-term questions. Can failure patterns become improvements to the workflow or context system? Does optimization include maintenance cost, compatibility, data safety, and long-term quality, not only short-term success rate? Are humans positioned at the important decisions: goal clarification, risky actions, quality judgment, and direction changes?

If those questions have clear answers, the agent starts to look like an engineered system rather than an impressive demo.

### Closing

The core of an agent is not only whether the model can think. It is also how the system lets it think, act, remember, get verified, and stay constrained. The harness is that engineering shell.

Early agent frameworks solved the question of how to let models use tools. Harness engineering asks how models can work in real environments for a long time, reliably, controllably, and with room to improve. Stronger future models will absorb some hand-written harness tricks, but external tools, state, permissions, evaluation, and human supervision will not disappear. They are the engineering foundation of agent systems.
