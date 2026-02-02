# Localtopsh

**Autonomous AI Agent Core for Local LLMs**

Localtopsh — автономное агентное ядро, оптимизированное для работы с **локальными open-source моделями**. В отличие от решений, завязанных на облачные API, мы делаем ставку на self-hosted инференс.

## 🎯 Философия

Мы верим, что будущее AI-агентов за локальными моделями:

- **GPT-4 OSS 120B** — открытые модели уровня GPT-4
- **GLM-4 Flash** — быстрый инференс для real-time задач  
- **Qwen 2.5 72B/32B/7B** — отличный баланс качества и скорости
- **DeepSeek V3** — state-of-the-art для code generation
- **Llama 3.3 70B** — проверенная рабочая лошадка

### Почему локальные модели?

| Облачные API | Локальные модели |
|--------------|------------------|
| 💸 Pay-per-token | ✅ Фиксированная стоимость GPU |
| 🔒 Данные уходят наружу | ✅ Полная приватность |
| ⏱️ Rate limits | ✅ Без ограничений |
| 🌐 Зависимость от сети | ✅ Работает offline |
| ❌ Могут заблокировать | ✅ Полный контроль |

## 🚀 Возможности

- **25+ инструментов** — файлы, bash, git, браузер, веб-поиск, Python/JS execution
- **Telegram интерфейс** — общайся с агентом через бота
- **Docker-first** — простой деплой через docker-compose
- **OpenAI-compatible API** — работает с vLLM, Ollama, LM Studio, llama.cpp
- **Memory system** — долгосрочная память между сессиями
- **Multi-provider** — поддержка нескольких LLM провайдеров

## 📦 Быстрый старт

```bash
# Клонируем
git clone https://github.com/vakovalskii/Localtopsh.git
cd Localtopsh

# Настраиваем
cp .env.example .env
# Редактируем .env - добавляем TELEGRAM_BOT_TOKEN и настройки LLM

# Запускаем
docker-compose up -d
```

## ⚙️ Конфигурация

```env
# LLM Provider (vLLM, Ollama, LM Studio, etc.)
OPENAI_BASE_URL=http://localhost:8000/v1
OPENAI_API_KEY=dummy
OPENAI_MODEL=Qwen/Qwen2.5-7B-Instruct

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_ALLOWED_USERS=123456789  # Опционально: ограничить доступ

# Workspace для файловых операций
AGENT_CWD=/workspace
```

## 🔧 Рекомендуемые модели

### Для кодинга
- **DeepSeek Coder V2 236B** — лучший для сложных задач
- **Qwen2.5-Coder 32B** — оптимальный баланс
- **CodeLlama 70B** — классика

### Для general purpose
- **Qwen2.5 72B** — универсальный солдат
- **GLM-4 9B** — быстрый и умный
- **Llama 3.3 70B** — стабильный и проверенный

### Для слабого железа
- **Qwen2.5 7B** — работает даже на 8GB VRAM
- **Phi-3 Mini** — 3.8B параметров, удивительно умный
- **Gemma 2 9B** — компактный от Google

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────┐
│                   Telegram Bot                       │
│              (src/telegram/bot.ts)                   │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│                 Agent Core                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   Runner    │  │   Tools     │  │   Memory    │  │
│  │  (OpenAI)   │  │  Executor   │  │   System    │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘  │
│         │                │                           │
│  ┌──────▼────────────────▼──────┐                   │
│  │         Tool Suite           │                   │
│  │  bash, files, git, browser,  │                   │
│  │  web-search, python, js...   │                   │
│  └──────────────────────────────┘                   │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│              Local LLM Server                        │
│         (vLLM / Ollama / LM Studio)                 │
│                                                      │
│   ┌─────────────────────────────────────────────┐   │
│   │  Qwen2.5 │ DeepSeek │ Llama │ GLM │ Phi...  │   │
│   └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 🛠️ Инструменты агента

| Категория | Инструменты |
|-----------|-------------|
| **Файлы** | read_file, write_file, edit_file, search_files, search_text |
| **Bash** | run_command |
| **Git** | git_status, git_log, git_diff, git_commit, git_push... |
| **Браузер** | browser_navigate, browser_click, browser_type, browser_screenshot |
| **Веб** | search_web, extract_page, fetch_html, fetch_json |
| **Код** | execute_python, execute_js |
| **Память** | manage_memory, manage_todos |

## 📝 Использование как библиотеки

```typescript
import { ToolExecutor, getTools } from 'localtopsh';

const executor = new ToolExecutor('/workspace', settings);
const result = await executor.executeTool('run_command', { 
  command: 'ls -la' 
});
```

## 🤝 Contributing

PRs welcome! Особенно интересны:
- Интеграции с новыми LLM (MLX, ExLlamaV2, TensorRT-LLM)
- Новые инструменты
- Оптимизации для слабого железа
- Альтернативные интерфейсы (Discord, Matrix, CLI)

## 📄 License

MIT

---

**Localtopsh** = **Local** + **top** + **sh**ell — локальный топовый агент для твоего терминала.
