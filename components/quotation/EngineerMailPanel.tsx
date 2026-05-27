'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Select, Spin, message } from 'antd';
import {
  IconX,
  IconFileTypePdf,
  IconEye,
  IconRefresh,
  IconSend,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useAppDispatch } from '@hooks/redux';
import RichTextEditor from '../common/rich-text-editor/RichTextEditor';
import {
  EngineerMailPreview,
  getEngineerMailPreviewThunk,
  generateEngineeringRequirementThunk,
  sendEngineerEmailThunk,
} from '@redux/feature/quotation/quotationThunk';

interface EngineerMailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  quoteVersionId?: string;
}

/**
 * Slide-over panel: "Mail to Structural Engineer".
 * Left section is the editable mail (template-prefilled subject + HTML body),
 * the attachments section previews the auto-generated Engineering Requirement
 * PDF and the engineer's Completion Report (if uploaded).
 */
const EngineerMailPanel: React.FC<EngineerMailPanelProps> = ({ isOpen, onClose, quoteVersionId }) => {
  const dispatch = useAppDispatch();

  const [animateOut, setAnimateOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<EngineerMailPreview | null>(null);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  // Remount the editor when the body is set programmatically (template apply),
  // since RichTextEditor captures its initial value once on mount.
  const [editorKey, setEditorKey] = useState(0);

  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);

  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
      onClose();
    }, 300);
  };

  const applyTemplate = (templateId?: string, templates?: EngineerMailPreview['emailTemplates']) => {
    const list = templates ?? preview?.emailTemplates ?? [];
    const tpl = list.find(t => t.templateEmailId === templateId);
    setSelectedTemplateId(templateId);
    setSubject(tpl?.subject ?? '');
    setEmailBody(tpl?.emailContent ?? '');
    setEditorKey(k => k + 1);
  };

  const loadPreview = async () => {
    if (!quoteVersionId) return;
    setLoading(true);
    try {
      const data = (await dispatch(
        getEngineerMailPreviewThunk({ versionId: quoteVersionId })
      ).unwrap()) as EngineerMailPreview;
      setPreview(data);
      // Pre-fill from the first active template, if any.
      if (data.emailTemplates?.length) {
        applyTemplate(data.emailTemplates[0].templateEmailId, data.emailTemplates);
      } else {
        setSelectedTemplateId(undefined);
        setSubject('');
        setEmailBody('');
        setEditorKey(k => k + 1);
      }
    } catch (error) {
      message.error(typeof error === 'string' ? error : 'Failed to load mail panel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && quoteVersionId) {
      loadPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, quoteVersionId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    if (!quoteVersionId) return;
    setGenerating(true);
    try {
      const res = (await dispatch(
        generateEngineeringRequirementThunk({ versionId: quoteVersionId })
      ).unwrap()) as { presignedUrl: string };
      const url = res?.presignedUrl;
      // Reflect the freshly generated PDF in local state.
      setPreview(prev =>
        prev
          ? { ...prev, engineeringRequirement: { ...prev.engineeringRequirement, exists: true, presignedUrl: url } }
          : prev
      );
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
      message.success('Engineering Requirement generated');
    } catch (error) {
      message.error(typeof error === 'string' ? error : 'Failed to generate Engineering Requirement');
    } finally {
      setGenerating(false);
    }
  };

  const openUrl = (url?: string | null) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSend = async () => {
    if (!quoteVersionId) return;
    if (!preview?.engineer?.email) {
      message.error('No structural engineer email is available for this version');
      return;
    }
    if (!subject.trim() || !stripHtml(emailBody).trim()) {
      message.error('Subject and email body are required');
      return;
    }
    if (!preview?.engineeringRequirement?.exists) {
      message.error('Please generate the Engineering Requirement PDF before sending');
      return;
    }
    setSending(true);
    try {
      await dispatch(
        sendEngineerEmailThunk({
          versionId: quoteVersionId,
          subject: subject.trim(),
          emailBody,
          templateEmailId: selectedTemplateId,
        })
      ).unwrap();
      message.success('Email sent to the structural engineer');
      handleClose();
    } catch (error) {
      message.error(typeof error === 'string' ? error : 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const engineer = preview?.engineer;
  const engReq = preview?.engineeringRequirement;
  const compaction = preview?.compactionReport;

  const templateOptions = useMemo(
    () =>
      (preview?.emailTemplates ?? []).map(t => ({
        value: t.templateEmailId,
        label: t.name,
      })),
    [preview?.emailTemplates]
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 backdrop-blur-[2px] !z-[9998] ${
          animateOut ? 'animate-fade-out' : 'animate-fade-in'
        } bg-black-50`}
      />

      <div
        className={`fixed right-0 bottom-0 h-full w-full sm:max-w-[700px] !z-[9999] bg-card-color shadow-shadow-lg flex flex-col transition-transform duration-300 ${
          animateOut ? 'animate-slide-out' : 'animate-slide-in'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 !z-[9999] flex items-center justify-between p-5 border-b border-border-color bg-card-color">
          <h2 className="text-[20px]/[26px] font-medium p-2">Mail to Structural Engineer</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-black transition">
            <IconX />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spin />
            </div>
          ) : (
            <>
              {/* Recipient */}
              <div className="rounded-md border border-border-color p-4">
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">To</div>
                {engineer?.email ? (
                  <div>
                    <div className="font-medium">{engineer.name || 'Structural Engineer'}</div>
                    <div className="text-sm text-gray-500">{engineer.email}</div>
                    {engineer.phone && <div className="text-sm text-gray-500">{engineer.phone}</div>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <IconAlertCircle size={16} />
                    No structural engineer is assigned to this version.
                  </div>
                )}
              </div>

              {preview?.sendToEngineer && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-md p-3">
                  <IconAlertCircle size={16} />
                  This request has already been sent to the engineer. Sending again will re-notify them.
                </div>
              )}

              {/* Template selector */}
              <div>
                <label className="block text-sm font-medium mb-1">Email Template</label>
                <Select
                  className="w-full"
                  placeholder={templateOptions.length ? 'Select a template' : 'No templates available'}
                  options={templateOptions}
                  value={selectedTemplateId}
                  onChange={val => applyTemplate(val)}
                  allowClear
                  disabled={!templateOptions.length}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  className="w-full border border-border-color rounded-md px-3 py-2 bg-transparent outline-none"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Email subject"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <RichTextEditor
                  key={editorKey}
                  value={emailBody}
                  onChange={setEmailBody}
                  placeholder="Write the email to the structural engineer..."
                  maxHeight="260px"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium mb-2">Attachments</label>
                <div className="space-y-3">
                  {/* Engineering Requirement */}
                  <div className="flex items-center justify-between rounded-md border border-border-color p-3">
                    <div className="flex items-center gap-3">
                      <IconFileTypePdf size={28} className="text-red-500" />
                      <div>
                        <div className="font-medium text-sm">Engineering Requirement</div>
                        <div className="text-xs text-gray-500">
                          {engReq?.exists ? 'Generated' : 'Not generated yet — generate to attach'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {engReq?.exists && (
                        <Button
                          size="small"
                          icon={<IconEye size={14} />}
                          onClick={() => openUrl(engReq?.presignedUrl)}
                          disabled={!engReq?.presignedUrl}
                        >
                          Preview
                        </Button>
                      )}
                      <Button
                        size="small"
                        type="primary"
                        icon={<IconRefresh size={14} />}
                        loading={generating}
                        onClick={handleGenerate}
                      >
                        {engReq?.exists ? 'Regenerate' : 'Generate'}
                      </Button>
                    </div>
                  </div>

                  {/* Compaction Report */}
                  <div className="flex items-center justify-between rounded-md border border-border-color p-3">
                    <div className="flex items-center gap-3">
                      <IconFileTypePdf size={28} className={compaction?.exists ? 'text-red-500' : 'text-gray-300'} />
                      <div>
                        <div className="font-medium text-sm">Compaction Report</div>
                        <div className="text-xs text-gray-500">
                          {compaction?.exists ? 'Available — will be attached' : 'Not uploaded yet'}
                        </div>
                      </div>
                    </div>
                    {compaction?.exists && (
                      <Button
                        size="small"
                        icon={<IconEye size={14} />}
                        onClick={() => openUrl(compaction?.presignedUrl)}
                        disabled={!compaction?.presignedUrl}
                      >
                        Preview
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 !z-[9999] p-4 border-t border-border-color bg-card-color flex justify-end gap-4">
          <button onClick={handleClose} className="btn btn-secondary">
            Close
          </button>
          <Button
            type="primary"
            icon={<IconSend size={16} />}
            loading={sending}
            disabled={loading || !engineer?.email}
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0%); }
        }
        @keyframes slide-out {
          from { transform: translateX(0%); }
          to { transform: translateX(100%); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
        .animate-slide-out { animation: slide-out 0.3s ease-in forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-fade-out { animation: fade-out 0.3s ease-in forwards; }
      `}</style>
    </>
  );
};

/** Strip HTML tags to validate the body has real content. */
function stripHtml(html: string): string {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
}

export default EngineerMailPanel;
