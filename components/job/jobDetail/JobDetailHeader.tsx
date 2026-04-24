import { IconDotsVertical, IconList, IconUserSquareRounded } from '@tabler/icons-react';
import { Button, message, Modal, Popover, Switch, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import JobChecklist from './JobChecklist';
import { JobOptions } from 'data/options';
import { useRouter } from 'next/navigation';
import { jobOptionRenderer } from './joboptions';
import { UserContent } from '@/components/common/UserContent';
import LeadContactModel from '@/components/common/Models/LeadContactModel';
import { IJobDetail, JobDetailInvoice } from '@redux/feature/job/IJobState';
import { LeadContact } from '@redux/feature/lead/ILeadState';
import { useAppDispatch } from '@hooks/redux';
import {
  createLeadContactMapThunk,
  deleteLeadContactMapThunk,
  getLeadContactMapThunk,
} from '@redux/feature/lead/leadThunk';
import { createContact, updateContact } from '@redux/feature/contacts/contactThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

interface JobDetailHeaderProps {
  jobDetail?: IJobDetail | null;
}

const JobDetailHeader = ({ jobDetail }: JobDetailHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecklistDreawerOpen, setChecklistDrawerOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [isJobOptionModalOpen, setJobOptionModalOpen] = useState(false);
  const [manageUserDetail, setManageUserOpen] = useState(false);
  const [jobContacts, setJobContacts] = useState<LeadContact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  // ── Contact management handlers ───────────────────────────────────────────
  const handleManageContactOpen = async () => {
    setManageUserOpen(true);
    if (!jobDetail?.leadsId) return;
    setContactsLoading(true);
    try {
      const contacts = await dispatch(getLeadContactMapThunk(jobDetail?.leadsId)).unwrap();
      setJobContacts((contacts as any) ?? []);
    } catch {
      message.error('Failed to fetch contacts');
    } finally {
      setContactsLoading(false);
    }
  };

  const handleSaveContact = async (selectedContact: LeadContact | null, values: any) => {
    if (!jobDetail?.leadsId) return;
    setContactsLoading(true);
    try {
      if (selectedContact) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, selectedContact);
        if (!isUpdated) {
          setManageUserOpen(false);
          return;
        }
        await dispatch(updateContact({ id: selectedContact.contactId, data: updatedFields })).unwrap();
        message.success('Contact updated successfully');
      } else {
        const res = await dispatch(createContact(values)).unwrap() as any;
        await dispatch(
          createLeadContactMapThunk({ leadsId: jobDetail?.leadsId, contactId: res.usersId })
        ).unwrap();
        message.success('Contact added successfully');
      }
      const updated = await dispatch(getLeadContactMapThunk(jobDetail?.leadsId)).unwrap();
      setJobContacts((updated as any) ?? []);
      setManageUserOpen(false);
    } catch (err: any) {
      message.error(err?.message || 'Failed to save contact');
    } finally {
      setContactsLoading(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!jobDetail?.leadsId) return;
    setContactsLoading(true);
    try {
      await dispatch(deleteLeadContactMapThunk(id)).unwrap();
      message.success('Contact removed successfully');
      const updated = await dispatch(getLeadContactMapThunk(jobDetail?.leadsId)).unwrap();
      setJobContacts((updated as any) ?? []);
    } catch (err: any) {
      message.error(err?.message || 'Failed to remove contact');
    } finally {
      setContactsLoading(false);
    }
  };

  // ── Financial summary derived from job detail ──────────────────────────────
  // pg returns DECIMAL/NUMERIC as strings — always coerce to Number
  const quotationTotal = Number(jobDetail?.quotationTotal ?? 0);
  const totalPaid      = Number(jobDetail?.totalPaid ?? 0);
  const balance        = quotationTotal - totalPaid;
  const invoices: JobDetailInvoice[] = jobDetail?.invoices ?? [];

  const costItems = [
    { key: 'Quotation',     value: quotationTotal ? quotationTotal.toFixed(2) : '' },
    { key: 'Colors',        value: '' },
    { key: 'Contract Cost', value: quotationTotal ? quotationTotal.toFixed(2) : '' },
  ];

  const paymentItems = invoices.map(inv => ({
    key:   inv.referenceNumber ?? 'Payment',
    value: inv.depositAmount != null ? Number(inv.depositAmount).toFixed(2) : '',
  }));

  const quickUpdateSection = JobOptions.find(section => section.title === 'Job Information');
  const otherSections = JobOptions.filter(section => section.title !== 'Job Information');

  useEffect(() => {
    const handleClickOutside = () => {
      if (isDropdownOpen) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleOptionClick = item => {
    setDropdownOpen(false);
    setActiveAction(item.key);
    setJobOptionModalOpen(true);
  };

  return (
    <>
      <div className="w-full pr-[100px]">
        <div className="flex justify-between w-full text-sm m-3">
          <div className="border-l-2 pl-2 cursor-pointer">
            <Popover
              content={
                <UserContent
                  name={jobDetail?.customerName}
                  address={jobDetail?.jobAddress}
                  phone={jobDetail?.customerPhone}
                  email={jobDetail?.customerEmail}
                />
              }
            >
              <div className="flex gap-2 items-center text-base font-semibold text-blue">
                {jobDetail?.customerName ?? '—'}
                <Tooltip title="Manage Contact">
                  <IconUserSquareRounded
                    color="var(--blue)"
                    size={20}
                    onClick={handleManageContactOpen}
                  />
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                {jobDetail?.jobAddress ?? '—'}
                {jobDetail?.titleStatus && (
                  <Tag color="green">{jobDetail?.titleStatus}</Tag>
                )}
              </div>
            </Popover>
          </div>
          <div className="border-l-2 pl-2">
            <div className="text-base font-semibold flex items-center">
              {jobDetail?.builderName ?? '—'}
            </div>
            <div className="mt-1">Builder</div>
          </div>
          <div className="border-l-2 pl-2 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <div className="flex text-base font-semibold text-blue">
              $ {balance.toFixed(2)}
            </div>
            <div>
              Balance to be paid
            </div>
          </div>
          <div className="flex gap-2 relative">
            <Button icon={<IconList />} onClick={() => setChecklistDrawerOpen(true)}></Button>

            <Button
              icon={<IconDotsVertical />}
              onClick={e => {
                e.stopPropagation();
                setDropdownOpen(!isDropdownOpen);
              }}
              className="relative"
            />
            {isDropdownOpen && (
              <div
                className="absolute right-0 top-10 z-50  rounded-lg w-[500px] p-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="grid grid-cols-2 gap-4">
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 top-10 z-50 bg-white rounded-lg w-[500px] p-4"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex">
                        {/* Left side - First 3 sections */}
                        <div className="w-1/2 pr-4 border-r border-gray-200">
                          {otherSections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-2 mb-4">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {section.title}
                              </h4>
                              <div className="space-y-1">
                                {section.items.map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                      handleOptionClick(item);
                                      if (item.href) {
                                        router.push(item.href);
                                      }
                                    }}
                                  >
                                    {item.hasToggle ? (
                                      <div
                                        onMouseDown={e => e.stopPropagation()}
                                        onClick={e => e.stopPropagation()}
                                      >
                                        <Switch
                                          size="small"
                                          className="mr-2"
                                          onChange={checked => {
                                            console.log(
                                              `Finance Approval ${
                                                checked ? 'approved' : 'not approved'
                                              }`
                                            );
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <span className={`mr-2 ${item.color}`}>{item.icon}</span>
                                    )}
                                    <span className="text-sm text-gray-700">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                              {sectionIndex < otherSections.length - 1 && (
                                <div className="border-t border-gray-100 my-2" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Right side - Quick Update section */}
                        <div className="w-1/2 pl-4">
                          {quickUpdateSection && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {quickUpdateSection.title}
                              </h4>
                              <div className="space-y-1">
                                {quickUpdateSection.items.map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                      handleOptionClick(item);
                                      if (item.href) {
                                        router.push(item.href);
                                      }
                                    }}
                                  >
                                    <span className={`mr-2 ${item.color}`}>{item.icon}</span>
                                    <span className="text-sm text-gray-700">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <JobChecklist open={isChecklistDreawerOpen} onClose={() => setChecklistDrawerOpen(false)} />
        {jobOptionRenderer({
          activeAction,
          onCancel: () => setJobOptionModalOpen(false),
          open: isJobOptionModalOpen,
        })}
        <Modal
          title={'Cost Summary'}
          onOk={handleClose}
          onCancel={handleClose}
          cancelButtonProps={{ style: { display: 'none' } }}
          centered
          open={isModalOpen}
        >
          <div>
            <div className="grid grid-cols-2 gap-6  text-xs">
              <div className="flex flex-col">
                <div className="flex justify-between mb-4 mt-3 font-medium">
                  <div>Cost Item</div>
                  <div>Amount $</div>
                </div>
                {costItems.map((item, idx) => (
                  <div className="flex justify-between my-2" key={idx}>
                    <div>{item.key}</div>
                    <div>{item.value}</div>
                  </div>
                ))}
                <div className="flex justify-between my-2">
                  <div>Total Cost</div>
                  <div className="font-medium">{quotationTotal.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between mb-4 mt-3 font-medium">
                  <div>Payments</div>
                  <div>Amount $</div>
                </div>
                {paymentItems.map((item, idx) => (
                  <div className="flex justify-between my-2" key={idx}>
                    <div>{item.key}</div>
                    <div>{item.value}</div>
                  </div>
                ))}
                <div className="flex justify-between mt-40">
                  <div>Total Paid</div>
                  <div className="font-medium">{totalPaid.toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="border-t-2 border-b-2 border-border-color text-red-600 flex justify-end gap-9 py-15 mt-3 font-semibold">
              <div>Balanced To Be Paid</div>
              <div>$ {balance.toFixed(2)}</div>
            </div>
          </div>
        </Modal>
        <LeadContactModel
          open={manageUserDetail}
          onCancel={() => setManageUserOpen(false)}
          contacts={jobContacts}
          title="Customer Contacts"
          loading={contactsLoading}
          onSaveContact={handleSaveContact}
          onDeleteContact={handleDeleteContact}
          maxContacts={2}
        />
      </div>
    </>
  );
};
export default JobDetailHeader;
