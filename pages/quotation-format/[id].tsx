import React from 'react';
import { useRouter } from 'next/router';
import QuotationFormatForm from '@/components/configurations/components/quotationFormat/QuotationFormatForm';

const QuotationFormatById: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return <QuotationFormatForm id={id} />;
};

export default QuotationFormatById;
