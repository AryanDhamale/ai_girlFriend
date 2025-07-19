declare global {

  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((this: SpeechRecognition, event: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, event: SpeechRecognitionErrorEvent) => any) | null;
    // Add more handlers as needed
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

}

export { };