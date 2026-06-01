import React, { useState, useRef, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import CryptoJS from 'crypto-js';

interface ExternalUploadPageProps {
  type: string;
  id: string | null;
}

interface PublicDetails {
  quotationNumber?: string;
  customerName?: string;
  projectName?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
}

export const getServerSideProps: GetServerSideProps<ExternalUploadPageProps> = async (context) => {
  const type = (context.query.Type as string) || (context.query.type as string) || '';
  const id = (context.query.id as string) || (context.query.quotationId as string) || null;

  return {
    props: {
      type,
      id,
    },
  };
};

export default function ExternalUploadPage({ type, id }: ExternalUploadPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [quotationDetails, setQuotationDetails] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [details, setDetails] = useState<PublicDetails | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchQuotationDetails();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setMessage(null);
    }
  };

  const fetchQuotationDetails = async () => {
    if (!id) return;

    try {
      setLoadingDetails(true);

      const secretKey = process.env.NEXT_PUBLIC_API_SECRET;
      const baseMessage = process.env.NEXT_PUBLIC_API_SECRET_TEXT;
      const secretMessage = `${baseMessage}|${Date.now()}`;

      const token = CryptoJS.AES.encrypt(secretMessage, secretKey).toString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/quotation/version/${id}/public-details`,
        {
          method: 'GET',
          headers: {
            'X-Secure-Access': token,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch details');
      }

      const data = await response.json();

      console.log("Quotation Details:", data.data);

      setQuotationDetails(data.data);
    } catch (error) {
      console.error('Fetch quotation details error:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({
        type: 'error',
        text: 'Please select a file to upload first.',
      });

      return;
    }

    const formData = new FormData();

    formData.append('pdf', file);
    formData.append('type', type);

    if (id) {
      formData.append('id', id);
    }

    const secretKey = process.env.NEXT_PUBLIC_API_SECRET || '';
    const baseMessage = process.env.NEXT_PUBLIC_API_SECRET_TEXT || '';
    const secretMessage = `${baseMessage}|${Date.now()}`;

    const token = CryptoJS.AES.encrypt(
      secretMessage,
      secretKey
    ).toString();

    setUploading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/quotation/version/${id}/structure-engineer-report`,
        {
          method: 'POST',
          headers: {
            'X-Secure-Access': token,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      await response.json();
      setIsSubmitted(true);

      setFile(null);

      setMessage({
        type: 'success',
        text: 'Report uploaded successfully.',
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);

      setMessage({
        type: 'error',
        text: 'An error occurred while uploading the report.',
      });
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // STRUCTURAL ENGINEER PAGE
  // =========================
  if (type?.toLowerCase() === 'structuralengineer') {
    const canUpload = quotationDetails?.is_uploaded;
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Head>
          <title>Upload Structural Report | CRMSimplify</title>
        </Head>

        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 shadow-sm w-full sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <Image
                  src="/company-light.webp"
                  alt="InBuildify Logo"
                  width={150}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-4 lg:p-6 overflow-hidden">
          <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">

            <div className="grid lg:grid-cols-[1.1fr_0.9fr] min-h-[650px]">

              {/* LEFT PANEL */}
              <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-orange-50 text-orange-600 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Structural Report Upload
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Upload structural engineer report securely
                    </p>
                  </div>
                </div>

                {/* Project Details */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">

                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-semibold text-gray-900">
                      Project Details
                    </h3>
                  </div>

                  {loadingDetails ? (
                    <div className="text-sm text-gray-500">
                      Loading details...
                    </div>
                  ) : quotationDetails ? (
                    <div className="space-y-5">

                      {/* Builder */}
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                          Builder
                        </p>

                        <p className="text-lg font-semibold text-gray-900">
                          {quotationDetails?.builder_name || '-'}
                        </p>
                      </div>

                      {/* Property Grid */}
                      <div className="grid grid-cols-2 gap-3">

                        <div className="bg-white rounded-xl border border-gray-100 p-3">
                          <p className="text-xs text-gray-400 mb-1">Lot</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {quotationDetails?.property_details?.lot_number || '-'}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-3">
                          <p className="text-xs text-gray-400 mb-1">Zip</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {quotationDetails?.property_details?.zip_code || '-'}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-3">
                          <p className="text-xs text-gray-400 mb-1">Street</p>
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {quotationDetails?.property_details?.street || '-'}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-3">
                          <p className="text-xs text-gray-400 mb-1">City</p>
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {quotationDetails?.property_details?.city || '-'}
                          </p>
                        </div>

                      </div>

                      {/* Address */}
                      <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-xs text-gray-400 mb-2">
                          Full Address
                        </p>

                        <p className="text-sm leading-6 text-gray-700">
                          {[
                            quotationDetails?.property_details?.address_line1,
                            quotationDetails?.property_details?.address_line2,
                            quotationDetails?.property_details?.street,
                            quotationDetails?.property_details?.city,
                            quotationDetails?.property_details?.zip_code,
                          ]
                            .filter(Boolean)
                            .join(', ') || '-'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-red-500">
                      Failed to load details
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="p-6 lg:p-8 bg-gradient-to-b from-white to-gray-50 flex flex-col justify-center">

                {message && (
                  <div
                    className={`mb-5 p-4 rounded-xl text-sm border ${message.type === 'success'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                  >
                    {message.text}
                  </div>
                )}

                {!loadingDetails && quotationDetails && (canUpload || isSubmitted) ? (
                  <div className="border border-green-200 bg-green-50 rounded-2xl p-8 text-center">

                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>

                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      Report Submitted
                    </h3>

                    <p className="text-sm text-green-700 leading-6">
                      The structural engineer report has already been uploaded successfully.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Upload Box */}
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-white hover:border-orange-400 hover:bg-orange-50/30 transition-all cursor-pointer group"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >

                      <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center mb-4 transition-all">
                        <svg
                          className="w-8 h-8 text-gray-500 group-hover:text-orange-600 transition-all"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>

                      <h3 className="text-base font-semibold text-gray-800 mb-1">
                        Upload PDF Report
                      </h3>

                      <p className="text-sm text-gray-500 text-center">
                        Drag & drop your file here or click to browse
                      </p>

                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,application/pdf"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </div>

                    {/* Selected File */}
                    {file && (
                      <div className="mt-5 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>

                          <div className="overflow-hidden">
                            <p className="text-sm font-medium text-blue-800 truncate">
                              {file.name}
                            </p>

                            <p className="text-xs text-blue-500">
                              Ready to upload
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <button
                      onClick={handleUpload}
                      disabled={!file || uploading}
                      className={`mt-5 w-full py-4 rounded-xl font-semibold transition-all ${!file || uploading
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200'
                        }`}
                    >
                      {uploading ? 'Uploading Report...' : 'Submit Report'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // INVALID TYPE
  // =========================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      <Head>
        <title>Invalid Link | CRMSimplify</title>
      </Head>

      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border-t-4 border-red-500">
        <svg
          className="w-16 h-16 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Invalid Link
        </h2>

        <p className="text-gray-600">
          The upload link provided is invalid, unrecognized, or has expired.
        </p>
      </div>
    </div>
  );
}