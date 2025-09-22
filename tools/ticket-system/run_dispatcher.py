import asyncio
import sys
import os
from pathlib import Path
from dispatcher import AsyncTaskDispatcher
import time

async def main():
    """Main dispatcher runner"""
    print("Starting Async Task Dispatcher...")
    
    dispatcher = AsyncTaskDispatcher()
    
    # Add existing tickets to queue
    ticket_dir = Path("active/development")
    
    if not ticket_dir.exists():
        print(f"Ticket directory not found: {ticket_dir}")
        return
    
    ticket_count = 0
    for ticket_file in ticket_dir.glob("*.xml"):
        if ticket_file.name != "README.md":
            try:
                await dispatcher.add_ticket_to_queue(str(ticket_file))
                ticket_count += 1
                print(f"Added ticket: {ticket_file.name}")
            except Exception as e:
                print(f"Error adding ticket {ticket_file.name}: {e}")
    
    print(f"Added {ticket_count} tickets to queue")
    
    if ticket_count == 0:
        print("No tickets found. Exiting.")
        return
    
    # Start dispatch loop
    dispatch_task = asyncio.create_task(dispatcher.dispatch_tasks())
    
    try:
        # Run until all tasks complete
        while True:
            await asyncio.sleep(5)
            
            # Get status summary
            summary = dispatcher.get_status_summary()
            
            # Print status
            print(f"\nStatus Update - {time.strftime('%H:%M:%S')}")
            print(f"Active: {summary['active_tasks']}, "
                  f"Blocked: {summary['blocked_tasks']}, "
                  f"Completed: {summary['completed_tasks']}, "
                  f"Queue: {summary['queue_size']}")
            
            # Check if all work is done
            if (summary['active_tasks'] == 0 and 
                summary['blocked_tasks'] == 0 and 
                summary['queue_size'] == 0):
                print("\nAll tasks completed!")
                break
    
    except KeyboardInterrupt:
        print("\nShutting down dispatcher...")
        dispatch_task.cancel()
        await dispatch_task
        print("Dispatcher shutdown complete.")

if __name__ == "__main__":
    # Add the current directory to Python path
    sys.path.append(str(Path(__file__).parent))
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print(f"Error running dispatcher: {e}")
        sys.exit(1)
