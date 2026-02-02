/**
 * schedule_task - Schedule delayed messages or commands
 * Simple in-memory scheduler for reminders and delayed execution
 */

interface ScheduledTask {
  id: string;
  userId: number;
  chatId: number;
  type: 'message' | 'command';
  content: string;
  executeAt: number;
  createdAt: number;
}

// In-memory task storage
const scheduledTasks = new Map<string, ScheduledTask>();
const userTasks = new Map<number, Set<string>>(); // userId -> taskIds

// Callbacks (set from bot)
let sendMessageCallback: ((chatId: number, text: string) => Promise<void>) | null = null;
let executeCommandCallback: ((userId: number, command: string) => Promise<string>) | null = null;

export function setSendMessageCallback(cb: (chatId: number, text: string) => Promise<void>) {
  sendMessageCallback = cb;
}

export function setExecuteCommandCallback(cb: (userId: number, command: string) => Promise<string>) {
  executeCommandCallback = cb;
}

// Start the scheduler loop
let schedulerRunning = false;
export function startScheduler() {
  if (schedulerRunning) return;
  schedulerRunning = true;
  
  setInterval(async () => {
    const now = Date.now();
    
    for (const [id, task] of scheduledTasks.entries()) {
      if (task.executeAt <= now) {
        // Remove task first
        scheduledTasks.delete(id);
        const userTaskSet = userTasks.get(task.userId);
        if (userTaskSet) userTaskSet.delete(id);
        
        // Execute task
        try {
          if (task.type === 'message' && sendMessageCallback) {
            await sendMessageCallback(task.chatId, `⏰ Напоминание: ${task.content}`);
            console.log(`[scheduler] Sent reminder to ${task.userId}: ${task.content.slice(0, 30)}`);
          } else if (task.type === 'command' && executeCommandCallback) {
            const result = await executeCommandCallback(task.userId, task.content);
            await sendMessageCallback?.(task.chatId, `⏰ Запланированная команда:\n\`${task.content}\`\n\nРезультат:\n${result.slice(0, 500)}`);
            console.log(`[scheduler] Executed command for ${task.userId}: ${task.content.slice(0, 30)}`);
          }
        } catch (e: any) {
          console.log(`[scheduler] Task ${id} failed: ${e.message}`);
        }
      }
    }
  }, 5000); // Check every 5 seconds
  
  console.log('[scheduler] Started');
}

export const definition = {
  type: "function" as const,
  function: {
    name: "schedule_task",
    description: "Schedule a reminder or delayed command. Use for: 'remind me in 5 min', 'run this script in 1 hour'. Max delay: 24 hours. Max 5 tasks per user.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["add", "list", "cancel"],
          description: "add = create new task, list = show user's tasks, cancel = cancel task by id"
        },
        type: {
          type: "string",
          enum: ["message", "command"],
          description: "message = send reminder text, command = execute shell command"
        },
        content: {
          type: "string",
          description: "For message: the reminder text. For command: the shell command to run."
        },
        delay_minutes: {
          type: "number",
          description: "Delay in minutes before execution (1-1440, i.e. max 24h)"
        },
        task_id: {
          type: "string",
          description: "Task ID (for cancel action)"
        },
      },
      required: ["action"],
    },
  },
};

export async function execute(
  args: { action: string; type?: string; content?: string; delay_minutes?: number; task_id?: string },
  userId: number,
  chatId: number
): Promise<{ success: boolean; output?: string; error?: string }> {
  
  switch (args.action) {
    case 'add': {
      if (!args.type || !args.content || !args.delay_minutes) {
        return { success: false, error: 'Need type, content, and delay_minutes' };
      }
      
      // Validate delay (1 min to 24 hours)
      const delay = Math.min(Math.max(args.delay_minutes, 1), 1440);
      
      // Check user task limit
      const userTaskSet = userTasks.get(userId) || new Set();
      if (userTaskSet.size >= 5) {
        return { success: false, error: 'Max 5 scheduled tasks per user. Cancel some first.' };
      }
      
      // Create task
      const id = `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const task: ScheduledTask = {
        id,
        userId,
        chatId,
        type: args.type as 'message' | 'command',
        content: args.content,
        executeAt: Date.now() + delay * 60 * 1000,
        createdAt: Date.now(),
      };
      
      scheduledTasks.set(id, task);
      userTaskSet.add(id);
      userTasks.set(userId, userTaskSet);
      
      const executeTime = new Date(task.executeAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      return {
        success: true,
        output: `✅ Запланировано на ${executeTime} (через ${delay} мин)\nID: ${id}\nТип: ${args.type}\nСодержимое: ${args.content.slice(0, 50)}`,
      };
    }
    
    case 'list': {
      const userTaskSet = userTasks.get(userId);
      if (!userTaskSet || userTaskSet.size === 0) {
        return { success: true, output: 'Нет запланированных задач' };
      }
      
      const tasks: string[] = [];
      for (const id of userTaskSet) {
        const task = scheduledTasks.get(id);
        if (task) {
          const timeLeft = Math.round((task.executeAt - Date.now()) / 60000);
          tasks.push(`• ${task.id}: ${task.type} через ${timeLeft} мин - "${task.content.slice(0, 30)}"`);
        }
      }
      
      return {
        success: true,
        output: `Запланированные задачи (${tasks.length}):\n${tasks.join('\n')}`,
      };
    }
    
    case 'cancel': {
      if (!args.task_id) {
        return { success: false, error: 'Need task_id to cancel' };
      }
      
      const task = scheduledTasks.get(args.task_id);
      if (!task) {
        return { success: false, error: 'Task not found' };
      }
      
      if (task.userId !== userId) {
        return { success: false, error: 'Cannot cancel other user\'s task' };
      }
      
      scheduledTasks.delete(args.task_id);
      const userTaskSet = userTasks.get(userId);
      if (userTaskSet) userTaskSet.delete(args.task_id);
      
      return { success: true, output: `Задача ${args.task_id} отменена` };
    }
    
    default:
      return { success: false, error: `Unknown action: ${args.action}` };
  }
}
