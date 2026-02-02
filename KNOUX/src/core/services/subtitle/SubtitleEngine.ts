/**
 * ═══════════════════════════════════════════════════════════════════════
 * KNOUX Player X™ - Subtitle Engine
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * محرك الترجمة - يد manage عرض ومزامنة الترجمة
 * 
 * @module Services/Subtitle
 * @author KNOUX Development Team
 * @version 1.0.0
 */

// Simple EventEmitter polyfill for browser/renderer
class EventEmitter {
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

// ═══════════════════════════════════════════════════════════════════════════
// أنواع البيانات
// ═══════════════════════════════════════════════════════════════════════════

export interface SubtitleSettings {
  enabled: boolean;
  track: number;
  delay: number;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  position: 'top' | 'bottom' | 'center';
  fontFamily: string;
  outline: boolean;
  outlineColor: string;
  bold: boolean;
  italic: boolean;
}

export interface SubtitleCue {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  styles?: SubtitleStyles;
}

export interface SubtitleStyles {
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  alignment?: 'left' | 'center' | 'right';
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  type: 'internal' | 'external';
  src?: string;
  enabled: boolean;
}

export interface SearchResult {
  id: string;
  language: string;
  name: string;
  rating: number;
  downloads: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// فئة محرك الترجمة
// ═══════════════════════════════════════════════════════════════════════════

export class SubtitleEngine extends EventEmitter {
  private settings: SubtitleSettings;
  private cues: SubtitleCue[] = [];
  private tracks: SubtitleTrack[] = [];
  private currentCue: SubtitleCue | null = null;
  private currentTime = 0;
  private isInitialized = false;
  private containerElement: HTMLElement | null = null;

  constructor() {
    super();
    this.settings = {
      enabled: true,
      track: 0,
      delay: 0,
      fontSize: 24,
      fontColor: '#ffffff',
      backgroundColor: 'transparent',
      position: 'bottom',
      fontFamily: 'Arial, sans-serif',
      outline: true,
      outlineColor: '#000000',
      bold: false,
      italic: false,
    };
  }

  // ═════════════════════════════════════════════════════════════════════════
  // التهيئة والإغلاق
  // ═════════════════════════════════════════════════════════════════════════

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing Subtitle Engine...');
      this.isInitialized = true;
      console.log('Subtitle Engine initialized');
    } catch (error) {
      console.error('Failed to initialize Subtitle Engine:', error);
      throw error;
    }
  }

  public async shutdown(): Promise<void> {
    this.clearCues();
    this.isInitialized = false;
    console.log('Subtitle Engine shutdown');
  }

  // ═════════════════════════════════════════════════════════════════════════
  // إدارة الحاوية
  // ═════════════════════════════════════════════════════════════════════════

  public attachToContainer(element: HTMLElement): void {
    this.containerElement = element;
    this.updateSubtitleDisplay();
  }

  public detach(): void {
    this.containerElement = null;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // تحميل الترجمة
  // ═════════════════════════════════════════════════════════════════════════

  public async loadSubtitle(filePath: string): Promise<void> {
    try {
      const content = await window.knouxAPI.file.readFile(filePath);
      const text = content.toString();
      
      const ext = filePath.split('.').pop()?.toLowerCase();
      
      switch (ext) {
        case 'srt':
          this.cues = this.parseSRT(text);
          break;
        case 'vtt':
          this.cues = this.parseVTT(text);
          break;
        case 'ass':
        case 'ssa':
          this.cues = this.parseASS(text);
          break;
        default:
          throw new Error(`Unsupported subtitle format: ${ext}`);
      }

      this.emit('loaded', this.cues.length);
      this.updateSubtitleDisplay();
    } catch (error) {
      console.error('Failed to load subtitle:', error);
      throw error;
    }
  }

  public async loadSubtitleFromText(text: string, format: 'srt' | 'vtt' | 'ass'): Promise<void> {
    switch (format) {
      case 'srt':
        this.cues = this.parseSRT(text);
        break;
      case 'vtt':
        this.cues = this.parseVTT(text);
        break;
      case 'ass':
        this.cues = this.parseASS(text);
        break;
    }

    this.emit('loaded', this.cues.length);
    this.updateSubtitleDisplay();
  }

  // ═════════════════════════════════════════════════════════════════════════
  // تحليل الترجمة
  // ═════════════════════════════════════════════════════════════════════════

  private parseSRT(content: string): SubtitleCue[] {
    const cues: SubtitleCue[] = [];
    const blocks = content.trim().split(/\n\s*\n/);

    for (const block of blocks) {
      const lines = block.trim().split('\n');
      if (lines.length < 3) continue;

      const timeLine = lines[1];
      const timeMatch = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
      
      if (!timeMatch) continue;

      const startTime = this.timeToSeconds(timeMatch[1].replace(',', '.'));
      const endTime = this.timeToSeconds(timeMatch[2].replace(',', '.'));
      const text = lines.slice(2).join('\n').replace(/<[^>]+>/g, '');

      cues.push({
        id: lines[0],
        startTime,
        endTime,
        text: text.trim(),
      });
    }

    return cues;
  }

  private parseVTT(content: string): SubtitleCue[] {
    const cues: SubtitleCue[] = [];
    const lines = content.trim().split('\n');
    
    // Skip WEBVTT header
    let i = content.startsWith('WEBVTT') ? 1 : 0;
    
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (line.includes('-->')) {
        const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);
        
        if (timeMatch) {
          const startTime = this.timeToSeconds(timeMatch[1]);
          const endTime = this.timeToSeconds(timeMatch[2]);
          
          // Collect text lines
          const textLines: string[] = [];
          i++;
          
          while (i < lines.length && lines[i].trim() !== '') {
            textLines.push(lines[i].trim().replace(/<[^>]+>/g, ''));
            i++;
          }

          cues.push({
            id: String(cues.length + 1),
            startTime,
            endTime,
            text: textLines.join('\n'),
          });
        }
      }
      
      i++;
    }

    return cues;
  }

  private parseASS(content: string): SubtitleCue[] {
    // Simplified ASS parser
    const cues: SubtitleCue[] = [];
    const lines = content.split('\n');
    let inEvents = false;

    for (const line of lines) {
      if (line.trim() === '[Events]') {
        inEvents = true;
        continue;
      }

      if (inEvents && line.startsWith('Dialogue:')) {
        const parts = line.substring(9).split(',');
        if (parts.length >= 10) {
          const startTime = this.assTimeToSeconds(parts[1].trim());
          const endTime = this.assTimeToSeconds(parts[2].trim());
          const text = parts.slice(9).join(',').replace(/\{[^}]*\}/g, '').replace(/\\N/g, '\n');

          cues.push({
            id: String(cues.length + 1),
            startTime,
            endTime,
            text: text.trim(),
          });
        }
      }
    }

    return cues;
  }

  private timeToSeconds(time: string): number {
    const parts = time.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  }

  private assTimeToSeconds(time: string): number {
    const parts = time.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2].replace(',', '.'));
    return hours * 3600 + minutes * 60 + seconds;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // التحكم في الترجمة
  // ═════════════════════════════════════════════════════════════════════════

  public updateTime(currentTime: number): void {
    this.currentTime = currentTime + this.settings.delay / 1000;
    this.updateCurrentCue();
  }

  private updateCurrentCue(): void {
    const cue = this.cues.find(
      (c) => this.currentTime >= c.startTime && this.currentTime <= c.endTime
    );

    if (cue?.id !== this.currentCue?.id) {
      this.currentCue = cue || null;
      this.updateSubtitleDisplay();
      this.emit('cue-change', this.currentCue);
    }
  }

  private updateSubtitleDisplay(): void {
    if (!this.containerElement || !this.settings.enabled) {
      return;
    }

    this.containerElement.innerHTML = '';

    if (this.currentCue) {
      const subtitleElement = document.createElement('div');
      subtitleElement.className = 'knoux-subtitle';
      subtitleElement.textContent = this.currentCue.text;
      
      // Apply styles
      subtitleElement.style.cssText = this.buildSubtitleStyles();
      
      this.containerElement.appendChild(subtitleElement);
    }
  }

  private buildSubtitleStyles(): string {
    const { fontSize, fontColor, backgroundColor, position, fontFamily, outline, outlineColor, bold, italic } = this.settings;

    const positionStyles: Record<string, string> = {
      top: 'top: 10%;',
      bottom: 'bottom: 10%;',
      center: 'top: 50%; transform: translateY(-50%);',
    };

    let styles = `
      position: absolute;
      ${positionStyles[position]}
      left: 50%;
      transform: translateX(-50%);
      font-size: ${fontSize}px;
      color: ${fontColor};
      background-color: ${backgroundColor};
      font-family: ${fontFamily};
      text-align