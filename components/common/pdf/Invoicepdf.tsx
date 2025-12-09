'use client';
import { Invoice } from '@/components/pdf/Invoice';
import { Document } from '@react-pdf/renderer';

const InvoicePdf = ({}) => {
 
  return (
    <Document>
        <Invoice />
    </Document>
  );
};

export default InvoicePdf;

