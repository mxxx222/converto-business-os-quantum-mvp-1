"use client";

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export default function AIVoiceCommands() {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Voice commands
  const commands: VoiceCommand[] = [
    {
      command: 'näytä dashboard',
      action: () => (window.location.href = '/dashboard'),
      description: 'Siirry dashboardiin',
    },
    {
      command: 'skannaa kuitti',
      action: () => (window.location.href = '/selko/ocr'),
      description: 'Avaa kuittiskanneri',
    },
    {
      command: 'näytä raportit',
      action: () => (window.location.href = '/reports'),
      description: 'Avaa raportit',
    },
    {
      command: 'laskutus',
      action: () => (window.location.href = '/billing'),
      description: 'Avaa laskutus',
    },
    {
      command: 'asetukset',
      action: () => (window.location.href = '/settings'),
      description: 'Avaa asetukset',
    },
  ];

  useEffect(() => {
    // Check if Speech Recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fi-FI';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setTranscript(transcript);

        // Find matching command
        const matchedCommand = commands.find((cmd) =>
          transcript.includes(cmd.command.toLowerCase())
        );

        if (matchedCommand) {
          matchedCommand.action();
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          Äänikomennot eivät ole tuettuja tässä selaimessa.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-semibold text-blue-900 mb-3">🎤 Äänikomennot</h3>

      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isListening
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isListening ? 'Lopeta' : 'Aloita'} kuuntelu
          </span>
        </button>

        <button
          onClick={toggleMute}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isMuted
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isMuted ? 'Ääni pois' : 'Ääni päällä'}
          </span>
        </button>
      </div>

      {transcript && (
        <div className="mb-4 p-3 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Kuultu:</p>
          <p className="font-medium text-gray-900">{transcript}</p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-blue-700 font-medium">Käytettävissä olevat komennot:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {commands.map((cmd, index) => (
            <div key={index} className="text-sm text-blue-600">
              <span className="font-medium">"{cmd.command}"</span> - {cmd.description}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
