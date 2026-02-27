import { useEffect } from 'react';
import { fetchAllEState } from '@redux/feature/estate/estateThunk';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { useAppDispatch, useAppSelector } from './redux';

export const useEstateHook = () => {
    const dispatch = useAppDispatch();
    const { estate, status } = useAppSelector((state) => state.estate);

    const fetchEstateData = async () => {
        try {
            await dispatch(fetchAllEState({ status: true })).unwrap()
        }
        catch (error) {
            message.error(error || 'Failed to fetch estate data')
        }
    }
    useEffect(() => {
        if (status.estate.fetch === Status.IDLE) {
            fetchEstateData()
        }
    }, [dispatch, status.estate.fetch]);

    const estateOptions = estate && estate?.length > 0 && estate?.map((item) => ({
        label: item.name,
        value: item.estateId
    }))
    return {
        estateOptions: estateOptions || []
    };
};