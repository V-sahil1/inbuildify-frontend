import TabLayout from '@/components/common/TabLayout';
import { tabsLabel } from '@/components/common/TabLabel';
import { EmailTemplate } from '@/components/configurations/components/template/EmailTemplate';
import EmailSignatureSettings from '@/components/configurations/components/template/EmailSignature';
import { TemplateNotes } from '@/components/configurations/components/template/NotesTemplate';
import { PdfTemplates } from '@/components/configurations/components/template/PDFTemplate';

const TABS = [
  {
    id: 'email',
    label: tabsLabel('Email', 'Customize your own email content'),
    component: EmailTemplate,
  },
  {
    id: 'emailSignature',
    label: tabsLabel('Email Signature', 'Customize your own email signature'),
    component: EmailSignatureSettings,
  },
  {
    id: 'notes',
    label: tabsLabel('Notes', 'Customize your own notes contents'),
    component: TemplateNotes,
  },
  {
    id: 'pdf',
    label: tabsLabel('PDF', 'Configure the header,footer and more'),
    component: PdfTemplates,
  },
];

export default function TemplateConfig() {
  return <TabLayout tabs={TABS} />;
}
