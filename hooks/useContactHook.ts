import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Status } from "@lib/constants/enum";
import { fetchAllContact } from "@redux/feature/contacts/contactThunk";

import { message } from "antd";
import { useEffect } from "react";

export const useContactHook = () => {
    const dispatch = useAppDispatch();
    const { contact, status } = useAppSelector(state => state.contact)

    const fetchContactData = async () => {
        try {
            await dispatch(fetchAllContact({ is_active: true })).unwrap()
        }
        catch (error) {
            message.error(error || "Failed to fetch contact data")
        }
    }
    useEffect(() => {
        if (status.fetch === Status.IDLE) {
            fetchContactData()
        }
    }, [status?.fetch])
    const contactOptions = contact?.map((item) => ({
        label: item.name,
        value: item.usersId,
    }))
    return {
        contactOptions : contactOptions || [],
        contact
    }
}