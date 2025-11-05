import TabLayout from '@/components/common/TabLayout';
import { tabsLabel } from '@/components/common/TabLabel';
import { CommonFolder } from '@/components/configurations/components/document/CommonFolder';
import { FileNaming } from '@/components/configurations/components/document/FIleNaming';
import { FolderMapping } from '@/components/configurations/components/document/FolderMapping';

const TABS = [
  {
    id: 'commonFolders',
    label: tabsLabel('Integration Area', 'Website and system integration'),
    component: CommonFolder,
  },
  {
    id: 'fileNaming',
    label: tabsLabel('File Naming', 'set default filename'),
    component: FileNaming,
  },
  {
    id: 'folderMapping',
    label: tabsLabel('Folder Mapping', 'Store the documents under specific folder'),
    component: FolderMapping,
  },
];

export default function DocumentConfig() {
  return <TabLayout tabs={TABS} />;
}
