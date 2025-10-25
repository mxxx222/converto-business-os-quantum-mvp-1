"use client";

import React, { useRef, useEffect, useState } from 'react';

interface OCRCanvasViewerProps {
  imageUrl?: string;
  onTextExtracted?: (text: string) => void;
}

export default function OCRCanvasViewer({ imageUrl, onTextExtracted }: OCRCanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Simulate OCR text extraction
          const mockText = "OCR text extraction would happen here";
          setExtractedText(mockText);
          onTextExtracted?.(mockText);
        };
        img.src = imageUrl;
      }
    }
  }, [imageUrl, onTextExtracted]);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <h3 className="font-semibold text-gray-900 mb-4">OCR Canvas Viewer</h3>

      <div className="space-y-4">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 rounded-lg max-w-full h-auto"
        />

        {extractedText && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Extracted Text:</h4>
            <p className="text-sm text-gray-600">{extractedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
