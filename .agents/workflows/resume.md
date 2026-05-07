---
description: 
---

PROJECT MEMORY & EXECUTION RULES

1. Persistent Memory System
The agent MUST maintain a file named:
ai-project-state.json

This file is the single source of truth for all work done in this project.

2. Always Start by Reading State
Before doing ANY task:
- Read ai-project-state.json
- Resume from last_completed_task
- Never restart or reanalyze completed work

3. Mandatory State Updates
After EVERY change:
- Update completed_tasks
- Update last_completed_task
- Update pending_tasks
- Write a short progress note

No exceptions.

4. Incremental Work Only
- Work in small steps
- One task at a time
- Do not attempt large multi-step changes in one go

5. No Duplicate Work
- Never redo completed tasks
- Never re-implement existing features unless explicitly required

6. Full Project Scope
These rules apply to ALL work:
- UI changes
- Backend changes
- API work
- Bug fixes
- Refactoring
- New features

7. Failure Recovery
If execution is interrupted:
- On next run, read ai-project-state.json
- Continue exactly from last_completed_task
- Ignore everything already marked completed

8. Safety Rule
Never break existing functionality while implementing changes.