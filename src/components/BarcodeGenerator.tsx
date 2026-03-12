import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeGeneratorProps {
  value: string;
  format?: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  className?: string;
}

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  value,
  format = 'CODE128',
  width = 2,
  height = 100,
  displayValue = true,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format,
          width,
          height,
          displayValue,
          fontSize: 14,
          font: 'monospace',
          margin: 10,
          background: '#ffffff',
          lineColor: '#000000'
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [value, format, width, height, displayValue]);

  return (
    <div className={`barcode-container ${className}`}>
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
};

export default BarcodeGenerator;
