'use client';
import { useCallback, ReactElement } from 'react';
import { pdf, DocumentProps } from '@react-pdf/renderer';

export const usePdf = <T>(PdfComponent: (props: T) => ReactElement<DocumentProps>) => {
  const previewPdf = useCallback(
    async (props: T) => {
      const blob = await pdf(PdfComponent(props)).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    [PdfComponent]
  );

  return { previewPdf };
};
