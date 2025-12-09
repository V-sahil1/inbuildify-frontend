'use client';
import { InvoiceReceipt } from '@/components/pdf/InvoiceReceipt';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const InvoiceReceiptPdf = ({}) => {
  return (
    <Document>
        <InvoiceReceipt />
    </Document>
  );
};

export default InvoiceReceiptPdf;

