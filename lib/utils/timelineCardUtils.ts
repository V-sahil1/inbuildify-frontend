import { AppointmentDetails, NoteDetails, SmsDetails, TaskDetails, TimelineCardProps } from 'data/types';

interface EditingItem {
    item: TimelineCardProps;
    index: number;
}

export const handleSaveTimelineCard = <T extends "Notes" | "Appointments" | "Tasks" | "Sms", D extends (T extends "Notes" ? NoteDetails : T extends "Appointments" ? AppointmentDetails : T extends "Tasks" ? TaskDetails : SmsDetails)>(
    editingItem: EditingItem | null,
    setCardsData: React.Dispatch<React.SetStateAction<TimelineCardProps[]>>,
    handleClose: () => void,
    type: T,
    data: D
) => {
    if (editingItem && editingItem.item.type === type) {
        console.log(`🔄 Updated ${type}:`, data);
        setCardsData((prev) =>
            prev.map((card, i) =>
                i === editingItem.index
                    ? ({ ...card, data: data, type: type } as TimelineCardProps)
                    : card
            )
        );
    } else {
        console.log(`✨ Created New ${type}:`, data);
        const newCard: TimelineCardProps = {
            type: type,
            date: new Date().toLocaleString(),
            createdBy: "Current User",
            createdAt: new Date().toLocaleString(),
            status: type === "Notes" ? undefined : "pending",
            data: data,
        } as TimelineCardProps;
        setCardsData((prev) => [newCard, ...prev]);
    }
    handleClose();
};
