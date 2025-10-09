
const CustomAvtar = ({ label }: { label: string }) => {
    return (
        <div className="rounded-full w-6 h-6 flex justify-center items-center bg-gray-300 text-gray-500">
            {label[0].toUpperCase()}
        </div>
    )
}

export default CustomAvtar;