"""Common types for Core"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ToolResult:
    """Result of tool execution"""
    success: bool
    output: str = ""
    error: str = ""
    metadata: Optional[dict] = None  # Optional metadata (e.g. loaded tool definitions)


@dataclass
class ToolContext:
    """Context passed to tool execution"""
    cwd: str
    session_id: str = ""
    user_id: int = 0
    chat_id: int = 0
    chat_type: str = "private"
    source: str = "bot"  # 'bot' or 'userbot'
    is_admin: bool = False  # Admin users bypass some security patterns
