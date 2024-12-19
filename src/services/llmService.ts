export interface LLMRequestParams {
  topic: string;
  settings?: {
    format?: string;
    style?: string;
    depth?: string;
    automation?: string;
    language?: string;
    includeExercises?: string;
    repetitionInterval?: string;
  };
  onProgress?: (content: string) => void;
}

export interface GenerateResponse {
  content: string;
  confidenceScore: number;
}

let abortController: AbortController | null = null;

export const generateContent = async (params: LLMRequestParams): Promise<GenerateResponse> => {
  try {
    abortController = new AbortController();

    const prompt = `Erstelle einen strukturierten Lernplan für das Thema "${params.topic}".
    
Format: ${params.settings?.format || 'structured'}
Stil: ${params.settings?.style || 'detailed'}
Komplexität: ${params.settings?.depth || 'intermediate'}
Sprache: ${params.settings?.language || 'de'}
Übungsaufgaben: ${params.settings?.includeExercises || 'few'}
Wiederholungsintervall: ${params.settings?.repetitionInterval || 'weekly'}
Automatisierungsgrad: ${params.settings?.automation || 'medium'}

Der Lernplan sollte:
- Eine klare Kapitelstruktur haben
- Lernziele definieren
- Wichtige Konzepte erklären
${params.settings?.includeExercises !== 'none' ? '- Praktische Übungen enthalten' : ''}
- Fortschrittsmessung ermöglichen
${params.settings?.repetitionInterval !== 'none' ? '- Wiederholungseinheiten einplanen' : ''}

${params.settings?.automation === 'high' ? 'Erstelle einen vollständig ausgearbeiteten Plan.' : 
  params.settings?.automation === 'medium' ? 'Erstelle einen ausgewogenen Plan mit Raum für Anpassungen.' :
  'Erstelle einen Grundgerüst-Plan mit viel Raum für manuelle Anpassungen.'}

${params.settings?.language === 'simple' ? 'Verwende einfache und klare Sprache.' : 
  params.settings?.language === 'en' ? 'Write the learning plan in English.' :
  'Verwende normales Deutsch.'}

Bitte strukturiere den Plan in Markdown-Format mit Kapiteln und Unterpunkten.`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3:latest",
        prompt: prompt,
        stream: true
      }),
      signal: abortController.signal
    });

    if (!response.ok) {
      throw new Error('Fehler bei der Verbindung zum Sprachmodell');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Stream konnte nicht gelesen werden');

    let fullContent = '';
    let decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      try {
        const jsonChunk = JSON.parse(chunk);
        if (jsonChunk.response) {
          fullContent += jsonChunk.response;
          if (params.onProgress) {
            params.onProgress(fullContent);
          }
        }
      } catch (e) {
        console.error('Fehler beim Parsen des Chunks:', e);
      }
    }

    const confidenceScore = Math.min(
      Math.floor((fullContent.length / 1000) * 100), 
      95
    );

    return {
      content: fullContent,
      confidenceScore: confidenceScore
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Generierung wurde abgebrochen');
    }
    console.error('Fehler bei der Content-Generierung:', error);
    throw new Error('Fehler bei der Content-Generierung');
  } finally {
    abortController = null;
  }
};

export const stopGeneration = () => {
  if (abortController) {
    abortController.abort();
  }
}; 