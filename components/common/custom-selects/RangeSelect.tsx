import { useAppDispatch, useAppSelector } from '@hooks/redux';
import CustomSelect from './CustomSelect';
import { mapToOptions } from '@lib/utils/rangeAndDwellingObjToOptions';
import { useEffect } from 'react';
import { Status } from '@lib/constants/enum';
import { getRanges } from '@redux/feature/types/typesThunk';
import { message } from 'antd';

interface RangeSelectProps {
    value?: string;
    onChange?: (value: string) => void; 
    width?: number | string;
}

const RangeSelect: React.FC<RangeSelectProps> = ({
    value,
    onChange,
    width
}) => {
    const { range } = useAppSelector((state) => state.types);
    const typesStatus = useAppSelector((state) => state.types.status);
    const rangeOptions = mapToOptions(range);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const fetchTypesData = async () => {
            try {
                if (typesStatus?.range === Status.IDLE) {
                    await dispatch(getRanges()).unwrap();
                }
            } catch (error) {
                message.error(error);
            }
        };
        fetchTypesData();
    }, [dispatch]);
    return (
        <CustomSelect
            value={value}
            onChange={onChange}
            options={rangeOptions}
            placeholder="Range"
            width={width}
        />
    );
};

export default RangeSelect;