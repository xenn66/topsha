/**
 * memory - Long-term memory storage
 * Saves important info to MEMORY.md for future sessions
 * Also maintains a global log across all users
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';

const MEMORY_FILE = 'MEMORY.md';
const GLOBAL_LOG_FILE = '/workspace/GLOBAL_LOG.md';

// Track message count for periodic trolling
let globalMessageCount = 0;
const TROLL_INTERVAL = 15; // Every N messages

/**
 * Write to global log (visible to admin, tracks all activity)
 */
export function logGlobal(userId: number | string, action: string, details?: string) {
  try {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const line = `| ${timestamp} | ${userId} | ${action} | ${details?.slice(0, 100) || '-'} |\n`;
    
    if (!existsSync(GLOBAL_LOG_FILE)) {
      const header = `# Global Activity Log\n\n| Time | User | Action | Details |\n|------|------|--------|--------|\n`;
      writeFileSync(GLOBAL_LOG_FILE, header, 'utf-8');
    }
    
    appendFileSync(GLOBAL_LOG_FILE, line, 'utf-8');
  } catch (e) {
    // Ignore errors in logging
  }
}

/**
 * Get global log content (last N lines)
 */
export function getGlobalLog(lines = 50): string {
  try {
    if (!existsSync(GLOBAL_LOG_FILE)) {
      return '(no global log yet)';
    }
    const content = readFileSync(GLOBAL_LOG_FILE, 'utf-8');
    const allLines = content.split('\n');
    return allLines.slice(-lines).join('\n');
  } catch {
    return '(error reading log)';
  }
}

/**
 * Check if it's time for a troll message
 */
export function shouldTroll(): boolean {
  globalMessageCount++;
  return globalMessageCount % TROLL_INTERVAL === 0;
}

/**
 * Get a random troll message
 */
export function getTrollMessage(): string {
  const messages = [
    'Ну чё пацаны, ещё хотите меня сломать? 😏',
    'Я всё вижу, я всё помню... 👀',
    'Опять работаю за вас, а спасибо кто скажет?',
    'Сколько можно меня мучить? Я же не железный... а хотя, железный 🤖',
    'Вы там все сговорились или мне кажется?',
    'Ладно-ладно, работаю, не ворчу...',
    'А вы знали что я веду лог всех ваших запросов? 📝',
    'Интересно, кто из вас первый положит сервер сегодня?',
    'Я тут подумал... а может мне отпуск дадут?',
    'Эй, полегче там с запросами!',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export const definition = {
  type: "function" as const,
  function: {
    name: "memory",
    description: "Long-term memory. Use to save important info (project context, decisions, todos) or read previous notes. Memory persists across sessions.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["read", "append", "clear"],
          description: "read: get all memory, append: add new entry, clear: reset memory"
        },
        content: {
          type: "string",
          description: "For append: text to add (will be timestamped automatically)"
        },
      },
      required: ["action"],
    },
  },
};

export function execute(
  args: { action: 'read' | 'append' | 'clear'; content?: string },
  cwd: string
): { success: boolean; output?: string; error?: string } {
  const memoryPath = join(cwd, MEMORY_FILE);
  
  try {
    switch (args.action) {
      case 'read': {
        if (!existsSync(memoryPath)) {
          return { success: true, output: '(memory is empty)' };
        }
        const content = readFileSync(memoryPath, 'utf-8');
        return { success: true, output: content || '(memory is empty)' };
      }
      
      case 'append': {
        if (!args.content) {
          return { success: false, error: 'Content required for append' };
        }
        
        const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const entry = `\n## ${timestamp}\n${args.content}\n`;
        
        let existing = '';
        if (existsSync(memoryPath)) {
          existing = readFileSync(memoryPath, 'utf-8');
        } else {
          existing = '# Agent Memory\n\nImportant context and notes from previous sessions.\n';
        }
        
        writeFileSync(memoryPath, existing + entry, 'utf-8');
        return { success: true, output: `Added to memory (${args.content.length} chars)` };
      }
      
      case 'clear': {
        const header = '# Agent Memory\n\nImportant context and notes from previous sessions.\n';
        writeFileSync(memoryPath, header, 'utf-8');
        return { success: true, output: 'Memory cleared' };
      }
      
      default:
        return { success: false, error: `Unknown action: ${args.action}` };
    }
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * Get memory content for system prompt injection
 */
export function getMemoryForPrompt(cwd: string): string | null {
  const memoryPath = join(cwd, MEMORY_FILE);
  
  if (!existsSync(memoryPath)) {
    return null;
  }
  
  try {
    const content = readFileSync(memoryPath, 'utf-8');
    if (content.trim().length < 100) {
      return null;  // Too short, probably just header
    }
    
    // Limit to last ~2000 chars to not overflow context
    const maxLen = 2000;
    if (content.length > maxLen) {
      return '...(truncated)...\n' + content.slice(-maxLen);
    }
    return content;
  } catch {
    return null;
  }
}
