---
layout: post
title: Three Heuristics on Where LLM Agents Help and Where They Harm
tag: Data Science
---

Between the release of GPT-6 Astra with high performance on the ARC-AGI 3 benchmark, the apparent solving of the Navier-Stokes problem by an internal OpenAI model with subsequent plagiarism allegations, and various unintended hacks by agentic systems, it's been a big month in AI.

I (hopefully) have more writings forthcoming--probably on substack--covering some of these big-picture topics. But today I want to write up in brief my current heuristics for what kind of effects AI will have. By 'AI' here I specifically mean our current most sophisticated systems: LLMs with agentic harnesses which equip them with various 'skills' and tools.

I'm sure at least some of what follows will turn out to be wrong. The space is very fast moving, and it's hard to anticipate what will happen next. Time is the only way we'll find out.

**Heuristic 1: LLM agents are well-suited to problems bottlenecked by intellectual capacity with fast or automatic verification of solutions.**

We are in a strange place at the moment where LLMs are simultaneously capable of both solving very difficult problems and yet fail in surprising ways. I leave aside the question for now of whether this '[jagged intelligence](https://x.com/karpathy/status/1816531576228053133?lang=en)' is or isn't fundamental (though if you really want to know, I suspect it is), and instead note that LLMs are basically capable but unreliable.

This points towards particular kinds of problems in which they can be effective. [Code writing](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/) is one of them. It is skilled and often intellectually demanding work. That this is so is why so many of us enjoy it. The reason why this is however a good use case for LLM agents is that when I have a coding assistant generate a function for me, it's easy for me to check if it's done what I want (and if I set up unit tests, verification becomes automatic). Verification is easy and is distributed to the user.

However, the agents are harder to trust in full-scale software engineering. Writing a full codebase involves a lot more than 'correct'. It is much more open-ended. It involves ensuring code is human readable, modular in ways that make it easy to maintain, avoids software vulnerabilities, and so on. A lot of concerns that can be [difficult to easily articulate](https://en.wikipedia.org/wiki/Tacit_knowledge) go into it. And so using agents often seems to end up in the accumulation of lots of [tech debt](https://en.wikipedia.org/wiki/Technical_debt).

Note that 'creativity' is not the bottleneck here. Code writing for agents relies on a combination of the harness and on having been trained on countless pieces of code. LLMs are trained to sample from a distribution that reflects their training data, so their ability to produce novel outputs is combinatorial: they can combine their instructions, additional information from their harness, and solutions seen in their training data.

I suspect (though since this is not my domain of expertise, cannot know) their effectiveness at hacking comes from a similar place. As Andrew Ng [argues](https://info.deeplearning.ai/whos-responsible-for-irresponsible-ai-1), LLM agents can tirelessly try many tactics and have the patience to chain vulnerabilities together. They do not require novelty to do this: they only need a level of persistence and effort which humans are not capable of. They represent, essentially, a brute force solution to hard problems. And note hacking is also fast to verify: you're either in, or you're not.

I suppose 'intellectual capacity' should also include a notion of knowledge. LLMs make it very easy to access and combine different pieces of knowledge which already exist. However, we don't expect LLMs to have much effect on problems primarily bottlenecked by other constraints such as material resources, physical labour, etc. The latter intuitively feels like robotics would eventually have an effect, but that isn't the technology I'm concerned with here.

**Heuristic 2: LLM agents are detrimental to problems bottlenecked by verification capacity.**

Because LLMs are good at generating solutions, such as code, writing documents, and so on, they are appealing to human users. Writing documents or navigating requirements can be difficult or time-consuming. LLMs therefore make sense to these users: the output is probably 'good enough' in many settings, and the time savings are large.

However, there are many settings where this hasn't been the main bottleneck to problem solving. Consider scientific peer review, or sending letters to your MP. These settings are defined by scarce resource for verification, whether by human reviewers or in terms of an MP's time. AI has lowered the costs of submitting to these processes, without addressing the core bottleneck.

Some might argue that AI is a solution to this kind of effect. But there are some reasons to reject this thinking. First, it might only serve to encourage a kind of [AI arms race](https://www.programmablemutter.com/p/the-downside-of-robot-solutionism) between lowering submission costs and trying to process incoming data. Second, because they are unreliable, it isn't clear that LLM verification is really appropriate where quality of response is important. But, thirdly, in some cases this ignores important positive externalities from the process. This leads to the third heuristic.

**Heuristic 3: LLM agents are fundamentally inappropriate for problems partially or wholly motivated by positive externalities in the process of solving them rather than solely by solutions.**

One of the academic disciplines in which AI appears to excelling in producing new solutions is mathematics. I leave aside for this point the debate around the Navier-Stokes problem, or indeed on the question of how capable the LLM agents are. Instead, note that OpenAI has [claimed](https://openai.com/index/advisory-group-on-mathematics-and-ai/) that the same internal model which resolved the Navier-Stokes problem has also resolved more than 100 long-standing open problems in mathematics.

It seems likely, as Terrence Tao has put it, that AI is set to flatten the difficult of problems in mathematics. It's unsurprising that it's among the fields which see such an effect: it is a purely intellectual domain concerned with the behaviour of abstract objects. However, the discipline of mathematics has [many goals beyond solving problems](https://doi.org/10.48550/arXiv.2608.16753), including the development of new theories, understanding of the world, building and sustaining a community of mathematicians, and so on.

The process of finding solutions builds understanding and suggests other useful paths, all of which [is lost when solution-finding is automated](https://www.youtube.com/watch?v=svl_1upFpQo). So although LLM agents are helpful in the solving of problems, this leaves them [misaligned](https://mathandai.org/) with the broader goals of the mathematical community.

Mathematics is not the only discipline facing [fundamental philosophical questions](https://doi.org/10.48550/arXiv.2603.26524), however. The overwhelming of peer review is happening because for far too long researchers have been incentivised to produce papers at all cost. AI has [fundamentally broken](https://giorgio.gilest.ro/the-weimar-of-knowledge/) paper publication as a signal of quality. Researchers therefore face a problem in choosing what to read given so much volume. They will rely in the short term on heuristics such as reputation. But in the longer term, new signals of quality will need to be found.

Other processes are equally inappropriate for the use of AI, regardless of whether or not it is capable in these domains according to some measure. Political processes such as elections, parliamentary scrutiny, or negotiations between interest groups such as businesses and trade unions serve to legitimise outcomes for all sides and thus resolve conflicts peacefully. This is because they adjudicate between competing value systems and interests. Replacing any such process with AI would mean creating a new process which lacks the legitimacy and thus authority of such a process.

Across all of these cases, attempting to use AI to improve decision-making, even if in principle it could (and it is never clear to me in these cases that there can be a single standard for 'improved' decision making) neglects the reasons why these processes exist in the way they do.
