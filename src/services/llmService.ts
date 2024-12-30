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
    let accumulatedContent = '';

    const prompt = `Erstelle einen strukturierten Lernplan für das Thema "${params.topic}".

WICHTIG: Beginne direkt mit dem Lernplan, ohne die Einstellungen zu wiederholen.

[Interne Einstellungen - nicht in Ausgabe aufnehmen]
- Format: ${params.settings?.format || 'structured'}
- Stil: ${params.settings?.style || 'detailed'}
- Komplexität: ${params.settings?.depth || 'intermediate'}
- Sprache: ${params.settings?.language || 'de'}
- Übungsaufgaben: ${params.settings?.includeExercises || 'few'}
- Wiederholungsintervall: ${params.settings?.repetitionInterval || 'weekly'}
- Automatisierungsgrad: ${params.settings?.automation || 'medium'}
[Ende der Einstellungen]

Formatiere den Lernplan wie folgt:

# 📚 ${params.topic}

## 🎯 Lernziele
- [Hauptlernziele in Stichpunkten]

## 📋 Überblick
[Kurze Einführung und Motivation]

## 📖 Kapitelübersicht

### 📑 Kapitel 1: Grundlagen und Einführung
**Lernzeit**: 2-3 Stunden
**Schwierigkeitsgrad**: Einfach

#### Inhalt:
- **Kernkonzepte:**
  - [Liste der wichtigsten Konzepte]
  - [Grundlegende Definitionen]
  
- **Praktische Anwendung:**
  - [Übungsaufgaben]
  - [Praktische Beispiele]

${params.settings?.includeExercises !== 'none' ? `- **Übungsaufgaben:**
  - [Konkrete Aufgaben mit Lösungen]
  - [Selbsttest-Fragen]` : ''}

${params.settings?.repetitionInterval !== 'none' ? `- **Wiederholungsempfehlungen:**
  - [Zeitpunkt für Wiederholung]
  - [Kernpunkte zur Wiederholung]` : ''}

#### Lernziele des Kapitels:
- [Spezifische Ziele]
- [Erwartete Fähigkeiten nach Abschluss]

### 📑 Kapitel 2: [Spezifischer Titel]
**Lernzeit**: 3-4 Stunden
**Schwierigkeitsgrad**: Mittel

### 📑 Kapitel 3: [Spezifischer Titel]
**Lernzeit**: 4-5 Stunden
**Schwierigkeitsgrad**: Fortgeschritten

## ⏱️ Zeitplan und Fortschritt
- Gesamtdauer: [X] Stunden
- Empfohlene Aufteilung:
  - Kapitel 1: [Zeit] + [Übungszeit]
  - Kapitel 2: [Zeit] + [Übungszeit]
  - Kapitel 3: [Zeit] + [Übungszeit]

## 📈 Erfolgsmessung
- Abschlusskriterien pro Kapitel
- Selbsteinschätzung durch:
  - [Spezifische Methoden]
  - [Überprüfungspunkte]

${params.settings?.automation === 'high' ? 'Erstelle einen vollständig ausgearbeiteten Plan mit detaillierten Erklärungen.' : 
  params.settings?.automation === 'medium' ? 'Erstelle einen ausgewogenen Plan mit den wichtigsten Details und Raum für eigene Notizen.' :
  'Erstelle ein Grundgerüst mit den wichtigsten Punkten.'}

${params.settings?.language === 'simple' ? 'Verwende einfache und klare Sprache.' : 
  params.settings?.language === 'en' ? 'Write the learning plan in English.' :
  'Verwende normales Deutsch.'}

Wichtig: 
- Jedes Kapitel sollte einen eindeutigen, beschreibenden Titel haben
- Klare Lernziele pro Kapitel definieren
- Realistische Zeitangaben machen
- Fortschrittsmessung ermöglichen
- Praktische Anwendungen einbauen

Beginne direkt mit dem formatierten Lernplan.`;

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

    let decoder = new TextDecoder();
    let buffer = '';
    let currentWord = '';
    let lastChar = '';

    const processBuffer = () => {
      let updatedContent = false;
      
      for (let i = 0; i < buffer.length; i++) {
        const char = buffer[i];
        
        // Wortende erkennen (Leerzeichen, Zeilenumbruch oder Satzzeichen)
        if (char === ' ' || char === '\n' || /[.,!?:]/.test(char)) {
          if (currentWord) {
            // Füge das Wort und das Trennzeichen zum Gesamtinhalt hinzu
            accumulatedContent += currentWord + char;
            if (params.onProgress) {
              params.onProgress(accumulatedContent);
            }
            currentWord = '';
            updatedContent = true;
          } else if (char === '\n' && lastChar === '\n') {
            // Behandle Absätze
            accumulatedContent += char;
            if (params.onProgress) {
              params.onProgress(accumulatedContent);
            }
            updatedContent = true;
          }
        } else {
          currentWord += char;
        }
        
        lastChar = char;
      }
      
      // Buffer zurücksetzen, aber unvollständiges Wort behalten
      buffer = currentWord;
      currentWord = '';
      
      return updatedContent;
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      try {
        const jsonChunk = JSON.parse(chunk);
        if (jsonChunk.response) {
          buffer += jsonChunk.response;
          
          // Verarbeite den Buffer sofort für flüssigeres Streaming
          processBuffer();
        }
      } catch (e) {
        console.error('Fehler beim Parsen des Chunks:', e);
      }
    }

    // Verarbeite den restlichen Buffer
    if (buffer) {
      accumulatedContent += buffer;
      if (params.onProgress) {
        params.onProgress(accumulatedContent);
      }
    }

    // Bereinige das finale Ergebnis
    const cleanedContent = accumulatedContent
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const confidenceScore = calculateConfidenceScore(cleanedContent);

    return {
      content: cleanedContent,
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

const calculateConfidenceScore = (content: string): number => {
  // Basis-Score
  let score = 70;

  // Überprüfe Struktur und Vollständigkeit
  if (content.includes('## 🎯 Lernziele')) score += 5;
  if (content.includes('## 📋 Überblick')) score += 5;
  if (content.includes('## 📖 Kapitelübersicht')) score += 5;
  if (content.includes('## ⏱️ Zeitplan')) score += 5;
  if (content.includes('## 📈 Erfolgsmessung')) score += 5;

  // Überprüfe Detailtiefe
  const wordCount = content.split(/\s+/).length;
  if (wordCount > 500) score += 5;
  if (wordCount > 1000) score += 5;

  // Maximaler Score ist 95
  return Math.min(score, 95);
}; 