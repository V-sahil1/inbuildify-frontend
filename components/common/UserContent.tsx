import { IconMail, IconPhone } from '@tabler/icons-react';

export const UserContent = () => {
    return (
        <div className="space-y-2">
            <p>Murthy</p>
            <p> Lot 300 Tallis Cct,Tarneit,VIC,5345</p>
            <p className="flex items-center gap-1">
                <IconPhone size={15} />
                7863625436
            </p>
            <p className="flex items-center gap-1">
                <IconMail size={15} />
                murthy@mailinator.com
            </p>
        </div>
    );
};
