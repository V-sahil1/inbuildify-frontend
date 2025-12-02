import {
    IconFolderOpen,
    IconUsers,
    IconHourglassLow,
    IconStar,
    IconShare,
    IconTrash,
    IconPlus,
} from '@tabler/icons-react';
import TabLayout from '@/components/common/TabLayout';
import { Button } from 'antd';
import MyDrive from './components/MyDrive';

const TABS = [
    {
        id: 'my-drive',
        label: 'My Drive',
        icon: IconFolderOpen,
        breadcrumb: 'My Drive',
        component: MyDrive,
        componentProps: { type: 'my-drive' },
    },
    {
        id: 'customers',
        label: 'Customers',
        icon: IconUsers,
        breadcrumb: 'Customers',
        component: MyDrive,
        componentProps: { type: 'customers' },
    },
    {
        id: 'recents',
        label: 'Recents',
        icon: IconHourglassLow,
        breadcrumb: 'Recents',
        component: MyDrive,
        componentProps: { type: 'recents' },
    },
    {
        id: 'favorites',
        label: 'Favorites',
        icon: IconStar,
        breadcrumb: 'Favorites',
        component: MyDrive,
        componentProps: { type: 'favorites' },
    },
    {
        id: 'shared',
        label: 'Shared',
        icon: IconShare,
        breadcrumb: 'Shared',
        component: MyDrive,
        componentProps: { type: 'shared' },
    },
    {
        id: 'trash',
        label: 'Trash',
        icon: IconTrash,
        breadcrumb: 'Trash',
        component: MyDrive,
        componentProps: { type: 'trash' },
    },
];

export default function ProjectList() {
    return (
        <TabLayout tabs={TABS} breadcrumbBase={{ link: 'Sdrive', url: '/sdrive' }}>
            <Button type="primary" icon={<IconPlus />}>
                New
            </Button>
        </TabLayout>
    );
}
