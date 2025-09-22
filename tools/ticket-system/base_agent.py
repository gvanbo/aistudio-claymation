import asyncio
import json
import argparse
from abc import ABC, abstractmethod
from typing import Dict, Any
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime

class BaseAgent(ABC):
    def __init__(self, agent_type: str):
        self.agent_type = agent_type
        self.ticket_id = None
        self.ticket_data = None

    @abstractmethod
    async def process_ticket(self, ticket_data: dict) -> Dict[str, Any]:
        """Process the ticket and return results"""
        pass

    async def run(self, ticket_id: str):
        """Main agent execution method"""
        self.ticket_id = ticket_id
        
        # Load ticket data
        self.ticket_data = self.load_ticket_data(ticket_id)
        
        # Process ticket
        result = await self.process_ticket(self.ticket_data)
        
        # Return structured result
        output = {
            "agent_type": self.agent_type,
            "ticket_id": ticket_id,
            "status": "completed",
            "output": result,
            "timestamp": asyncio.get_event_loop().time()
        }
        
        print(json.dumps(output))

    def load_ticket_data(self, ticket_id: str) -> dict:
        """Load ticket XML and parse into structured data"""
        # Find the actual ticket file (filename may include title)
        ticket_dir = Path(__file__).parent / "active/development"
        ticket_files = list(ticket_dir.glob(f"{ticket_id}*.xml"))
        
        if not ticket_files:
            raise FileNotFoundError(f"Ticket file not found for ID: {ticket_id}")
        
        ticket_path = ticket_files[0]  # Use the first matching file
        
        tree = ET.parse(ticket_path)
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
                    title_elem = root.find(".//ns0:title", ns)
                    description_elem = root.find(".//ns0:description", ns)
                    priority_elem = root.find(".//ns0:priority", ns)
                    status_elem = root.find(".//ns0:status", ns)
                else:
                    id_elem = root.find(".//ns:id", ns) if ns else root.find(".//id")
                    title_elem = root.find(".//ns:title", ns) if ns else root.find(".//title")
                    description_elem = root.find(".//ns:description", ns) if ns else root.find(".//description")
                    priority_elem = root.find(".//ns:priority", ns) if ns else root.find(".//priority")
                    status_elem = root.find(".//ns:status", ns) if ns else root.find(".//status")
                
                if id_elem is not None:
                    return {
                        "id": id_elem.text,
                        "title": title_elem.text if title_elem is not None else "No Title",
                        "description": description_elem.text if description_elem is not None else "",
                        "priority": priority_elem.text if priority_elem is not None else "medium",
                        "status": status_elem.text if status_elem is not None else "open",
                        "requirements": self.parse_requirements(root, ns),
                        "dependencies": self.parse_dependencies(root, ns),
                        "tags": [tag.text for tag in (root.findall(".//ns:tag", ns) if ns else root.findall(".//tag"))]
                    }
            except Exception:
                continue
        
        # If no namespace worked, try without namespace
        return {
            "id": root.find(".//id").text if root.find(".//id") is not None else "Unknown",
            "title": root.find(".//title").text if root.find(".//title") is not None else "No Title",
            "description": root.find(".//description").text if root.find(".//description") is not None else "",
            "priority": root.find(".//priority").text if root.find(".//priority") is not None else "medium",
            "status": root.find(".//status").text if root.find(".//status") is not None else "open",
            "requirements": self.parse_requirements(root),
            "dependencies": self.parse_dependencies(root),
            "tags": [tag.text for tag in root.findall(".//tag")]
        }

    def parse_requirements(self, root, ns=None) -> dict:
        """Parse requirements section from ticket XML"""
        requirements = {}
        if ns is None:
            ns = {'ns': 'http://nsa.ca/ticket-system'}
        
        req_section = root.find(".//ns:requirements", ns)
        
        if req_section is not None:
            for req_type in ["functional", "technical", "non_functional"]:
                req_elem = req_section.find(f"ns:{req_type}", ns)
                if req_elem is not None:
                    requirements[req_type] = [
                        req.get("id") for req in req_elem.findall("ns:requirement", ns)
                    ]
        
        return requirements

    def parse_dependencies(self, root, ns=None) -> list:
        """Parse dependencies from ticket XML"""
        deps = []
        if ns is None:
            ns = {'ns': 'http://nsa.ca/ticket-system'}
        
        deps_section = root.find(".//ns:dependencies", ns)
        
        if deps_section is not None:
            for dep in deps_section.findall("ns:dependency", ns):
                deps.append({
                    "id": dep.get("id"),
                    "type": dep.get("type"),
                    "description": dep.text
                })
        
        return deps

    def update_ticket_progress(self, status: str, details: str):
        """Update ticket with progress information"""
        # Find the actual ticket file (filename may include title)
        ticket_dir = Path("tools/ticket-system/active/development")
        ticket_files = list(ticket_dir.glob(f"{self.ticket_id}*.xml"))
        
        if not ticket_files:
            print(f"Warning: Ticket file not found for progress update: {self.ticket_id}")
            return
        
        ticket_path = ticket_files[0]  # Use the first matching file
        
        tree = ET.parse(ticket_path)
        root = tree.getroot()
        
        # Add progress update
        progress_elem = root.find(".//progress")
        if progress_elem is None:
            progress_elem = ET.SubElement(root, "progress")
        
        update_elem = ET.SubElement(progress_elem, "update")
        update_elem.set("timestamp", datetime.now().isoformat())
        update_elem.set("agent", self.agent_type)
        
        status_elem = ET.SubElement(update_elem, "status")
        status_elem.text = status
        
        details_elem = ET.SubElement(update_elem, "details")
        details_elem.text = details
        
        tree.write(ticket_path, encoding="UTF-8", xml_declaration=True)

    def log_info(self, message: str):
        """Log informational message"""
        print(f"[{self.agent_type}] INFO: {message}")

    def log_error(self, message: str):
        """Log error message"""
        print(f"[{self.agent_type}] ERROR: {message}")

    def log_warning(self, message: str):
        """Log warning message"""
        print(f"[{self.agent_type}] WARNING: {message}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ticket-id", required=True, help="Ticket ID to process")
    args = parser.parse_args()
    
    # This would be implemented by specific agents
    # agent = SpecificAgent()
    # asyncio.run(agent.run(args.ticket_id))
