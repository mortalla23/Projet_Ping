export class WebSocketService {
    constructor(url) {
      this.socket = new WebSocket(url);
    }
  
    sendMessage(message) {
      this.socket.send(JSON.stringify(message));
    }
  
    onMessage(callback) {
      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        callback(message);
      };
    }
  
    close() {
      this.socket.close();
    }
  }
  