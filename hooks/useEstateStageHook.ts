import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useAppDispatch } from './redux';
import { EstateStage } from '@redux/feature/estate/IEstateState';
import { fetchAllEStateStage } from '@redux/feature/estate/estateThunk';

export const useEstateStage = (estateId: string | undefined) => {
    const dispatch = useAppDispatch();
    const [stage, setStage] = useState<EstateStage[]>([]);

    const fetchEstateData = async () => {
        try {
            const res = await dispatch(fetchAllEStateStage(estateId)).unwrap()
            setStage(res.estateStage)
        }
        catch (error) {
            message.error(error || 'Failed to fetch estate data')
        }
    }
    useEffect(() => {
        if (estateId) {
            fetchEstateData()
        }
    }, [estateId]);

    const estateStageOptions = stage.map((item) => ({
        label: item.name,
        value: item.estateStageId
    }))

    return {
        estateStageOptions
    };
};