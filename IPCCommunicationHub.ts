
import { EventEmitter } from './DSPSystemManager';

export class IPCCommunicationHub extends EventEmitter {
  private static instance: IPCCommunicationHub;

  private constructor() {
    super();
  }

  public static getInstance(): IPCCommunicationHub {
    if (!IPCCommunicationHub.instance) {
      IPCCommunicationHub.instance = new IPCCommunicationHub();
    }
    return IPCCommunicationHub.instance;
  }

  // Simulate ipcMain.handle / ipcRenderer.invoke
  public handle(channel: string, listener: (payload: any) => Promise<any> | any) {
    this.on(`invoke:${channel}`, async (payload: any, responseId: string) => {
      try {
        const result = await listener(payload);
        this.emit(`response:${responseId}`, { success: true, data: result });
      } catch (error: any) {
        this.emit(`response:${responseId}`, { success: false, error: error.message });
      }
    });
  }

  public async invoke<T = any>(channel: string, payload?: any): Promise<T> {
    const responseId = Math.random().toString(36).substring(2, 11);
    return new Promise((resolve, reject) => {
      const handler = (response: any) => {
        this.off(`response:${responseId}`, handler);
        if (response.success) resolve(response.data);
        else reject(new Error(response.error));
      };
      this.on(`response:${responseId}`, handler);
      this.emit(`invoke:${channel}`, payload, responseId);
    });
  }

  public send(channel: string, payload: any) {
    this.emit(channel, payload);
  }
}
