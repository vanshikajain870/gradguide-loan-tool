'use client';

import React, { useState } from 'react';
import { UploadedDocument, DocumentCategory } from '../../types/assessment';
import { simulateDocumentExtraction } from '../../lib/documentExtraction';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  ScanText,
  Shield,
  FileCheck,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface StepDocumentsProps {
  documents: UploadedDocument[];
  onAddDocument: (doc: UploadedDocument) => void;
  onRemoveDocument: (docId: string) => void;
  onUpdateDocument: (doc: UploadedDocument) => void;
  onApplyExtractedValue: (category: DocumentCategory, fieldKey: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  pan_card: 'PAN Card (Student / Co-applicant)',
  proof_of_residence: 'Proof of Residence (Aadhaar / Voter ID / Passport / Utility Bill)',
  bank_statement: 'Bank Account Statement (Last 6 Months)',
  asset_liability_statement: 'Personal Asset & Liability Statement',
  academic_marksheets: 'Academic Marksheets (10th, 12th, Degree)',
  admission_proof: 'Proof of Admission & Course Duration',
  fee_structure: 'Official Fee Structure (I-20 for US)',
  test_scores: 'Test Scorecard (IELTS / GRE / GMAT / TOEFL)',
  university_ranking: 'University Ranking Print-out',
  salary_slips: 'Salary Slips (Last 3 Months)',
  form_16: 'Form 16 (Last 2 Years)',
  employer_id: 'Employer ID Card',
  itr: 'ITR Returns (2 or 3 Years)',
  balance_sheet_pnl: 'Balance Sheet & P&L Statement (Last 3 Years)',
  business_proof: 'Proof of Business Address',
  property_title_deed: 'Property Title Deed & Sale Agreement',
  registration_receipt: 'Original Registration Receipt',
  encumbrance_certificate: 'Encumbrance Certificate (EC - Last 30 Years)',
  ca_net_worth_certificate: 'CA Net Worth Certificate',
};

export const StepDocuments: React.FC<StepDocumentsProps> = ({
  documents,
  onAddDocument,
  onRemoveDocument,
  onUpdateDocument,
  onApplyExtractedValue,
  onNext,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('ca_net_worth_certificate');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeExtractionDoc, setActiveExtractionDoc] = useState<UploadedDocument | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    const file = files[0];

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(`File ${file.name} exceeds maximum allowed size of 10MB.`);
      return;
    }

    // Validate type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setUploadError(`Unsupported file format. Please upload PDF, PNG, or JPG.`);
      return;
    }

    const newDoc: UploadedDocument = {
      id: `doc-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      category: selectedCategory,
      uploadTimestamp: new Date().toISOString(),
      status: 'uploaded',
    };

    onAddDocument(newDoc);
    e.target.value = '';
  };

  const handleTriggerExtraction = (doc: UploadedDocument) => {
    const res = simulateDocumentExtraction(doc);
    if (res.success && Object.keys(res.extractedValues).length > 0) {
      const updatedDoc: UploadedDocument = {
        ...doc,
        status: 'extracted_review_needed',
        extractedValues: res.extractedValues,
      };
      onUpdateDocument(updatedDoc);
      setActiveExtractionDoc(updatedDoc);
    } else {
      alert(res.message);
    }
  };

  const handleConfirmExtractedField = (doc: UploadedDocument, fieldKey: string, val: any) => {
    onApplyExtractedValue(doc.category, fieldKey, val);
    const updatedDoc: UploadedDocument = {
      ...doc,
      status: 'verified',
      isUserConfirmed: true,
    };
    onUpdateDocument(updatedDoc);
    setActiveExtractionDoc(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Document Upload & Review</h2>
            <p className="text-xs text-slate-500">
              Upload required financial, academic, and property documents. Extracted data requires explicit user review before influencing loan assessment.
            </p>
          </div>
        </div>

        {/* Upload Form Area */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Document Category to Upload
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-sky-500 bg-white"
              >
                {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
                  <option key={cat} value={cat}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="cursor-pointer flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-sm">
                <UploadCloud className="w-4 h-4 mr-2" />
                Select File & Upload
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {uploadError && (
            <div className="mt-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-center">
              <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
              {uploadError}
            </div>
          )}

          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Supported formats: PDF, JPG, PNG (Max size: 10MB per file)</span>
            <span className="flex items-center text-slate-600">
              <Shield className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              Local storage simulation. No external server transmission.
            </span>
          </div>
        </div>

        {/* Uploaded Documents List */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Uploaded Document Repository ({documents.length} File(s))
          </h3>

          {documents.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
              No documents uploaded yet. Select a category above to attach required files.
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs hover:border-slate-300"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block truncate max-w-xs">
                        {doc.fileName}
                      </span>
                      <span className="text-[11px] font-medium text-slate-600 block">
                        Category: {CATEGORY_LABELS[doc.category]}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Size: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded: {new Date(doc.uploadTimestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {doc.status === 'verified' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleTriggerExtraction(doc)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                      >
                        <ScanText className="w-3.5 h-3.5 mr-1" />
                        Extract Values
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onRemoveDocument(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Extraction Review Workflow Modal / Card */}
        {activeExtractionDoc && activeExtractionDoc.extractedValues && (
          <div className="mt-6 bg-indigo-900 text-white rounded-2xl p-5 shadow-lg border border-indigo-700">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-indigo-700">
              <div className="flex items-center space-x-2">
                <ScanText className="w-5 h-5 text-indigo-300" />
                <h4 className="text-sm font-bold text-white">
                  Document Extraction Review-Before-Use Workflow
                </h4>
              </div>
              <span className="text-xs bg-indigo-800 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-600">
                User Verification Required
              </span>
            </div>

            <p className="text-xs text-indigo-200 mb-4">
              The following values were recognized from <strong>{activeExtractionDoc.fileName}</strong>. Review page evidence below before confirming update to your financial assessment state.
            </p>

            <div className="space-y-3">
              {Object.entries(activeExtractionDoc.extractedValues).map(([key, item]) => (
                <div key={key} className="bg-indigo-950/80 rounded-xl p-4 border border-indigo-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-indigo-300 block font-mono font-semibold uppercase">{key}</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {typeof item.value === 'number' ? `₹${item.value.toLocaleString('en-IN')}` : item.value}
                    </span>
                    <div className="text-[11px] text-indigo-200 mt-1 italic">
                      Evidence: {item.pageEvidence || 'Page 1 audit marker'} (Confidence: {Math.round(item.confidence * 100)}%)
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConfirmExtractedField(activeExtractionDoc, key, item.value)}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-md shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Confirm & Use Value
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back: Collateral
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-md"
        >
          Generate Full Loan Assessment
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};
