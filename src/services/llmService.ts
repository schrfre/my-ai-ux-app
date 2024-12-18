interface LLMRequestParams {
  topic: string;
  difficulty: string;
  targetAudience: string;
  stylePreferences: {
    formal: boolean;
    technical: boolean;
    examples: boolean;
    detailed: boolean;
  };
  language: string;
  automationLevel: number;
  signal?: AbortSignal;
}

export const generateContent = async (params: LLMRequestParams): Promise<string> => {
  const prompt = createPrompt(params);
  
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3:latest",
        prompt: prompt,
        stream: false
      }),
      signal: params.signal
    });

    const data = await response.json();
    return data.response;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error('ABORTED');
    }
    console.error('LLM Error:', error);
    throw new Error('Fehler bei der Generierung des Inhalts');
  }
};

const createPrompt = (params: LLMRequestParams): string => {
  const {
    topic,
    difficulty,
    targetAudience,
    stylePreferences,
    language,
    automationLevel
  } = params;

  const formalityLevel = stylePreferences.formal ? "formal" : "informal";
  const technicalLevel = stylePreferences.technical ? "technisch detailliert" : "allgemein verständlich";
  const detailLevel = stylePreferences.detailed ? "ausführlich" : "prägnant";
  
  let automationPrompt = "";
  if (automationLevel <= 25) {
    automationPrompt = `
      Erstelle eine grobe Gliederung für einen Lernplan zum Thema "${topic}".
      Gib nur die Hauptpunkte an, die der Nutzer selbst ausarbeiten kann.
      Füge Vorschläge für Ressourcen und Lernmaterialien hinzu.
    `;
  } else if (automationLevel <= 75) {
    automationPrompt = `
      Erstelle einen teilweise ausgearbeiteten Lernplan zum Thema "${topic}".
      Gib die Hauptpunkte mit kurzen Erklärungen an.
      Markiere Stellen, die der Nutzer noch selbst ausarbeiten oder anpassen sollte.
      Füge konkrete Ressourcen, Übungen und Lernmaterialien hinzu.
    `;
  } else {
    automationPrompt = `
      Erstelle einen vollständig ausgearbeiteten Lernplan zum Thema "${topic}".
      Gib detaillierte Erklärungen zu jedem Lernschritt.
      Füge konkrete Übungen, Beispiele und Praxisaufgaben hinzu.
      Stelle einen kompletten Zeitplan mit Meilensteinen zur Verfügung.
    `;
  }
  
  return `
    ${automationPrompt}
    
    Berücksichtige dabei:
    - Schwierigkeitsgrad: ${difficulty}
    - Zielgruppe: ${targetAudience}
    - Stil: ${technicalLevel} und ${formalityLevel}
    - Detailgrad: ${detailLevel}
    ${stylePreferences.examples ? '- Füge praktische Codebeispiele ein' : ''}
    
    Strukturiere den Lernplan in folgende Abschnitte:
    1. Überblick und Lernziele
    2. Voraussetzungen
    3. Lernschritte/Curriculum
    4. Ressourcen und Materialien
    5. Übungen und Praxisaufgaben
    6. Erfolgskontrolle
    
    Sprache: ${language}
  `.trim();
}; 