// components/PdfPreviewer.tsx
'use client';

import { pdf, DocumentProps } from '@react-pdf/renderer';
import { ReactElement } from 'react';

type PdfPreviewerProps = {
  document: ReactElement<DocumentProps>;
  label?: string;
};

export default function PdfPreviewer({
  document: PdfDocument,
  label = 'Preview PDF',
}: PdfPreviewerProps) {
  const handlePreview = async () => {
    try {
      // Generate PDF blob
      const blob = await pdf(PdfDocument).toBlob();

      // Create object URL
      const url = URL.createObjectURL(blob);

      // Open in new tab
      window.open(url, '_blank');

      // Optional: revoke later to free memory
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <button
      onClick={handlePreview}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      {label}
    </button>
  );
}
