
export class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  public on(event: string, listener: Function): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  public off(event: string, listener: Function): this {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }

  public emit(event: string, ...args: any[]): boolean {
    if (!this.events[event]) return false;
    this.events[event].forEach(listener => listener(...args));
    return true;
  }

  public removeListener(event: string, listener: Function): this {
      return this.off(event, listener);
  }
}

export interface EqualizerBand {
  frequency: number;
  gain: number;
  q: number;
  type: BiquadFilterType;
}

export interface CompressorSettings {
  enabled: boolean;
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
}

export interface ProcessingChain {
  equalizer: {
    enabled: boolean;
    bands: EqualizerBand[];
  };
  compressor: CompressorSettings;
  masterVolume: number;
}

export class DSPSystemManager extends EventEmitter {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private eqNodes: BiquadFilterNode[] = [];
  
  private presets: Map<string, ProcessingChain> = new Map();

  // Default Chain Configuration
  private currentChain: ProcessingChain = {
    equalizer: {
      enabled: true,
      bands: [
        { frequency: 32, gain: 0, q: 1.0, type: 'lowshelf' },
        { frequency: 64, gain: 0, q: 1.0, type: 'peaking' },
        { frequency: 125, gain: 0, q: 1.0, type: 'peaking' },
        { frequency: 250, gain: 0, q: 1.0, type: 'peaking' },
        { frequency: 500, gain: 0, q: 1.0, type: 'peaking' },
        { frequency: 1000, gain: 0, q: 1.0, type: 'peaking' },
        { frequency: 2000, gain: 0, q: 1.0, type: 'peaking' },
        { frequency: 4000, gain: 0, q: 1.0, type: 'peaking' },
        { frequency: 8000, gain: 0, q: 1.0, type: 'peaking' },
        { frequency: 16000, gain: 0, q: 1.0, type: 'highshelf' },
      ]
    },
    compressor: {
      enabled: false,
      threshold: -24,
      ratio: 12,
      attack: 0.003,
      release: 0.25
    },
    masterVolume: 0.8
  };

  public isInitialized: boolean = false;

  constructor() {
    super();
    this.initializeDefaultPresets();
  }

  private initializeDefaultPresets() {
    this.presets.set('Flat (Default)', JSON.parse(JSON.stringify(this.currentChain)));

    const bassBoost = JSON.parse(JSON.stringify(this.currentChain));
    bassBoost.equalizer.bands[0].gain = 8;
    bassBoost.equalizer.bands[1].gain = 6;
    bassBoost.equalizer.bands[2].gain = 3;
    this.presets.set('Bass Boost', bassBoost);

    const vocal = JSON.parse(JSON.stringify(this.currentChain));
    vocal.equalizer.bands[0].gain = -5; // Cut subs
    vocal.equalizer.bands[5].gain = 3; // 1k
    vocal.equalizer.bands[6].gain = 4; // 2k
    vocal.equalizer.bands[7].gain = 3; // 4k
    this.presets.set('Vocal Clarity', vocal);

    const crushed = JSON.parse(JSON.stringify(this.currentChain));
    crushed.compressor.enabled = true;
    crushed.compressor.threshold = -35;
    crushed.compressor.ratio = 20;
    crushed.compressor.attack = 0.001;
    this.presets.set('Heavy Compression', crushed);
  }

  async initialize(): Promise<void> {
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AudioContextClass) {
        throw new Error("Web Audio API not supported in this environment");
      }
      this.context = new AudioContextClass({ latencyHint: 'interactive' });

      // Create Nodes
      this.masterGain = this.context.createGain();
      this.compressor = this.context.createDynamicsCompressor();
      this.analyser = this.context.createAnalyser();
      
      // Configuration
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.85;
      
      this.rebuildGraph();
      this.applyChain(this.currentChain);

      this.isInitialized = true;
      this.emit('initialized');
      console.log('🔊 [DSP] Audio Engine Initialized');
    } catch (e) {
      console.error('DSP Initialization failed', e);
      this.emit('error', e);
      throw e; // Rethrow to let caller handle it
    }
  }

  private rebuildGraph() {
    if (!this.context || !this.masterGain || !this.compressor || !this.analyser) return;

    // Disconnect everything (simplified)
    try {
      this.masterGain.disconnect();
      this.compressor.disconnect();
      this.eqNodes.forEach(node => node.disconnect());
      this.analyser.disconnect();
    } catch (e) {
      // Ignore disconnection errors during init
    }

    // Create EQ nodes
    this.eqNodes = this.currentChain.equalizer.bands.map(band => {
      const filter = this.context!.createBiquadFilter();
      filter.type = band.type;
      filter.frequency.value = band.frequency;
      filter.Q.value = band.q;
      filter.gain.value = band.gain;
      return filter;
    });

    // Connect Chain: [EQ] -> [Compressor] -> [MasterGain] -> [Analyser] -> Destination
    
    // Chain EQ nodes
    for (let i = 0; i < this.eqNodes.length - 1; i++) {
      this.eqNodes[i].connect(this.eqNodes[i + 1]);
    }

    // Connect last EQ to Compressor
    const lastEq = this.eqNodes.length > 0 ? this.eqNodes[this.eqNodes.length - 1] : null;
    
    if (lastEq) {
        lastEq.connect(this.compressor);
    }

    // Connect Compressor to Master
    this.compressor.connect(this.masterGain);

    // Connect Master to Analyser
    this.masterGain.connect(this.analyser);

    // Connect Analyser to Destination (Speakers)
    this.analyser.connect(this.context.destination);
  }

  public applyChain(chain: ProcessingChain) {
    if (!chain.equalizer || !chain.compressor) {
      throw new Error("Invalid DSP Chain structure provided.");
    }

    this.currentChain = chain;
    if (!this.context) return; // Can apply state without context, but no audio effect

    try {
      // Apply EQ
      if (chain.equalizer.enabled) {
        this.eqNodes.forEach((node, i) => {
          const band = chain.equalizer.bands[i];
          if (band && node) {
              node.gain.setTargetAtTime(band.gain, this.context!.currentTime, 0.1);
          }
        });
      } else {
          // Flat EQ if disabled
          this.eqNodes.forEach(node => {
              node.gain.setTargetAtTime(0, this.context!.currentTime, 0.1);
          });
      }

      // Apply Compressor
      if (this.compressor) {
          if (chain.compressor.enabled) {
              this.compressor.threshold.value = chain.compressor.threshold;
              this.compressor.ratio.value = chain.compressor.ratio;
              this.compressor.attack.value = chain.compressor.attack;
              this.compressor.release.value = chain.compressor.release;
          } else {
              // "Disable" compressor effectively
              this.compressor.threshold.value = 0; 
              this.compressor.ratio.value = 1;
          }
      }

      // Apply Volume
      if (this.masterGain) {
          this.masterGain.gain.setTargetAtTime(chain.masterVolume, this.context!.currentTime, 0.1);
      }

      this.emit('chain-updated', this.currentChain);
    } catch (e: any) {
      throw new Error(`Failed to apply DSP parameters: ${e.message}`);
    }
  }

  public getChain(): ProcessingChain {
      return JSON.parse(JSON.stringify(this.currentChain));
  }

  public getPresets(): string[] {
    return Array.from(this.presets.keys());
  }

  public loadPreset(name: string): ProcessingChain {
    const preset = this.presets.get(name);
    if (!preset) throw new Error(`Preset "${name}" not found.`);
    return JSON.parse(JSON.stringify(preset));
  }

  public savePreset(name: string, chain: ProcessingChain) {
    if (!name || name.trim() === '') throw new Error("Preset name cannot be empty.");
    this.presets.set(name, JSON.parse(JSON.stringify(chain)));
  }

  public getAnalyserData(dataArray: Uint8Array) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(dataArray);
    }
  }

  public async resume() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  public getContext() {
    return this.context;
  }

  // Returns the first node in the chain for sources to connect to
  public getInputDestination(): AudioNode | null {
    return this.eqNodes.length > 0 ? this.eqNodes[0] : (this.compressor || this.masterGain);
  }
}
