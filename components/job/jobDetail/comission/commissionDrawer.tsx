"use client";
import { Drawer, Switch, Tag, Input, Select, Popconfirm } from "antd"; 
import { Dispatch, SetStateAction, useState, useCallback, useMemo } from "react";
import { IconEdit, IconPinned, IconPlus, IconTrash, IconCheck, IconX } from "@tabler/icons-react";

const { Option } = Select;


export interface Stage {
  name: string;
  total: number;
  toBePaid: number;
  paid: number;
}

export interface Partner {
  id: string;
  type: "Referral Partner" | "Sales Person" | "";
  name: string;
  stages: Stage[];
}

type EditingStageState = { partnerId: string; stageIdx: number; newName: string; newTotal: number; } | null;

interface CommissionDrawerProps {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  partners: Partner[];
  setPartners: Dispatch<SetStateAction<Partner[]>>;
  disabledPartners: string[];
  setDisabledPartners: Dispatch<SetStateAction<string[]>>;
}

const PARTNER_TYPES: Array<Partner['type']> = ["Referral Partner", "Sales Person"];

export const CommissionDrawer = ({
  openDrawer,
  setOpenDrawer,
  partners,
  setPartners,
  disabledPartners,
  setDisabledPartners,
}: CommissionDrawerProps) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newRecipientType, setNewRecipientType] = useState<Partner['type']>('');
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [editPartnerName, setEditPartnerName] = useState('');
  const [editRecipientType, setEditRecipientType] = useState<Partner['type']>('');
  const [editCommissionValue, setEditCommissionValue] = useState(0); 
  const [editingStage, setEditingStage] = useState<EditingStageState>(null);
  const [addingNewStageForPartnerId, setAddingNewStageForPartnerId] = useState<string | null>(null);
  const [newStageName, setNewStageName] = useState('');
  const [newStageValue, setNewStageValue] = useState(0);
  
  const nextSortOrder = partners.length + 1;

  const getStagePercent = useCallback((partner: Partner, stage: Stage) => {
    const grandTotal = partner.stages.reduce((sum, s) => sum + s.total, 0);
    return stage.total > 0 ? Math.round((stage.total / grandTotal) * 100) : 0;
  }, []);
  
  const handleNewPartnerSave = useCallback(() => {
    if (!newPartnerName || !newRecipientType) return; 
    const newPartner: Partner = {
      id: nextSortOrder.toString(),
      name: newPartnerName,
      type: newRecipientType,
      stages: [], 
    };
    setPartners(prev => [...prev, newPartner]);
    setIsCreatingNew(false);
    setNewPartnerName('');
    setNewRecipientType('');
  }, [newPartnerName, newRecipientType, nextSortOrder, setPartners]);

  const startEditingPartner = useCallback((partner: Partner) => {
    setIsCreatingNew(false);
    setEditingStage(null);
    setAddingNewStageForPartnerId(null);
    setEditingPartnerId(partner.id);
    setEditPartnerName(partner.name);
    setEditRecipientType(partner.type || "Referral Partner");
    const grandTotal = partner.stages.reduce((sum, s) => sum + s.total, 0);
    setEditCommissionValue(grandTotal);
  }, []);

  const cancelPartnerEditing = useCallback(() => setEditingPartnerId(null), []);

  const saveEditedPartner = useCallback(() => {
    if (!editingPartnerId || !editPartnerName || !editRecipientType) return;
    setPartners(prev => prev.map(p => 
      p.id === editingPartnerId 
        ? { ...p, name: editPartnerName, type: editRecipientType } 
        : p
    ));
    setEditingPartnerId(null);
  }, [editingPartnerId, editPartnerName, editRecipientType, setPartners]);

  const startEditingStage = useCallback((partner: Partner, stage: Stage, stageIdx: number) => {
    setEditingPartnerId(null);
    setAddingNewStageForPartnerId(null);
    setEditingStage({
      partnerId: partner.id,
      stageIdx: stageIdx,
      newName: stage.name,
      newTotal: stage.total,
    });
  }, []);
  
  const cancelEditingStage = useCallback(() => setEditingStage(null), []);
  
  const handleStageSave = useCallback((partnerId: string, stageIdx: number) => {
    if (!editingStage || editingStage.partnerId !== partnerId || editingStage.stageIdx !== stageIdx) return;
    setPartners(prevPartners =>
      prevPartners.map(p => p.id === partnerId
        ? { ...p, stages: p.stages.map((s, i) => i === stageIdx
            ? { ...s, name: editingStage.newName, total: editingStage.newTotal, toBePaid: Math.max(editingStage.newTotal - s.paid, 0) }
            : s
          )
        } : p
      )
    );
    setEditingStage(null);
  }, [editingStage, setPartners]);
  
  const handleDeleteStage = useCallback((partnerId: string, stageIdx: number) => {
    setPartners(prevPartners =>
      prevPartners.map(p => p.id === partnerId
        ? { ...p, stages: p.stages.filter((_, i) => i !== stageIdx) }
        : p
      )
    );
  }, [setPartners]);

  const startAddingNewStage = useCallback((partnerId: string) => {
    setIsCreatingNew(false);
    setEditingPartnerId(null);
    setEditingStage(null);
    setAddingNewStageForPartnerId(partnerId);
    setNewStageName('');
    setNewStageValue(0);
  }, []);

  const cancelNewStage = useCallback(() => {
    setAddingNewStageForPartnerId(null);
    setNewStageName('');
    setNewStageValue(0);
  }, []);

  const handleNewStageSave = useCallback((partnerId: string, nextStageSortOrder: number) => {
    if (!newStageName || newStageValue <= 0) return;
    const newStage: Stage = {
      name: newStageName,
      total: newStageValue,
      toBePaid: newStageValue,
      paid: 0,
    };
    setPartners(prevPartners => 
      prevPartners.map(p => p.id === partnerId
          ? { ...p, stages: [...p.stages, newStage] }
          : p
      )
    );
    cancelNewStage();
  }, [newStageName, newStageValue, setPartners, cancelNewStage]);

  const togglePartnerEnabled = (partnerId: string, checked: boolean) => {
    setDisabledPartners(prev => checked ? prev.filter(id => id !== partnerId) : [...prev, partnerId]);
  };

  const NewPartnerRow = useMemo(() => isCreatingNew && (
    <div className="grid grid-cols-2 lg:grid-cols-5 items-center p-2 bg-blue-50 border-b border-gray-300">
      <div className="col-span-2 lg:col-span-1">
        <Input placeholder="Enter Name" value={newPartnerName} onChange={(e) => setNewPartnerName(e.target.value)} className="border-gray-300" />
      </div>
      <div className="hidden lg:block lg:col-span-1">
        <Select placeholder="Please select" value={newRecipientType || undefined} onChange={setNewRecipientType} className="w-full border-gray-300">
          <Option value="Referral Partner">Referral Partner</Option>
          <Option value="Sales Person">Sales Person</Option>
        </Select>
      </div>
      <div className="col-span-1"></div>
      <div className="hidden lg:block lg:col-span-1 ml-12">
        <span className="font-bold text-gray-700">{nextSortOrder}</span>
      </div>
      <div className="col-span-1 flex justify-end gap-2">
        <button className="text-green-600 hover:text-green-800" onClick={handleNewPartnerSave} disabled={!newPartnerName || !newRecipientType}>
          <IconCheck size={18} />
        </button>
        <button className="text-red-600 hover:text-red-800" onClick={() => { setIsCreatingNew(false); setNewPartnerName(''); setNewRecipientType(''); }}>
          <IconX size={18} />
        </button>
      </div>
    </div>
  ), [isCreatingNew, newPartnerName, newRecipientType, nextSortOrder, handleNewPartnerSave]);


  const PartnerRow = useCallback((partner: Partner) => {
    const grandTotal = partner.stages.reduce((sum, s) => sum + s.total, 0);
    const partnerTypeDisplay = partner.type || "Referral Partner";
    const isEnabled = !disabledPartners.includes(partner.id);
    const isEditingPartner = editingPartnerId === partner.id;
    const isAddingNewStage = addingNewStageForPartnerId === partner.id;
    const nextStageSortOrder = partner.stages.length + 1;

    // --- Partner Editing Row ---
    const EditingRow = (
      <div className="grid grid-cols-2 lg:grid-cols-5 items-center p-2 bg-white border-y border-gray-200">
        <div className="col-span-2 lg:col-span-1">
          <Input placeholder="Enter Name" value={editPartnerName} onChange={(e) => setEditPartnerName(e.target.value)} />
        </div>
        <div className="hidden lg:block lg:col-span-1">
          <Select placeholder="Please select" value={editRecipientType || undefined} onChange={(value) => setEditRecipientType(value as Partner['type'])} className="w-full">
            {PARTNER_TYPES.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </div>
        <div className="col-span-1">
          <Input type="number" prefix="$" placeholder="Total Value" value={editCommissionValue} disabled className="w-full" />
        </div>
        <div className="hidden lg:block lg:col-span-1 ml-12">
          <span className="font-bold text-gray-700">{partner.id}</span>
        </div>
        <div className="col-span-1 flex justify-end gap-2">
          <button className="text-green-600 hover:text-green-800" onClick={saveEditedPartner} disabled={!editPartnerName || !editRecipientType}>
            <IconCheck size={18} />
          </button>
          <button className="text-red-600 hover:text-red-800" onClick={cancelPartnerEditing}>
            <IconX size={18} />
          </button>
        </div>
      </div>
    );

    const DisplayRow = (
      <div className="grid grid-cols-2 lg:grid-cols-5 items-center p-2 bg-white font-semibold flex-wrap">
        <div className="flex items-center gap-2 col-span-2 lg:col-span-1">
          <Switch checked={isEnabled} onChange={(checked) => togglePartnerEnabled(partner.id, checked)} />
          <span>{partner.type}</span>
        </div>
        <div className="hidden lg:block lg:col-span-1">
          <Tag color="blue">{partnerTypeDisplay}</Tag>
        </div>
        <div className="col-span-1">${grandTotal.toLocaleString()}</div>
        <div className="hidden lg:block lg:col-span-1 ml-12">{partner.id}</div>
        <div className="col-span-1 flex justify-end gap-2">
          <button className="text-green-600 hover:text-green-800" disabled={!isEnabled || isAddingNewStage} onClick={() => startAddingNewStage(partner.id)}>
            <IconPlus size={18} />
          </button>
          <button className="text-gray-600 hover:text-blue-500" disabled={!isEnabled || isAddingNewStage} onClick={() => startEditingPartner(partner)}>
            <IconEdit size={18} />
          </button>
        </div>
      </div>
    );

    const NewStageRow = isAddingNewStage && (
      <div className="grid grid-cols-2 lg:grid-cols-5 items-center p-2 bg-gray-50 border-t border-b border-gray-300">
        <div className="col-span-1 hidden lg:block"></div> 
        <div className="col-span-2 lg:col-span-1 pr-2">
          <Input placeholder="Stage Name" value={newStageName} onChange={(e) => setNewStageName(e.target.value)} className="w-full" />
        </div>
        <div className="col-span-1 flex items-center gap-2">
          <Input type="number" prefix="$" placeholder="Value" value={newStageValue} onChange={(e) => setNewStageValue(Number(e.target.value))} className="w-full" />
        </div>
        <div className="hidden lg:block lg:col-span-1 ml-12">
          <span className="font-bold text-gray-700">{nextStageSortOrder}</span>
        </div>
        <div className="col-span-1 flex justify-end gap-2">
          <button className="text-green-600 hover:text-green-800" onClick={() => handleNewStageSave(partner.id, nextStageSortOrder)} disabled={!newStageName || newStageValue <= 0}>
            <IconCheck size={18} />
          </button>
          <button className="text-red-600 hover:text-red-800" onClick={cancelNewStage}>
            <IconX size={18} />
          </button>
        </div>
      </div>
    );

    const StageRows = isEnabled && partner.stages.map((stage, idx) => {
      const percent = getStagePercent(partner, stage);
      const isEditingThisStage = editingStage?.partnerId === partner.id && editingStage.stageIdx === idx;
      
      return (
        <div key={idx} className="grid grid-cols-2 lg:grid-cols-5 items-center p-2 bg-gray-50 text-sm border-b border-gray-100">
          <div className="col-span-2 lg:col-span-1 pl-6 flex items-center gap-2"></div>
          <div className="col-span-1 flex items-center">
            <IconPinned size={14} className="mr-1 hidden lg:block" />
            {isEditingThisStage ? (
              <Input value={editingStage!.newName} onChange={(e) => setEditingStage(prev => prev ? { ...prev, newName: e.target.value } : null)} className="w-full" />
            ) : (
              <span className="flex items-center lg:pl-0">{stage.name}</span>
            )}
          </div>
          <div className="col-span-1 flex items-center gap-2">
            {isEditingThisStage ? (
              <Input type="number" prefix="$" value={editingStage!.newTotal} onChange={(e) => setEditingStage(prev => prev ? { ...prev, newTotal: Number(e.target.value) } : null)} className="w-full max-w-[150px]" />
            ) : (
              <><span className='lg:hidden'>Value:</span> ${stage.total.toLocaleString()} {percent > 0 && <Tag color="green">{percent}%</Tag>}</>
            )}
          </div>
          <div className="hidden lg:block lg:col-span-1 ml-12">{idx + 1}</div>
          <div className="col-span-1 flex justify-end gap-2">
            {isEditingThisStage ? (
              <>
                <button className="text-green-600 hover:text-green-800" onClick={() => handleStageSave(partner.id, idx)}><IconCheck size={18} /></button>
                <button className="text-red-600 hover:text-red-800" onClick={cancelEditingStage}><IconX size={18} /></button>
              </>
            ) : (
              <>
                <button className="text-gray-600 hover:text-blue" onClick={() => startEditingStage(partner, stage, idx)}><IconEdit size={18} /></button>
                <Popconfirm title={`Are you sure you want to delete ${stage.name}?`} onConfirm={() => handleDeleteStage(partner.id, idx)} okText="Yes, Delete" cancelText="No">
                  <button className="text-gray-600 hover:text-red-500"><IconTrash size={18} /></button>
                </Popconfirm>
              </>
            )}
          </div>
        </div>
      );
    });

    return (
      <div key={partner.id} className={`border-b border-gray-200 ${!isEnabled ? 'bg-gray-100 opacity-50' : ''}`}>
        {isEditingPartner ? EditingRow : DisplayRow}
        {NewStageRow}
        {StageRows}
      </div>
    );
  }, [disabledPartners, editingPartnerId, editPartnerName, editRecipientType, editCommissionValue, addingNewStageForPartnerId, newStageName, newStageValue, editingStage, getStagePercent, cancelPartnerEditing, saveEditedPartner, startAddingNewStage, startEditingPartner, togglePartnerEnabled, handleNewStageSave, cancelNewStage, handleStageSave, cancelEditingStage, handleDeleteStage]);


  return (
    <Drawer
      width="50%"
      open={openDrawer}
      title="Capture Commission"
      onClose={() => setOpenDrawer(false)}
      maskClosable
      style={{ maxWidth: '100vw' }}
    >
      <h2 className="text-lg font-bold mb-4">Outgoing Commission</h2>

      <div className="grid grid-cols-2 lg:grid-cols-5 font-bold items-center p-2 bg-gray-100 border-b">
        <div className="col-span-2 lg:col-span-1">Name</div>
        <div className="hidden lg:block lg:col-span-1">Recipient</div>
        <div className="col-span-1">Commission Value</div>
        <div className="hidden lg:block lg:col-span-1 ml-12">Sort</div>
        <div className="col-span-1 text-right">
          <button
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 ml-auto"
            onClick={() => { setIsCreatingNew(prev => !prev); setEditingPartnerId(null); }}
          >
            <IconPlus size={16} /> {isCreatingNew ? 'Cancel' : 'New'}
          </button>
        </div>
      </div>

      {NewPartnerRow}
      {partners.map(PartnerRow)}
    </Drawer>
  );
};