import { DatePicker, Checkbox, message } from "antd"

const JobCustomFields = () => {
    return (
        <div className="flex gap-4 bg-white p-4 text-xs items-center">
            <div>
                <p className="mb-1">Drafting Requested</p>
                <DatePicker placeholder="dd-mm-yyyy" onChange={() => message.success("saved successfully")} />
            </div>
            <div>
                <p className="mb-1">Drafting Completed</p>
                <DatePicker placeholder="dd-mm-yyyy" onChange={() => message.success("saved successfully")} />
            </div>
            <div className="flex items-center gap-2">
                <Checkbox onClick={() => message.success("saved successfully")} />
                <p>Drawing Finalised</p>

            </div>

        </div>)
}

export default JobCustomFields;