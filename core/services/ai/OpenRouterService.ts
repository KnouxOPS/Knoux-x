import EventEmitter from 'events';

export const AVAILABLE_MODELS = [
  { id: 'meta-llama/llama-3.2-11b-vision-instruct:free', name: 'Llama 3.2 11B Vision', description: 'Meta model with vision support' },
  { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B', description: 'Google open model' },
  { id: 'microsoft/phi-3.5-mini-instruct:free', name: 'Phi 3.5 Mini', description: 'Microsoft compact model' },
];

export class OpenRouterService extends EventEmitter {
  private apiKey: string | null = null;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private currentModel = AVAILABLE_MODELS[0].id;
  private context = { messages: [] as any[] };

  async initialize() {
    this.apiKey = await window.knouxAPI.settings.get('openRouterApiKey', '');
    const savedModel = await window.knouxAPI.settings.get('aiModel', '');
    if (savedModel) this.currentModel = savedModel;
    console.log('OpenRouter Service Initialized');
  }

  async shutdown() {}

  async setApiKey(key: string) {
    this.apiKey = key;
    await window.knouxAPI.settings.set('openRouterApiKey', key);
  }

  async setModel(modelId: string) {
    this.currentModel = modelId;
    await window.knouxAPI.settings.set('aiModel', modelId);
  }

  hasApiKey() { return !!this.apiKey; }
  getCurrentModel() { return this.currentModel; }
  getStatus() { return { isOnline: !!this.apiKey, latency: 0, model: this.currentModel }; }
  clearContext() { this.context.messages = []; }

  async chat(message: string): Promise<string> {
    if (!this.apiKey) return "Please configure API Key in settings.";
    
    this.context.messages.push({ role: 'user', content: message });
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://knoux.dev',
          'X-Title': 'KNOUX Player X'
        },
        body: JSON.stringify({
          model: this.currentModel,
          messages: this.context.messages,
        })
      });
      
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "No response";
      this.context.messages.push({ role: 'assistant', content: reply });
      return reply;
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  }

  async *streamChat(message: string): AsyncGenerator<string> {
    if (!this.apiKey) { yield "Please configure API Key."; return; }
    
    // Simple mock streaming for now as real fetch streaming requires more setup
    const response = await this.chat(message);
    const chunks = response.split(' ');
    for (const chunk of chunks) {
        await new Promise(r => setTimeout(r, 50));
        yield chunk + ' ';
    }
  }
}

export const openRouterService = new OpenRouterService();