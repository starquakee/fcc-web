---
title: "Diversity as Compute: From iStratDE to AlphaEvolve"
excerpt: "A research note on individual-level strategy diversity, Quality Diversity, AlphaEvolve, and possible LLM agent systems."
collection: memory
---

### A clearer intuition

The more I look at AlphaEvolve and iStratDE together, the more they feel connected by a deeper search philosophy. On the surface they operate at very different levels. AlphaEvolve is a system for algorithm discovery: an LLM proposes code edits, evaluators score the resulting programs, and a program database keeps useful candidates alive. iStratDE is a Differential Evolution variant: each individual receives fixed mutation, crossover, and parameter choices, then the whole population searches in parallel.

But if we remove the concrete objects for a moment, both systems make a similar bet. Good search should not commit too early to one direction. It should preserve many different behaviors, let them compete under real evaluation signals, and keep the useful ones available for future search.

AlphaEvolve keeps diversity in its program database. Different programs, edits, scores, and design ideas can later be sampled as parents or inspirations. iStratDE keeps diversity inside the population. Each individual carries a stable search style from the beginning and keeps using it. One is archive-level diversity; the other is individual/operator-level diversity.

Both systems also avoid asking a single global controller to fully decide when to explore and when to exploit. AlphaEvolve does not only hill-climb from the current best program. iStratDE does not rely on a centralized adaptation module to decide which DE strategy is currently successful. They let many behaviors coexist, then let selection and evaluation do the filtering.

### MAP-Elites is more than a citation

This is why the MAP-Elites connection matters. The spirit of MAP-Elites is not only to find one optimum. It divides a behavior space into niches and keeps high-performing elites across those niches. The goal is a map of quality and diversity, not a single champion.

AlphaEvolve explicitly follows this line through its evolutionary database, which is inspired by MAP-Elites and island models. It preserves a population of program ideas instead of compressing everything into one winner. Different programs may be strong under different metrics, structures, or regions of a problem, and that difference becomes useful context for future generation.

iStratDE also belongs near the Quality Diversity family in spirit. It does not maintain an explicit MAP-Elites grid, but it changes what a population means. The individuals are not just different points in a continuous space. They are different search behaviors moving through the space.

The research opportunity is to lift iStratDE from a DE variant into a more general design principle: when centralized learning, global bookkeeping, and dynamic adaptation become expensive or brittle, inject structural diversity at the individual level and let many heterogeneous workers search at once.

### The unused room inside iStratDE

The easiest contribution to see in iStratDE is its simplicity. Strategies are assigned once, there is no adaptation, no archive, and no complicated feedback mechanism. That simplicity is not a weakness. It makes GPU parallelism natural and keeps the algorithm clean.

But the deeper move is that strategy becomes an attribute of the individual. In many DE variants, individuals are candidate solutions and strategies live outside them as global algorithm settings. In iStratDE, a population becomes a set of solution vectors paired with stable search styles.

One direction is to build behavioral descriptors for strategies. The current results show that reducing the strategy pool hurts performance, but there is another question: what behaviors do these strategies create? Some may be more exploratory, some more exploitative. Some may create aggressive step-size distributions, others smoother convergence. If these behaviors can be measured, the random strategy pool can become a behavior map.

A second direction is lightweight strategy inheritance. iStratDE avoids adaptation on purpose, but that does not mean strategies can never evolve. A decentralized variant could let strategies be inherited, mutated, or recombined with individuals. Strong individuals would transmit not only coordinates but also search styles, while the system avoids centralized success-history bookkeeping.

A third direction is connecting iStratDE with an archive. iStratDE keeps diversity in the current population; AlphaEvolve stores diversity in history. Combining them suggests a structure where the live population provides high-throughput heterogeneous search, while an archive preserves elites across regions, styles, and phases.

### Why this fits LLM agents

LLM agent systems resemble high-dimensional black-box optimization, except noisier, more expensive, and harder to evaluate. What matters is not only the base model. It is also the prompt, tool policy, context selection, reflection style, decoding parameters, memory behavior, editing habits, and verification order.

Today these choices are often packed into one large system prompt. We try to build a general agent that knows when to be conservative, when to explore, when to retrieve, when to edit, and when to ask for help. That can work, but it resembles asking one global strategy to handle every search state.

iStratDE suggests a different approach: do not force one agent to contain all strategies. Initialize many agents with different stable styles. One agent is test-first. One is prototype-first. One behaves like a reviewer. One prefers minimal edits. One explores larger refactors. One focuses on retrieval. One focuses on performance. They face the same task and produce candidates in parallel, then evaluators choose what survives.

The important part is individual-level strategy diversity. The differences between agents should be stable enough to observe, reuse, and diagnose. Over time, the system can learn which styles work for which task families, and it can store high-quality traces as future inspiration.

### A possible iStratAgent

I would call the first version iStratAgent. It does not need to be complicated.

First, define a strategy pool. In this setting, a strategy is not a DE mutation or crossover rule. It is a bundle of agent behaviors: prompt style, tool cadence, context selection, temperature, verification preference, planning habit, edit size, counterexample generation, and objective priority.

Then initialize a batch of agents. Each agent receives one fixed strategy bundle and keeps it for a task window. The agents can solve the same task in parallel or attack different subproblems. Every candidate is scored by evaluators: tests, benchmarks, static checks, citation verification, human preference, or a combination of metrics.

Finally, maintain an archive. The archive should not save only the best answer. It should save high-quality answers under different strategy styles. In LLM systems, the valuable artifact is often not only the final output but also the route that produced it: a prompt template, a diagnostic trace, a test construction, an edit sequence, or a recovery pattern after failure.

This combines the flavor of iStratDE and AlphaEvolve. At the bottom, many fixed heterogeneous agents explore in parallel. At the top, a MAP-Elites-like archive preserves elites across styles and problem regions.

### Where to test it first

This idea should be tested first on tasks with reliable automatic evaluation. Open-ended writing would be tempting, but weak evaluators can make the system optimize the wrong thing.

Code repair is a natural starting point. Given failing tests, different strategy agents produce patches, and the evaluator checks correctness and diff quality. Algorithm discovery is another good setting: provide a skeleton and benchmark, let agents edit an evolve block, then score the result. RAG can work too, but the dataset should have verifiable answers and citations.

The comparison should be simple: one agent, homogeneous multi-agent, random multi-agent, iStratAgent, and iStratAgent with archive. Measure success rate, wall-clock time, token cost, candidate diversity, recovery after failure, and transfer to new tasks. The point is not one beautiful answer. The point is whether a system can find verifiable good solutions more reliably under a fixed budget.

If this works, the next research question is the strategy pool itself. Which strategies are complementary? Which strategies only add noise? Can task families map to useful strategy distributions? Do archived traces help new tasks cold-start faster? These questions feel more durable than writing one more universal prompt.

### The bet

My current bet is that iStratDE is not only a faster and simpler DE variant. It is a hint about how to organize intelligent systems. In sufficiently parallel settings with reliable evaluation, structural diversity can replace part of the complexity of centralized adaptation. Intelligence does not always need to come from a smarter controller. Some of it can come from many stable, different workers plus a system that remembers and reuses what worked.

AlphaEvolve demonstrates the same idea from the other side. It uses LLMs to generate candidates, evaluators to ground them, and a database to preserve diverse high-scoring programs. It is not just prompt engineering. It is a harness that organizes generation, evaluation, memory, and evolution.

So I would place both systems under one bigger question: how do we turn diversity into compute? iStratDE offers individual-level strategy diversity. AlphaEvolve offers archive-level program diversity. Future LLM agent systems may need both: many differently styled agents exploring in parallel, and a high-quality archive that remembers which styles, traces, and structures actually worked.

Diversity is not automatically useful. It needs structure, evaluation, and memory. Once those are present, diversity stops being noise and becomes a search resource.
