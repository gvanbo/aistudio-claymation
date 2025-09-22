# AI Studio Claymation Ticket System Configuration

## Workspace-Specific Agents

This ticket system has been customized for aistudio-claymation workspace with the following specialized agents:

### Agent Types
- **react-components**: React/TypeScript component development
- **ai-integration**: Google AI Studio and Gemini API integration
- **animation**: Claymation effects and animation systems
- **testing**: Jest unit testing and component testing
- **deployment**: Build and deployment processes

### Agent Pool Limits
- React Components: 3 concurrent tasks
- AI Integration: 2 concurrent tasks
- Animation: 2 concurrent tasks
- Testing: 4 concurrent tasks
- Deployment: 2 concurrent tasks

### Focus Areas
- React/TypeScript application development
- Google AI Studio API integrations
- Claymation character and background systems
- Animation timing and transitions
- Component testing with Jest
- AI prompt generation and management

### File Associations
- TypeScript/React files (.tsx, .ts)
- Standard Python, XML, and Markdown files
- Build artifacts excluded (dist, build, node_modules)

## Usage
Run the dispatcher from this directory:
```bash
cd "c:\VS Code Repos\aistudio-claymation\tools\ticket-system"
python run_dispatcher.py
```