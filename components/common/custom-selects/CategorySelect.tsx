import CustomSelect from './CustomSelect';

const CategoryOptions = [
    { value: 'Job', label: 'Job' },
    { value: 'General', label: 'General' },
];

interface CategorySelectProps {
    value?: string;
    onChange?: (value: string) => void;
    width?: number | string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
    value,
    onChange,
    width
}) => {
    return (
        <CustomSelect
            value={value}
            onChange={onChange}
            options={CategoryOptions}
            placeholder="Category"
            width={width}
        />
    );
};

export default CategorySelect;