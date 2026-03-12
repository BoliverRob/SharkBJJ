import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const scannerId = 'barcode-scanner';
        scannerRef.current = new Html5Qrcode(scannerId);
        
        await scannerRef.current.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            // Sucesso no scan
            onScan(decodedText);
            stopScanner();
            onClose();
          },
          (errorMessage) => {
            // Erro no scan (pode ignorar, é normal durante scanning)
            console.log('Scan error:', errorMessage);
          }
        );
        
        setIsScanning(true);
      } catch (err) {
        console.error('Scanner error:', err);
        setError('Erro ao iniciar câmera. Verifique as permissões.');
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <Camera className="w-6 h-6 text-white" />
          <span className="text-white font-semibold">Escanear Código</span>
        </div>
        <button
          onClick={() => {
            stopScanner();
            onClose();
          }}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Scanner */}
      <div className="flex-1 relative flex items-center justify-center">
        {error ? (
          <div className="text-center p-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <div id="barcode-scanner" className="w-full h-full"></div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 bg-gray-900 text-center">
        <p className="text-gray-400 text-sm">
          Posicione o código de barras dentro da área de scan
        </p>
      </div>
    </div>
  );
};

export default BarcodeScanner;
