# WebSocket Synchronization Fix - Kanban Real-time Updates

## Problem Description
The Kanban board implements WebSocket for real-time task updates between multiple users/tabs. However, during integration testing, it was observed that updates do not sync correctly. Tasks are not updated in real-time when modified from another session.

## Frontend Code Analysis
Based on the review of `utils/websocketService.ts` and `islands/KanbanBoardIsland.tsx`:

### 1. WebSocket Service (`utils/websocketService.ts`)
- Connects correctly to `ws://localhost:8080/ws` with JWT token.
- Handles automatic reconnection (max 5 attempts, 5-second interval).
- Has methods to subscribe/unsubscribe to projects: `subscribeToProject(projectId)` and `unsubscribeFromProject(projectId)`.
- Listens to events like `task_status_updated`, `task_assigned`, `task_created`, `task_deleted`.

### 2. Kanban Board Island (`islands/KanbanBoardIsland.tsx`)
- Connects to WebSocket in `useEffect` (lines 121-191).
- Listens to task events and updates local state (`setTasks`).
- **Identified Problem**: After `ws.connect()`, it does not call `ws.subscribeToProject(projectId)`. This means the frontend does not inform the backend which project it wants to subscribe to.

## Root Cause of Error
The backend requires an explicit subscription to the project to send WebSocket events. Without this subscription:
- WebSocket connection is established correctly.
- But the backend doesn't know which events to send to the client.
- Therefore, real-time task updates are not received.

## Required Backend API Modifications
For synchronization to work, the backend must:

### 1. Implement WebSocket Endpoint `/ws`
- Accept WebSocket connections at `ws://localhost:8080/ws`.
- Validate JWT token from query parameter `?token=...`.
- Maintain a list of active connections per project.

### 2. Handle Subscription Messages
- Listen to messages of type `{"type": "subscribe_project", "payload": {"projectId": number}}`.
- Add connection to a project "room" or group.
- Listen to messages of type `{"type": "unsubscribe_project", "payload": {"projectId": number}}` to remove connection.

### 3. Send Real-time Events
- When a task is updated (status, assignment, creation, deletion), send a WebSocket message to all connections subscribed to that task's project.
- Message formats:
  ```json
  {
    "type": "task_status_updated",
    "payload": {
      "taskId": number,
      "newStatus": "todo" | "in_progress" | "in_review" | "done",
      "oldStatus": string,
      "updatedBy": { "id": number, "name": string },
      "timestamp": string
    }
  }
  ```
  ```json
  {
    "type": "task_assigned",
    "payload": {
      "taskId": number,
      "assignedTo": { "id": number, "name": string },
      "assignedBy": { "id": number, "name": string },
      "timestamp": string
    }
  }
  ```
  ```json
  {
    "type": "task_created",
    "payload": {
      "task": Task,  // Complete task object
      "timestamp": string
    }
  }
  ```
  ```json
  {
    "type": "task_deleted",
    "payload": {
      "taskId": number,
      "deletedBy": { "id": number, "name": string },
      "timestamp": string
    }
  }
  ```

### 4. Security Validations
- Verify user has access to the project before subscribing.
- Only send task events that belong to the subscribed project.

## Frontend Modifications (for future reference)
Once the backend is ready, add in `KanbanBoardIsland.tsx`, after `ws.connect();`:
```typescript
ws.subscribeToProject(projectId);
```

## Implementation Steps for Backend
1. Choose a WebSocket library (e.g., `ws` in Node.js, or corresponding for Go/Rust/etc.).
2. Create a map or structure to track connections per project.
3. In `/ws` endpoint, when receiving a connection:
   - Validate JWT.
   - Listen to messages and handle subscriptions.
4. Integrate with task update logic: after modifying a task in DB, emit the corresponding WebSocket event to the project's connections.

## Testing Steps
1. Open the same Kanban board in two different tabs/browsers.
2. Move a task from one column to another in tab A.
3. Verify that the task moves automatically in tab B.
4. Test task assignment, creation, and deletion across tabs.

This should resolve the real-time synchronization issue. If the backend already has some implementation, verify that it's sending events correctly and that the frontend is subscribing.