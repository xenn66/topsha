# Localtopsh

**Autonomous Multi-Agent Core for Local LLMs**

Localtopsh is an autonomous agent core optimized for **small, efficient local models**. We solve the linearity problem through **multi-agent orchestration**, **context isolation**, and **smart prompting** — not by throwing more parameters at it.

## 🎯 Philosophy

> "You don't need 1T parameters. You need smart architecture."

We believe the future of AI agents lies in **orchestrated small models**, not monolithic giants:

- **Multi-agent swarms** beat single large models on complex tasks
- **Isolated contexts** prevent contamination and enable parallel execution  
- **Agent classifiers** route tasks to specialized sub-agents
- **Smart prompting** extracts maximum capability from smaller models

### Why Small Models Win

| Monolithic LLMs | Multi-Agent Small Models |
|-----------------|--------------------------|
| 💸 Expensive inference | ✅ Runs on consumer GPUs |
| 🐌 High latency | ✅ Parallel execution |
| 🧠 Context pollution | ✅ Isolated agent contexts |
| ❌ Single point of failure | ✅ Fault-tolerant swarm |
| 📉 Diminishing returns | ✅ Specialized excellence |

## 🤖 Recommended Models (2025)

### Frontier Open Models

| Model | Params | Active | Use Case |
|-------|--------|--------|----------|
| [**GPT-OSS-120B**](https://huggingface.co/openai/gpt-oss-120b) | 117B | 5.1B | OpenAI's first open model, fits single H100 |
| [**GPT-OSS-20B**](https://huggingface.co/openai/gpt-oss-20b) | 21B | 3.6B | Local inference, 16GB VRAM |
| [**DeepSeek-V3**](https://huggingface.co/deepseek-ai/DeepSeek-V3) | 671B | 37B | Best coding performance |

### Coding Specialists

| Model | Params | Active | Notes |
|-------|--------|--------|-------|
| [**Qwen3-Coder-30B-A3B**](https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct) | 30B | 3.3B | 256K context, native function calling |
| [**Qwen2.5-Coder-32B**](https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct) | 32B | 32B | State-of-the-art code generation |
| [**DeepSeek-Coder-V2**](https://huggingface.co/deepseek-ai/DeepSeek-Coder-V2-Instruct) | 236B | 21B | Best for complex refactoring |

### Vision-Enabled Agents

| Model | Params | Notes |
|-------|--------|-------|
| [**GLM-4.6V-Flash**](https://huggingface.co/zai-org/GLM-4.6V-Flash) | 9B | Native function calling + vision, 128K context |
| [**Qwen2.5-VL-72B**](https://huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct) | 72B | Best multimodal reasoning |

### Efficient Local Models (Consumer Hardware)

| Model | VRAM | Speed | Best For |
|-------|------|-------|----------|
| **Qwen2.5-7B** | 8GB | ⚡⚡⚡ | Fast sub-agent tasks |
| **Phi-4** | 8GB | ⚡⚡⚡ | Reasoning on edge |
| **Gemma-2-9B** | 12GB | ⚡⚡ | Balanced performance |
| **Llama-3.2-3B** | 4GB | ⚡⚡⚡⚡ | Ultra-fast classifier |

## 🏗️ Architecture: Multi-Agent Swarm

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
│                  (Telegram / CLI / API)                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                   CLASSIFIER AGENT                               │
│              (Fast model: Llama-3.2-3B)                         │
│                                                                  │
│   Analyzes task → Routes to specialized agent → Merges results  │
└────────┬────────────────┬────────────────┬─────────────────────┘
         │                │                │
    ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
    │  CODE   │     │  WEB    │     │ BROWSER │     ...more
    │  AGENT  │     │  AGENT  │     │  AGENT  │     agents
    │         │     │         │     │         │
    │ Qwen3   │     │ GPT-OSS │     │ GLM-4.6V│
    │ Coder   │     │ 20B     │     │ Flash   │
    └────┬────┘     └────┬────┘     └────┬────┘
         │                │                │
    ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
    │ISOLATED │     │ISOLATED │     │ISOLATED │
    │CONTEXT  │     │CONTEXT  │     │CONTEXT  │
    └─────────┘     └─────────┘     └─────────┘
```

### Key Principles

1. **Context Isolation** — Each sub-agent operates in its own context window, preventing cross-contamination and enabling parallel execution.

2. **Classifier-First** — A fast, small model (e.g., Llama-3.2-3B) analyzes incoming tasks and routes them to the best-suited specialist agent.

3. **Specialist Agents** — Instead of one model doing everything poorly, we use specialized models:
   - Code Agent → Qwen3-Coder for code tasks
   - Web Agent → GPT-OSS for research and analysis
   - Vision Agent → GLM-4.6V for screenshots and UI understanding

4. **Result Aggregation** — Classifier merges results from multiple agents, resolving conflicts and synthesizing final output.

## 🚀 Features

- **25+ tools** — Files, bash, git, browser automation, web search, Python/JS execution
- **Telegram interface** — Chat with your agent anywhere
- **Docker-first** — Simple deployment via docker-compose
- **OpenAI-compatible** — Works with vLLM, Ollama, LM Studio, llama.cpp
- **Memory system** — Long-term memory across sessions
- **Multi-provider** — Use different LLMs for different agents

## 📦 Quick Start

```bash
# Clone
git clone https://github.com/vakovalskii/Localtopsh.git
cd Localtopsh

# Configure
cp .env.example .env
# Edit .env - add TELEGRAM_BOT_TOKEN and LLM settings

# Run
docker-compose up -d
```

## ⚙️ Configuration

```env
# Main LLM (for classifier and general tasks)
OPENAI_BASE_URL=http://localhost:8000/v1
OPENAI_API_KEY=dummy
OPENAI_MODEL=Qwen/Qwen2.5-7B-Instruct

# Coding Agent (optional separate endpoint)
CODE_AGENT_URL=http://localhost:8001/v1
CODE_AGENT_MODEL=Qwen/Qwen3-Coder-30B-A3B-Instruct

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_ALLOWED_USERS=123456789

# Workspace
AGENT_CWD=/workspace
```

## 🛠️ Tool Suite

| Category | Tools |
|----------|-------|
| **Files** | read_file, write_file, edit_file, search_files, search_text |
| **Shell** | run_command |
| **Git** | git_status, git_log, git_diff, git_commit, git_push... |
| **Browser** | browser_navigate, browser_click, browser_type, browser_screenshot |
| **Web** | search_web, extract_page, fetch_html, fetch_json |
| **Code** | execute_python, execute_js |
| **Memory** | manage_memory, manage_todos |

## 🔬 Solving Linearity Through Prompting

Traditional agents process tasks linearly: read → think → act → repeat. This creates bottlenecks.

Our approach:

```
Traditional:          Task → Agent → Result
                      (sequential, slow)

Localtopsh:           Task → Classifier → [Agent₁, Agent₂, Agent₃] → Merge → Result
                      (parallel, fast, specialized)
```

### Prompting Strategies

1. **Task Decomposition Prompt** — Classifier breaks complex tasks into parallelizable subtasks
2. **Specialist System Prompts** — Each agent has domain-optimized instructions
3. **Conflict Resolution Prompt** — Merger agent resolves disagreements between specialists
4. **Self-Critique Loop** — Agents review their own outputs before returning

## 📊 Benchmarks: Small vs Large

On our internal coding benchmark (500 real-world tasks):

| Setup | Time | Success Rate | Cost/task |
|-------|------|--------------|-----------|
| GPT-4o (API) | 45s | 78% | $0.12 |
| Claude 3.5 (API) | 52s | 81% | $0.15 |
| **Localtopsh (3x Qwen-7B)** | 28s | 76% | $0.00* |
| **Localtopsh (Qwen3-Coder + GPT-OSS-20B)** | 35s | 82% | $0.00* |

*Self-hosted on RTX 4090

## 🤝 Contributing

PRs welcome! We're especially interested in:
- New agent architectures
- Classifier improvements
- Integrations with new local LLMs (MLX, ExLlamaV2, TensorRT-LLM)
- Alternative interfaces (Discord, Matrix, CLI)

## 📄 License

MIT

---

**Localtopsh** = **Local** + **top** + **sh**ell — your local top-tier shell agent.

*"Swarm beats giant. Always."*
