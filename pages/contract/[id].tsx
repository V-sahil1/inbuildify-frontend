import ContractFormat from '@/components/common/contract/ContractFormat';
import { useRouter } from 'next/router';

const ContractById = () => {
  const router = useRouter();
  const { id } = router.query;
  return <ContractFormat id={Array.isArray(id) ? id[0] : id} />;
};
export default ContractById;
