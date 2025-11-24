'use client';
import React, { useState } from 'react';
import { Typography, Empty, Switch, Form, Row, Col, Input, Button, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import AgentReferralHeader from '@/components/agentreferral/PartnerListingHeader';
import AgentReferralTable from '@/components/agentreferral/PartnerListingTable';
import AgentReferralGrid from '@/components/agentreferral/PartnerListingGrid';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import PartnerDetailModal from '@/components/agentreferral/PartnerdetailModal';
import { initialData, Partners } from 'data/agentreferralData';

const AgentReferralManager = () => {
  const router = useRouter();

  const [partners, setPartners] = useState<Partners[]>(initialData);
  const [search, setSearch] = useState('');

  const [selectedPartner, setSelectedPartner] = useState<Partners | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);

  const [genPassword, setGenPassword] = useState(false);
  const [emailPassword, setEmailPassword] = useState(false);
  const [changePartnerPassword, setChangePartnerPassword] = useState(false);

  const [statusTab, setStatusTab] = useState<'active' | 'inactive'>('active');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [resetForm] = Form.useForm();

  const goToPartnerDetail = (partner: Partners) => {
    router.push(`/agent-referral/${partner.id}`);
  };

  const handleAddPartner = (values: any) => {
    const newPartner: Partners = {
      id: partners.length + 1,
      name: values.name,
      email: values.email,
      phone: values.phone,
      address1: values.address1 + ', ' + values.city,
      reserved: 0,
      packages: 0,
      isActive: values.isActive,
      isLocked: false,
    };

    setPartners([...partners, newPartner]);
    setActionType(null);
  };

  const handleUpdatePartner = (values: any) => {
    setPartners(prev => prev.map(p => (p.id === selectedPartner?.id ? { ...p, ...values } : p)));
    setActionType(null);
    setSelectedPartner(null);
  };

  const handleDeleteConfirm = () => {
    setPartners(prev => prev.filter(p => p.id !== selectedPartner?.id));
    setActionType(null);
    setSelectedPartner(null);
  };

  const handleLockConfirm = () => {
    setPartners(prev =>
      prev.map(p => (p.id === selectedPartner?.id ? { ...p, isLocked: !p.isLocked } : p))
    );
    setActionType(null);
    setSelectedPartner(null);
  };

  const handleSaveResetPassword = () => {
    if (!genPassword) {
      resetForm.validateFields().then(values => {
        console.log('Manual new password:', values.password);
      });
    } else {
      console.log('Auto password');
    }

    console.log('Flags:', { changePartnerPassword, emailPassword });
    setActionType(null);
    setGenPassword(false);
    setEmailPassword(false);
    setChangePartnerPassword(false);
    resetForm.resetFields();
  };

  const filteredPartners = partners.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusTab === 'active' ? p.isActive : !p.isActive;
    return matchSearch && matchStatus;
  });

  const willLock = selectedPartner ? !(selectedPartner.isLocked ?? false) : false;

  return (
    <div className="p-4">
      <Typography.Title level={4}>Agent/Referral Partner Listing</Typography.Title>

      <AgentReferralHeader
        total={filteredPartners.length}
        onSearch={setSearch}
        onStatusChange={setStatusTab}
        onViewChange={setViewMode}
        onCreateClick={() => {
          setActionType('add');
          setSelectedPartner(null);
        }}
      />

      {filteredPartners.length === 0 ? (
        <Empty description="No Agents found." />
      ) : viewMode === 'grid' ? (
        <AgentReferralGrid
          partners={filteredPartners}
          onEdit={p => {
            setSelectedPartner(p);
            setActionType('edit');
          }}
          onDelete={p => {
            setSelectedPartner(p);
            setActionType('delete');
          }}
          onLock={p => {
            setSelectedPartner(p);
            setActionType('lock');
          }}
          onResetPassword={p => {
            setSelectedPartner(p);
            setActionType('resetPassword');
          }}
          onViewDetails={goToPartnerDetail}
        />
      ) : (
        <AgentReferralTable
          partners={filteredPartners}
          onEdit={p => {
            setSelectedPartner(p);
            setActionType('edit');
          }}
          onDelete={p => {
            setSelectedPartner(p);
            setActionType('delete');
          }}
          onRowClick={goToPartnerDetail}
        />
      )}

      {actionType === 'add' && (
        <PartnerDetailModal
          open
          initialData={null}
          onClose={() => setActionType(null)}
          onSubmit={handleAddPartner}
        />
      )}

      {actionType === 'edit' && selectedPartner && (
        <PartnerDetailModal
          open
          initialData={selectedPartner}
          onClose={() => setActionType(null)}
          onSubmit={handleUpdatePartner}
        />
      )}

      {actionType === 'delete' && selectedPartner && (
        <ConfirmationModal
          open
          onClose={() => setActionType(null)}
          onConfirm={handleDeleteConfirm}
          message={`Delete ${selectedPartner.name}?`}
          type="danger"
          confirmText="Delete"
        />
      )}

      {actionType === 'lock' && selectedPartner && (
        <ConfirmationModal
          open
          onClose={() => setActionType(null)}
          onConfirm={handleLockConfirm}
          message={`Are you sure you want to ${willLock ? 'lock' : 'unlock'} this partner?`}
          type={willLock ? 'danger' : 'info'}
          confirmText={willLock ? 'Lock' : 'Unlock'}
        />
      )}

      {actionType === 'resetPassword' && selectedPartner && (
        <Modal
          open
          onCancel={() => setActionType(null)}
          destroyOnClose
          centered
          title={`Reset Password - ${selectedPartner.name}`}
          footer={
            <div className="flex justify-end gap-2 border-t pt-3">
              <Button onClick={() => setActionType(null)}>Cancel</Button>
              <Button type="primary" onClick={handleSaveResetPassword}>
                Save
              </Button>
            </div>
          }
        >
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-2">
              <Switch checked={genPassword} onChange={() => setGenPassword(!genPassword)} />
              <span>Automatically generate password & email</span>
            </div>

            {!genPassword && (
              <>
                <Form form={resetForm} layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                        <Input.Password />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>

                <div className="text-xs text-gray-500 ml-1 mb-2">
                  <p>Password must include:</p>
                  <p>• 8+ characters</p>
                  <p>• Upper & lower letters</p>
                  <p>• Number</p>
                  <p>• Special character [!@#$%^&*-]</p>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Switch
                    checked={changePartnerPassword}
                    onChange={() => setChangePartnerPassword(!changePartnerPassword)}
                  />
                  <span>Ask partner to change password at next login</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Switch
                    checked={emailPassword}
                    onChange={() => setEmailPassword(!emailPassword)}
                  />
                  <span>Email the password</span>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AgentReferralManager;
