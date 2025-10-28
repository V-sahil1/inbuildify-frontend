import { useAppDispatch, useAppSelector } from '@hooks/redux';
import CustomSelect from './CustomSelect';
import { mapToOptions } from '@lib/utils/rangeAndDwellingObjToOptions';
import { useEffect } from 'react';
import { Status } from '@lib/constants/enum';
import { getDwellingTypes} from '@redux/feature/types/typesThunk';
import { message } from 'antd';

interface DwellingTypeSelectProps {
    value?: string;
    onChange?: (value: string) => void;
    width?: number | string;
}

const DwellingTypeSelect: React.FC<DwellingTypeSelectProps> = ({
    value,
    onChange,
    width
}) => {
    const { dwellingType } = useAppSelector((state) => state.types);
    const typesStatus = useAppSelector((state) => state.types.status);
    const dwellingOptions = mapToOptions(dwellingType);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const fetchTypesData = async () => {
            try {
                if (typesStatus?.dwellingType === Status.IDLE) {
                    await dispatch(getDwellingTypes()).unwrap();
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
            options={dwellingOptions}
            placeholder="Dwelling Type"
            width={width}
        />
    );
};

export default DwellingTypeSelect;