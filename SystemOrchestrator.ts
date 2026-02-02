
import { DSPSystemManager, EventEmitter, ProcessingChain } from './DSPSystemManager';
import { IPCCommunicationHub } from './IPCCommunicationHub';

export type SystemState = 'UNINITIALIZED' | 'INITIALIZING' | 'READY' | 'RUNNING' | 'ERROR';

export interface SystemHealth {
  cpuLoad: number;
  memoryUsage: number;
  activeThreads: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export class SystemOrchestrator extends EventEmitter {
  private static instance: SystemOrchestrator;
  
  public state: SystemState = 'UNINITIALIZED';
  public dsp: DSPSystemManager;
  public ipc: IPCCommunicationHub;
  
  public health: SystemHealth = {
    cpuLoad: 0,
    memoryUsage: 0,
    activeThreads: 0,
    status: 'HEALTHY'
  };

  private constructor() {
    super();
    this.dsp = new DSPSystemManager();
    this.ipc = IPCCommunicationHub.getInstance();
  }

  public static getInstance(): SystemOrchestrator {
    if (!SystemOrchestrator.instance) {
      SystemOrchestrator.instance = new SystemOrchestrator();
    }
    return SystemOrchestrator.instance;
  }

  public async initialize(options: any = {}) {
    if (this.state !== 'UNINITIALIZED') return;

    this.state = 'INITIALIZING';
    this.emit('state-change', this.state);
    this.log('System', 'Starting initialization sequence...');

    try {
      // 1. Initialize DSP
      await this.dsp.initialize();
      this.log('Orchestrator', 'DSP Subsystem ready.');

      // 2. Setup IPC Handlers (simulating main process handlers)
      this.setupIPCHandlers();

      // 3. Simulate other subsystems
      await this.initializeSubsystems();

      this.state = 'READY';
      this.emit('state-change', this.state);
      this.log('System', 'System Ready. Waiting for user input.');
      
      this.startHealthMonitoring();

    } catch (error: any) {
      this.state = 'ERROR';
      this.emit('state-change', this.state);
      this.log('System', `Critical Error: ${error.message}`, 'ERROR');
      console.error(error);
      throw error; // Propagate to caller
    }
  }

  private setupIPCHandlers() {
      // Allow UI to invoke DSP methods via IPC
      this.ipc.handle('dsp:get-chain', () => {
          return this.dsp.getChain();
      });

      this.ipc.handle('dsp:set-chain', (chain: ProcessingChain) => {
          try {
            this.dsp.applyChain(chain);
            this.log('DSP', 'Processing chain updated via IPC');
            return true;
          } catch (e: any) {
            this.log('DSP', `Failed to apply chain: ${e.message}`, 'ERROR');
            throw e;
          }
      });

      this.ipc.handle('dsp:get-presets', () => {
        return this.dsp.getPresets();
      });

      this.ipc.handle('dsp:load-preset', (name: string) => {
        try {
          const chain = this.dsp.loadPreset(name);
          this.dsp.applyChain(chain);
          this.log('DSP', `Preset loaded: ${name}`);
          return chain;
        } catch (e: any) {
          this.log('DSP', `Failed to load preset: ${e.message}`, 'ERROR');
          throw e;
        }
      });

      this.ipc.handle('dsp:save-preset', ({ name, chain }: { name: string, chain: ProcessingChain }) => {
        try {
          this.dsp.savePreset(name, chain);
          this.log('DSP', `Preset saved: ${name}`);
          return true;
        } catch (e: any) {
           this.log('DSP', `Failed to save preset: ${e.message}`, 'ERROR');
           throw e;
        }
      });

      this.ipc.handle('system:get-health', () => {
          return this.health;
      });
  }

  private async initializeSubsystems() {
    return new Promise<void>(resolve => setTimeout(resolve, 500));
  }

  private startHealthMonitoring() {
    setInterval(() => {
      this.health.cpuLoad = Math.random() * 30 + 10;
      this.health.memoryUsage = Math.random() * 200 + 150;
      this.health.activeThreads = 4 + Math.floor(Math.random() * 3);
      this.emit('health-update', this.health);
      this.ipc.send('system:health-update', this.health); // Broadcast
    }, 2000);
  }

  public log(module: string, message: string, type: 'INFO' | 'WARN' | 'ERROR' = 'INFO') {
    const timestamp = new Date().toLocaleTimeString();
    this.emit('log', { timestamp, module, message, type });
    this.ipc.send('system:log', { timestamp, module, message, type });
    console.log(`[${timestamp}] [${module}] ${message}`);
  }
}

export const system = SystemOrchestrator.getInstance();
