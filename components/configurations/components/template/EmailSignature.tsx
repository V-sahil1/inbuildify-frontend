'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Select, message } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import RichTextEditor from '@/components/common/rich-text-editor/RichTextEditor';
import { personalizationList } from 'data/configuration/TemplateData';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import {
  fetchEmailSignature,
  updateEmailSignature,
} from '@redux/feature/admin/template/emailSignature/emailSignatureThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { RichTextEditorRef } from '@/components/common/rich-text-editor/RichTextEditor';

const { Option } = Select;

const EmailSignatureSettings = () => {
  const dispatch = useAppDispatch();
  const { emailSignature, status } = useAppSelector(state => state.template.emailSignature);
  const editorRef = useRef<RichTextEditorRef>(null);
  const [formState, setFormState] = useState({
    includeEmailSignature: false,
    signatureContent: '',
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchEmailSignatureData = async () => {
    try {
      await dispatch(fetchEmailSignature()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch email signature');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchEmailSignatureData();
    }
  }, [status.fetch]);

  useEffect(() => {
    if (emailSignature) {
      setFormState({
        includeEmailSignature: emailSignature.includeEmailSignature ?? false,
        signatureContent: emailSignature.signatureContent ?? '',
      });
    }
  }, [emailSignature]);

  const updateField = (key: string, value: any) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const insertTag = (tag: string) => {
    if (editorRef.current) {
      editorRef.current.insertAtCursor(` [${tag}] `);
    }
  };

  const handleSave = async () => {
    try {
      const { isUpdated, updatedFields } = getUpdatedFields(formState, emailSignature);
      if (!isUpdated) {
        message.info('No changes to save');
        return;
      }
      await dispatch(updateEmailSignature(updatedFields)).unwrap();
      message.success('Email signature settings saved successfully');
    } catch (error) {
      message.error(error || 'Failed to update email signature');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <InputSwitch
        name="includeEmailSignature"
        label="Include Email Signature"
        value={formState.includeEmailSignature}
        onChange={checked => updateField('includeEmailSignature', checked)}
        description={
          <div>
            <p>
              When turned ON, the system automatically adds the configured email signature to all
              customizable emails.
              <br />
              When turned OFF, customizable emails are sent without an email signature.
            </p>
          </div>
        }
      />

      {formState.includeEmailSignature && (
        <div className="space-y-2 mt-4">
          <div className="flex justify-end">
            <Select
              placeholder="Insert Personalization"
              style={{ width: 230 }}
              size="small"
              value={null}
              onSelect={insertTag}
            >
              {personalizationList.map(item => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </div>

          <RichTextEditor
            ref={editorRef}
            value={formState.signatureContent}
            onChange={(val: string) => updateField('signatureContent', val)}
            maxHeight="280px"
            placeholder="Write your email signature..."
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-3">
        <Button
          type="primary"
          onClick={() => setShowConfirm(true)}
          loading={status.update === Status.PENDING}
          disabled={status.update === Status.PENDING}
        >
          Save
        </Button>
      </div>

      <ConfirmationContentModal
        title="Confirm Save"
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onSubmit={() => {
          handleSave();
          setShowConfirm(false);
        }}
        okText="Yes"
        cancelText="No"
        content={<p>Are you sure you want to update this email signature?</p>}
      />
    </div>
  );
};

export default EmailSignatureSettings;
