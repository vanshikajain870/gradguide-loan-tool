import { UploadedDocument, DocumentCategory } from '../types/assessment';

export interface ExtractionResult {
  documentId: string;
  category: DocumentCategory;
  extractedValues: Record<string, { value: string | number; confidence: number; pageEvidence?: string }>;
  success: boolean;
  message: string;
}

export function simulateDocumentExtraction(doc: UploadedDocument): ExtractionResult {
  if (doc.category === 'ca_net_worth_certificate') {
    return {
      documentId: doc.id,
      category: doc.category,
      success: true,
      message: 'CA Net Worth Certificate scanned successfully.',
      extractedValues: {
        caCertificateNetWorth: {
          value: 3000000,
          confidence: 0.96,
          pageEvidence: 'Page 1, Paragraph 2: "Net worth of co-applicant certified at INR 30,00,000/-"',
        },
        caMembershipNo: {
          value: 'CA-104928',
          confidence: 0.98,
          pageEvidence: 'Page 1, Seal/Signature block: "Membership No. 104928"',
        },
      },
    };
  }

  if (doc.category === 'salary_slips') {
    return {
      documentId: doc.id,
      category: doc.category,
      success: true,
      message: 'Salary Slip extracted successfully.',
      extractedValues: {
        coApplicantMonthlyIncome: {
          value: 75000,
          confidence: 0.94,
          pageEvidence: 'Page 1, Earnings Table line item: "Net Salary Payable: Rs. 75,000"',
        },
        employerName: {
          value: 'Tech Solutions Pvt Ltd',
          confidence: 0.99,
          pageEvidence: 'Page 1, Header: "Tech Solutions Pvt Ltd Salary Slip"',
        },
      },
    };
  }

  if (doc.category === 'bank_statement') {
    return {
      documentId: doc.id,
      category: doc.category,
      success: true,
      message: 'Bank Statement extracted successfully.',
      extractedValues: {
        savingsAllocated: {
          value: 400000,
          confidence: 0.88,
          pageEvidence: 'Page 3, Ending Balance: "Closing balance INR 4,00,000.00"',
        },
      },
    };
  }

  return {
    documentId: doc.id,
    category: doc.category,
    success: false,
    message: 'No automatic fields extracted for this document category. Please review or enter values manually.',
    extractedValues: {},
  };
}
