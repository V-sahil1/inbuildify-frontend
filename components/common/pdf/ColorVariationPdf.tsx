import { ColorVariation } from '@/components/pdf/ColorVariation';
import { Document } from '@react-pdf/renderer';

export const ColorVariationPdf = () => {
  return (
    <Document>
          <ColorVariation />
    </Document>
  );
};


