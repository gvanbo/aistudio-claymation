import asyncio
import json
from datetime import datetime
from pathlib import Path
import xml.etree.ElementTree as ET
import time

class TicketDashboard:
    def __init__(self):
        self.ticket_dir = Path("active/development")

    async def generate_dashboard(self):
        """Generate real-time dashboard data"""
        tickets = self.load_all_tickets()
        
        dashboard_data = {
            "timestamp": datetime.now().isoformat(),
            "summary": self.generate_summary(tickets),
            "by_team": self.group_by_team(tickets),
            "by_priority": self.group_by_priority(tickets),
            "by_status": self.group_by_status(tickets),
            "blocked_tickets": self.find_blocked_tickets(tickets),
            "recent_updates": self.get_recent_updates(tickets)
        }
        
        return dashboard_data

    def load_all_tickets(self):
        """Load all ticket XML files"""
        tickets = []
        
        if not self.ticket_dir.exists():
            return tickets
        
        for ticket_file in self.ticket_dir.glob("*.xml"):
            if ticket_file.name != "README.md":
                try:
                    tree = ET.parse(ticket_file)
                    root = tree.getroot()
                    
                    # Try different namespaces
                    namespaces = [
                        {'ns': 'http://nsa.ca/ticket-system'},
                        {'ns': 'https://nsa-images.org/schemas/ticket/v1.0'},
                        {'ns0': 'https://nsa-images.org/schemas/ticket/v1.0'},
                        {}  # No namespace
                    ]
                    
                    ticket_data = None
                    for ns in namespaces:
                        try:
                            # Try to find elements with current namespace
                            if 'ns0' in ns:
                                id_elem = root.find(".//ns0:id", ns)
                                title_elem = root.find(".//ns0:title", ns)
                                type_elem = root.find(".//ns0:type", ns)
                                priority_elem = root.find(".//ns0:priority", ns)
                                status_elem = root.find(".//ns0:status", ns)
                                assigned_to_elem = root.find(".//ns0:assigned_to", ns)
                                created_elem = root.find(".//ns0:created", ns)
                                tags_elem = root.findall(".//ns0:tag", ns)
                            else:
                                id_elem = root.find(".//ns:id", ns) if ns else root.find(".//id")
                                title_elem = root.find(".//ns:title", ns) if ns else root.find(".//title")
                                type_elem = root.find(".//ns:type", ns) if ns else root.find(".//type")
                                priority_elem = root.find(".//ns:priority", ns) if ns else root.find(".//priority")
                                status_elem = root.find(".//ns:status", ns) if ns else root.find(".//status")
                                assigned_to_elem = root.find(".//ns:assigned_to", ns) if ns else root.find(".//assigned_to")
                                created_elem = root.find(".//ns:created", ns) if ns else root.find(".//created")
                                tags_elem = root.findall(".//ns:tag", ns) if ns else root.findall(".//tag")
                            
                            if id_elem is not None:
                                ticket_data = {
                                    "id": id_elem.text,
                                    "title": title_elem.text if title_elem is not None else "No Title",
                                    "type": type_elem.text if type_elem is not None else "Unknown",
                                    "priority": priority_elem.text if priority_elem is not None else "medium",
                                    "status": status_elem.text if status_elem is not None else "open",
                                    "assigned_to": assigned_to_elem.text if assigned_to_elem is not None else "Unassigned",
                                    "created": created_elem.text if created_elem is not None else "Unknown",
                                    "tags": [tag.text for tag in tags_elem],
                                    "progress": self.parse_progress(root, ns)
                                }
                                break
                        except Exception:
                            continue
                    
                    # If no namespace worked, try without namespace
                    if ticket_data is None:
                        ticket_data = {
                            "id": root.find(".//id").text if root.find(".//id") is not None else "Unknown",
                            "title": root.find(".//title").text if root.find(".//title") is not None else "No Title",
                            "type": root.find(".//type").text if root.find(".//type") is not None else "Unknown",
                            "priority": root.find(".//priority").text if root.find(".//priority") is not None else "medium",
                            "status": root.find(".//status").text if root.find(".//status") is not None else "open",
                            "assigned_to": root.find(".//assigned_to").text if root.find(".//assigned_to") is not None else "Unassigned",
                            "created": root.find(".//created").text if root.find(".//created") is not None else "Unknown",
                            "tags": [tag.text for tag in root.findall(".//tag")],
                            "progress": self.parse_progress(root)
                        }
                    
                    tickets.append(ticket_data)
                except Exception as e:
                    print(f"Error loading {ticket_file}: {e}")
        
        return tickets

    def parse_progress(self, root, ns=None):
        """Parse progress updates from ticket"""
        progress = []
        if ns is None:
            ns = {'ns': 'http://nsa.ca/ticket-system'}
        
        progress_elem = root.find(".//ns:progress", ns)
        
        if progress_elem is not None:
            for update in progress_elem.findall("ns:update", ns):
                progress.append({
                    "timestamp": update.get("timestamp"),
                    "agent": update.get("agent"),
                    "status": update.find("ns:status", ns).text if update.find("ns:status", ns) is not None else None,
                    "details": update.find("ns:details", ns).text if update.find("ns:details", ns) is not None else None
                })
        
        return progress

    def generate_summary(self, tickets):
        """Generate summary statistics"""
        return {
            "total_tickets": len(tickets),
            "open_tickets": len([t for t in tickets if t["status"] == "open"]),
            "in_progress": len([t for t in tickets if t["status"] == "in-progress"]),
            "blocked": len([t for t in tickets if t["status"] == "blocked"]),
            "completed": len([t for t in tickets if t["status"] == "done"]),
            "critical": len([t for t in tickets if t["priority"] == "critical"]),
            "high": len([t for t in tickets if t["priority"] == "high"])
        }

    def group_by_team(self, tickets):
        """Group tickets by team/type"""
        teams = {}
        for ticket in tickets:
            team = ticket["type"]
            if team not in teams:
                teams[team] = []
            teams[team].append(ticket)
        return teams

    def group_by_priority(self, tickets):
        """Group tickets by priority"""
        priorities = {}
        for ticket in tickets:
            priority = ticket["priority"]
            if priority not in priorities:
                priorities[priority] = []
            priorities[priority].append(ticket)
        return priorities

    def group_by_status(self, tickets):
        """Group tickets by status"""
        statuses = {}
        for ticket in tickets:
            status = ticket["status"]
            if status not in statuses:
                statuses[status] = []
            statuses[status].append(ticket)
        return statuses

    def find_blocked_tickets(self, tickets):
        """Find tickets that are blocked"""
        blocked = []
        for ticket in tickets:
            if ticket["status"] == "blocked":
                blocked.append(ticket)
        return blocked

    def get_recent_updates(self, tickets, hours=24):
        """Get recent progress updates"""
        recent_updates = []
        cutoff = datetime.now().timestamp() - (hours * 3600)
        
        for ticket in tickets:
            for update in ticket.get("progress", []):
                try:
                    if update.get("timestamp"):
                        update_time = datetime.fromisoformat(update["timestamp"].replace('Z', '+00:00')).timestamp()
                        if update_time > cutoff:
                            recent_updates.append({
                                "ticket_id": ticket["id"],
                                "ticket_title": ticket["title"],
                                "update": update
                            })
                except Exception as e:
                    # Skip malformed timestamps
                    continue
        
        return sorted(recent_updates, key=lambda x: x["update"]["timestamp"], reverse=True)

    def print_dashboard(self, data):
        """Print formatted dashboard to console"""
        print("\n" + "="*80)
        print("NSA TICKET SYSTEM DASHBOARD")
        print("="*80)
        print(f"Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Summary
        summary = data["summary"]
        print(f"\n📊 SUMMARY")
        print(f"   Total Tickets: {summary['total_tickets']}")
        print(f"   Open: {summary['open_tickets']} | In Progress: {summary['in_progress']} | Blocked: {summary['blocked']} | Completed: {summary['completed']}")
        print(f"   Critical: {summary['critical']} | High Priority: {summary['high']}")
        
        # By Status
        print(f"\n📋 BY STATUS")
        for status, tickets in data["by_status"].items():
            print(f"   {status.upper()}: {len(tickets)} tickets")
            for ticket in tickets[:3]:  # Show first 3
                print(f"     - {ticket['id']}: {ticket['title'][:50]}...")
            if len(tickets) > 3:
                print(f"     ... and {len(tickets) - 3} more")
        
        # By Priority
        print(f"\n🎯 BY PRIORITY")
        for priority, tickets in data["by_priority"].items():
            print(f"   {priority.upper()}: {len(tickets)} tickets")
        
        # Recent Updates
        recent = data["recent_updates"]
        if recent:
            print(f"\n🔄 RECENT UPDATES (Last 24 hours)")
            for update in recent[:5]:  # Show last 5 updates
                print(f"   {update['ticket_id']} ({update['update']['agent']}): {update['update']['status']}")
        
        # Blocked Tickets
        blocked = data["blocked_tickets"]
        if blocked:
            print(f"\n⚠️  BLOCKED TICKETS")
            for ticket in blocked:
                print(f"   {ticket['id']}: {ticket['title'][:50]}...")
        
        print("\n" + "="*80)

async def main():
    """Run dashboard"""
    dashboard = TicketDashboard()
    
    print("Starting Ticket Dashboard...")
    print("Press Ctrl+C to exit")
    
    while True:
        try:
            data = await dashboard.generate_dashboard()
            dashboard.print_dashboard(data)
            await asyncio.sleep(30)  # Update every 30 seconds
        except KeyboardInterrupt:
            print("\nDashboard stopped.")
            break
        except Exception as e:
            print(f"Dashboard error: {e}")
            await asyncio.sleep(5)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
