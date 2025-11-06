export type Listener = (payload: unknown) => void;

export class KanbanWebSocket {
  private token: string;
  private ws: WebSocket | null = null;
  private listeners: Map<string, Listener[]> = new Map();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectInterval = 5000;

  constructor(token: string) {
    this.token = token;
  }

  connect() {
    try {
      this.ws = new WebSocket(`ws://localhost:8080/ws?token=${this.token}`);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.emit("connection_established", { message: "Connected" });
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string) as {
            type: string;
            payload: unknown;
          };
          this.emit(data.type, data.payload);
          this.emit("message", data);
        } catch (_err) {
          // ignore malformed messages
        }
      };

      this.ws.onclose = () => {
        this.handleReconnect();
      };

      this.ws.onerror = () => {
        // error is also followed by close in most browsers
      };
    } catch (_e) {
      this.handleReconnect();
    }
  }

  subscribeToProject(projectId: number) {
    this.send({ type: "subscribe_project", payload: { projectId } });
  }

  unsubscribeFromProject(projectId: number) {
    this.send({ type: "unsubscribe_project", payload: { projectId } });
  }

  on(event: string, cb: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(cb);
  }

  off(event: string, cb: Listener) {
    const arr = this.listeners.get(event);
    if (!arr) return;
    const idx = arr.indexOf(cb);
    if (idx >= 0) arr.splice(idx, 1);
  }

  private emit(event: string, data: unknown) {
    const arr = this.listeners.get(event);
    if (!arr) return;
    for (const cb of arr) cb(data);
  }

  send(data: unknown) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      this.emit("connection_failed", { message: "Unable to reconnect" });
    }
  }

  disconnect() {
    this.reconnectAttempts = this.maxReconnectAttempts;
    this.ws?.close();
  }
}
