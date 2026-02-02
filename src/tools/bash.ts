/**
 * run_command - Execute shell commands
 * Pattern: Action (run) + Object (command)
 */

import { execSync } from 'child_process';

export const definition = {
  type: "function" as const,
  function: {
    name: "run_command",
    description: "Run a shell command. Use for: git, npm, build scripts, system operations.",
    parameters: {
      type: "object",
      properties: {
        command: { 
          type: "string", 
          description: "The shell command to execute" 
        },
      },
      required: ["command"],
    },
  },
};

export async function execute(
  args: { command: string },
  cwd: string
): Promise<{ success: boolean; output?: string; error?: string }> {
  try {
    const output = execSync(args.command, {
      cwd,
      encoding: 'utf-8',
      timeout: 120000,
      maxBuffer: 1024 * 1024 * 5,
    });
    return { success: true, output: output.slice(0, 50000) || "(empty output)" };
  } catch (e: any) {
    const stderr = e.stderr?.toString() || '';
    const stdout = e.stdout?.toString() || '';
    return { 
      success: false, 
      error: `Exit ${e.status || 1}: ${stderr || stdout || e.message}`.slice(0, 5000)
    };
  }
}
