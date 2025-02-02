# LLM-Lernplaner-Generator -- My AI UX App

## Übersicht
**My AI UX App** ist eine Anwendung zur Evaluierung und Gestaltung von UX-Frameworks für generative KI-Systeme. Sie dient als Forschungsprojekt zur Analyse und Optimierung der Nutzererfahrung im Kontext von Human-Centered AI (HCAI) und E-Learning.

## Funktionen
- **Benutzerfreundliches UI/UX**: Intuitive Benutzeroberfläche zur einfachen Interaktion mit KI-Modellen.
- **Generative KI-Integration**: Nutzung von LLMs zur Textgenerierung und Interaktion.
- **Evaluierungstools**: Methoden zur Messung der UX-Qualität und Nutzerzufriedenheit.
- **Personalisierte Empfehlungen**: Adaptive KI-Modelle für personalisierte Vorschläge.
- **Datenanalyse & Visualisierung**: Werkzeuge zur Interpretation und Optimierung von UX-Daten.

## Installation
### Voraussetzungen
- Node.js (empfohlen: v18+)
- npm oder yarn
- Python (optional für bestimmte Analysen)
- OpenAI API Key oder kompatibles LLM

### Setup
1. Repository klonen:
   ```sh
   git clone https://github.com/schrfre/my-ai-ux-app.git
   cd my-ai-ux-app
   ```
2. Abhängigkeiten installieren:
   ```sh
   npm install
   ```
3. Anwendung starten:
   ```sh
   npm run dev
   ```
4. LLM-Backend starten:
   - Im Hintergrund wird ein LLM verwendet um den Lernplan zu erstellen. Für die Erstellung wird Ollama verwendet. Ollama muss installiert sein und das LLM muss aufgesetzt werden. Anschließend muss in der Datei `src/services/llmService.ts` die URL des LLM angepasst werden. Empfohlen wird die Verwendung von dem Modell `llama3:latest` empfohlen.
- https://ollama.com/ -- https://github.com/ollama/ollama
- https://www.llama.com/

   - Falls OpenAI API genutzt wird, setze die Umgebungsvariable:
     ```sh
     export OPENAI_API_KEY='your-api-key'
     ```
   - Falls ein lokales LLM mit Ollama genutzt wird, stelle sicher, dass der entsprechende Server läuft und die API unter der richtigen Adresse erreichbar ist.

## Nutzung
1. Öffne die Anwendung im Browser unter `http://localhost:3000`
2. Erkunde die verschiedenen Funktionen und sammle UX-Daten
3. Analysiere die Ergebnisse zur Optimierung der Nutzererfahrung

## Mitwirken
Pull Requests sind willkommen! Bitte erstelle ein Issue für größere Änderungen.

## Lizenz
MIT License – siehe `LICENSE` für weitere Details.

## Zitieren der Arbeit

```
@online{github_repo,
  author = {Schröder, Frederik},
  title = {my-ai-ux-app},
  year = {2025},
  url = {https://github.com/schrfre/my-ai-ux-app},
  urldate = {aktuelles Datum eintragen}
}
```
