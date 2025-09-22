import asyncio
import json
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime
import xml.etree.ElementTree as ET
import os
import sys
from pathlib import Path

@dataclass
class Task:
    ticket_id: str
    agent_type: str
    priority: int
    dependencies: List[str]
    estimated_duration: int  # minutes
    status: str = "pending"
    assigned_agent: Optional[str] = None
    start_time: Optional[datetime] = None
    completion_time: Optional[datetime] = None

class AsyncTaskDispatcher:
    def __init__(self):
        self.task_queue = asyncio.Queue()
        self.active_tasks: Dict[str, Task] = {}
        self.agent_pools = {
            "react-components": asyncio.Semaphore(3),  # Max 3 concurrent React tasks
            "ai-integration": asyncio.Semaphore(2),
            "animation": asyncio.Semaphore(2),
            "testing": asyncio.Semaphore(4),
            "deployment": asyncio.Semaphore(2)
        }
        self.completed_tasks = []
        self.blocked_tasks = []
        self.base_path = Path(__file__).parent

    async def add_ticket_to_queue(self, ticket_xml_path: str):
        """Parse ticket XML and create tasks for each agent type needed"""
        ticket = self.parse_ticket_xml(ticket_xml_path)
        
        # Create tasks based on ticket requirements
        tasks = self.create_tasks_from_ticket(ticket)
        
        for task in tasks:
            await self.task_queue.put(task)
            self.active_tasks[f"{task.ticket_id}_{task.agent_type}"] = task

    def create_tasks_from_ticket(self, ticket_data: dict) -> List[Task]:
        """Analyze ticket and create appropriate tasks for different agents"""
        tasks = []
        
        # Get tags and type
        tags = ticket_data.get("tags", [])
        ticket_type = ticket_data.get("type", "development")
        
        # Content tasks - create for content-related tickets or if content tag exists
        if "content" in tags or any(tag in ["content", "lesson", "educational"] for tag in tags):
            tasks.append(Task(
                ticket_id=ticket_data["id"],
                agent_type="content",
                priority=self.get_priority_score(ticket_data["priority"]),
                dependencies=[],
                estimated_duration=120  # 2 hours
            ))
        
        # Development tasks - create for development tickets or if development tag exists
        if "development" in tags or ticket_type == "development" or any(tag in ["development", "code", "bug", "feature"] for tag in tags):
            tasks.append(Task(
                ticket_id=ticket_data["id"],
                agent_type="development",
                priority=self.get_priority_score(ticket_data["priority"]),
                dependencies=["content"] if "content" in [t.agent_type for t in tasks] else [],
                estimated_duration=180
            ))
        
        # Asset tasks - create for asset-related tickets or if asset tag exists
        if "assets" in tags or any(tag in ["assets", "images", "qr", "media"] for tag in tags):
            tasks.append(Task(
                ticket_id=ticket_data["id"],
                agent_type="asset",
                priority=self.get_priority_score(ticket_data["priority"]),
                dependencies=["content"] if "content" in [t.agent_type for t in tasks] else [],
                estimated_duration=60
            ))
        
        # QA tasks - create for QA-related tickets or if qa tag exists
        if "qa" in tags or any(tag in ["qa", "testing", "validation"] for tag in tags):
            tasks.append(Task(
                ticket_id=ticket_data["id"],
                agent_type="qa",
                priority=self.get_priority_score(ticket_data["priority"]),
                dependencies=["development", "asset"] if any(t.agent_type in ["development", "asset"] for t in tasks) else [],
                estimated_duration=90
            ))
        
        # Infrastructure tasks - create for infrastructure-related tickets or if infrastructure tag exists
        if "infrastructure" in tags or any(tag in ["infrastructure", "deployment", "r2", "github-actions"] for tag in tags):
            tasks.append(Task(
                ticket_id=ticket_data["id"],
                agent_type="infrastructure",
                priority=self.get_priority_score(ticket_data["priority"]),
                dependencies=["qa"] if "qa" in [t.agent_type for t in tasks] else [],
                estimated_duration=240
            ))
        
        # If no tasks were created, create a default development task for development tickets
        if not tasks and ticket_type == "development":
            tasks.append(Task(
                ticket_id=ticket_data["id"],
                agent_type="development",
                priority=self.get_priority_score(ticket_data["priority"]),
                dependencies=[],
                estimated_duration=180
            ))
        
        return tasks

    async def dispatch_tasks(self):
        """Main dispatch loop - runs continuously"""
        while True:
            try:
                # Get next task from queue
                task = await self.task_queue.get()
                
                # Check if dependencies are met
                if self.check_dependencies(task):
                    # Acquire agent pool semaphore
                    async with self.agent_pools[task.agent_type]:
                        await self.execute_task(task)
                else:
                    # Move to blocked queue
                    self.blocked_tasks.append(task)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Error in dispatch loop: {e}")

    async def execute_task(self, task: Task):
        """Execute a single task with the appropriate agent"""
        task.status = "in_progress"
        task.start_time = datetime.now()
        
        print(f"Starting task: {task.ticket_id} ({task.agent_type})")
        
        try:
            # Call the appropriate agent
            agent_result = await self.call_agent(task)
            
            task.status = "completed"
            task.completion_time = datetime.now()
            self.completed_tasks.append(task)
            
            # Remove from active tasks
            task_key = f"{task.ticket_id}_{task.agent_type}"
            if task_key in self.active_tasks:
                del self.active_tasks[task_key]
            
            # Update ticket status
            await self.update_ticket_status(task.ticket_id, agent_result)
            
            print(f"Completed task: {task.ticket_id} ({task.agent_type})")
            
            # Check if blocked tasks can now proceed
            await self.check_blocked_tasks()
            
        except Exception as e:
            task.status = "failed"
            print(f"Task {task.ticket_id} failed: {e}")

    async def call_agent(self, task: Task):
        """Call the appropriate agent based on task type"""
        agent_map = {
            "content": "agents/content-parser/content_agent.py",
            "development": "agents/operator/development_agent.py",
            "asset": "agents/asset-manager/asset_agent.py",
            "qa": "agents/qa-validator/qa_agent.py",
            "infrastructure": "agents/infrastructure/infrastructure_agent.py"
        }
        
        agent_script = agent_map.get(task.agent_type)
        if not agent_script:
            raise ValueError(f"Unknown agent type: {task.agent_type}")
        
        # Execute the actual agent script
        import subprocess
        import sys
        
        try:
            # Build the command to run the agent
            cmd = [sys.executable, agent_script, task.ticket_id]
            
            print(f"  Executing agent: {' '.join(cmd)}")
            
            # Run the agent process
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=Path(__file__).parent.parent.parent  # Set working directory to HTML/
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0:
                # Parse the JSON output from the agent
                try:
                    agent_output = json.loads(stdout.decode().strip())
                    return agent_output
                except json.JSONDecodeError:
                    # Fallback if JSON parsing fails
                    return {
                        "agent_type": task.agent_type,
                        "status": "completed",
                        "output": {
                            "stdout": stdout.decode(),
                            "summary": f"Agent {task.agent_type} completed successfully"
                        }
                    }
            else:
                error_msg = stderr.decode() if stderr else "Unknown error"
                print(f"Agent {task.agent_type} failed: {error_msg}")
                return {
                    "agent_type": task.agent_type,
                    "status": "failed",
                    "output": {
                        "error": error_msg,
                        "return_code": process.returncode
                    }
                }
                
        except Exception as e:
            print(f"Error executing agent {task.agent_type}: {e}")
            return {
                "agent_type": task.agent_type,
                "status": "failed",
                "output": {
                    "error": str(e)
                }
            }

    def check_dependencies(self, task: Task) -> bool:
        """Check if all dependencies for a task are completed"""
        for dep in task.dependencies:
            # Check if dependency task is completed
            completed_deps = [t for t in self.completed_tasks if t.agent_type == dep]
            if not completed_deps:
                return False
        return True

    async def check_blocked_tasks(self):
        """Move unblocked tasks back to main queue"""
        unblocked = []
        for task in self.blocked_tasks:
            if self.check_dependencies(task):
                unblocked.append(task)
                await self.task_queue.put(task)
        
        for task in unblocked:
            self.blocked_tasks.remove(task)

    async def update_ticket_status(self, ticket_id: str, agent_result: dict):
        """Update ticket XML with agent results"""
        # Find the actual ticket file (filename may include title)
        ticket_dir = Path("active/development")
        ticket_files = list(ticket_dir.glob(f"{ticket_id}*.xml"))
        
        if not ticket_files:
            print(f"Ticket file not found for ID: {ticket_id}")
            return
        
        ticket_path = ticket_files[0]  # Use the first matching file
        
        tree = ET.parse(ticket_path)
        root = tree.getroot()
        
        # Add agent result to ticket
        progress_elem = root.find(".//progress")
        if progress_elem is None:
            progress_elem = ET.SubElement(root, "progress")
        
        update_elem = ET.SubElement(progress_elem, "update")
        update_elem.set("timestamp", datetime.now().isoformat())
        update_elem.set("agent", agent_result.get("agent_type", "unknown"))
        
        status_elem = ET.SubElement(update_elem, "status")
        status_elem.text = agent_result.get("status", "completed")
        
        result_elem = ET.SubElement(update_elem, "result")
        result_elem.text = json.dumps(agent_result.get("output", {}))
        
        tree.write(ticket_path, encoding="UTF-8", xml_declaration=True)

    def get_priority_score(self, priority: str) -> int:
        """Convert priority string to numeric score"""
        priority_map = {
            "critical": 100,
            "high": 75,
            "medium": 50,
            "low": 25,
            "backlog": 10
        }
        return priority_map.get(priority, 50)

    def parse_ticket_xml(self, xml_path: str) -> dict:
        """Parse ticket XML and extract relevant data"""
        tree = ET.parse(xml_path)
        root = tree.getroot()
        
        # Try different namespaces
        namespaces = [
            {'ns': 'http://nsa.ca/ticket-system'},
            {'ns': 'https://nsa-images.org/schemas/ticket/v1.0'},
            {'ns0': 'https://nsa-images.org/schemas/ticket/v1.0'},
            {}  # No namespace
        ]
        
        for ns in namespaces:
            try:
                # Try to find elements with current namespace
                if 'ns0' in ns:
                    id_elem = root.find(".//ns0:id", ns)
                    priority_elem = root.find(".//ns0:priority", ns)
                    type_elem = root.find(".//ns0:type", ns)
                    status_elem = root.find(".//ns0:status", ns)
                    tags_elem = root.findall(".//ns0:tag", ns)
                else:
                    id_elem = root.find(".//ns:id", ns) if ns else root.find(".//id")
                    priority_elem = root.find(".//ns:priority", ns) if ns else root.find(".//priority")
                    type_elem = root.find(".//ns:type", ns) if ns else root.find(".//type")
                    status_elem = root.find(".//ns:status", ns) if ns else root.find(".//status")
                    tags_elem = root.findall(".//ns:tag", ns) if ns else root.findall(".//tag")
                
                if id_elem is not None:
                    return {
                        "id": id_elem.text,
                        "priority": priority_elem.text if priority_elem is not None else "medium",
                        "tags": [tag.text for tag in tags_elem],
                        "type": type_elem.text if type_elem is not None else "development",
                        "status": status_elem.text if status_elem is not None else "active"
                    }
            except Exception:
                continue
        
        # If no namespace worked, try without namespace
        return {
            "id": root.find(".//id").text if root.find(".//id") is not None else "Unknown",
            "priority": root.find(".//priority").text if root.find(".//priority") is not None else "medium",
            "tags": [tag.text for tag in root.findall(".//tag")],
            "type": root.find(".//type").text if root.find(".//type") is not None else "development",
            "status": root.find(".//status").text if root.find(".//status") is not None else "active"
        }

    def get_status_summary(self):
        """Get current status summary"""
        return {
            "active_tasks": len(self.active_tasks),
            "blocked_tasks": len(self.blocked_tasks),
            "completed_tasks": len(self.completed_tasks),
            "queue_size": self.task_queue.qsize()
        }
