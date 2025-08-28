import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { getFacades } from '@redux/feature/facade/facadeThunk';
import { Button, Modal, Typography } from 'antd'
import { useEffect } from 'react';

const { Title } = Typography;
const FacadeModal = ({ visible, onCancel, onSave, selectedFacade }) => {
    const dispatch = useAppDispatch();
    const handleCancel = () => { onCancel() };
    const { facades, status } = useAppSelector((state) => state.facade);

    useEffect(() => {
        if (status === Status.IDLE) {
            try {
                dispatch(getFacades()).unwrap();
            } catch (error) {
                console.log(error);
            }
        }
    }, [dispatch, status]);

    return (
        <Modal
            title={
                <div className="bg-blue-500 text-white">
                    <Title level={3} className="text-white mb-0">
                        Facade
                    </Title>
                </div>
            }
            centered
            open={visible}
            onCancel={handleCancel}
            width={1000}
            footer={[
                <Button key="save" type="primary">
                    Save
                </Button>,
            ]}
            className="floor-plan-modal"
        >
            {/* tabs here */}
        </Modal>
    )
}

export default FacadeModal