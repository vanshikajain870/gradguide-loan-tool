# GradGuide Education Loan Assessment Tool

An end-to-end, source-grounded **Education Loan Assessment Tool** designed for students and educational counsellors to evaluate study abroad finances, compute exact funding gaps and loan requirements, assess lender scheme eligibility against an authoritative reference dataset, and audit document readiness.

---

## 🌟 Key Application Highlights

- **100% Source-Grounded Lender Data**: Built on the authoritative GradGuide Lender Database (State Bank of India, Bank of Baroda, Bank of India, HDFC Credila, Auxilo Finserve). Unstated criteria (such as Credila/Auxilo CIBIL scores) are explicitly marked as `Requires Lender Confirmation` rather than assumed.
- **Deterministic Financial Calculation Engine**: Rigorous decimal financial arithmetic following non-overlapping funding rules. Includes unit test verification against the hiring assignment's exact synthetic regression benchmark.
- **Interactive 6-Step Workflow**: Seamless navigation across **Study Details → Funding → Financial Profile → Collateral → Documents → Assessment** with complete state persistence and backward editing support.
- **Review-Before-Use Document Extraction**: Simulated document scanning for ITRs, Bank Statements, and CA Net Worth Certificates featuring page evidence markers and explicit user confirmation before influencing assessments.
- **3 Original Value-Add Features**: Integrated **What-if Funding Planner**, **Financial Consistency Check Engine**, and **Lender-Specific Application Readiness Checklist**.

---

## 🚀 Quick Start & Local Run Instructions

### Prerequisites
- Node.js `v18.0.0` or higher (Tested on Node `v24.12.0`)
- npm `v9.0.0` or higher

### Installation & Launch

1. **Clone or Extract Repository**:
   ```bash
   git clone <repository-url>
   cd gradguide-loan-assessment
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Automated Test Suite (Vitest)**:
   ```bash
   npm test
   ```
   *Executes 9 automated unit tests including the hiring assignment regression benchmark.*

4. **Launch Local Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser to [http://localhost:3000](http://localhost:3000).

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📊 Financial Calculation Definitions & Contract

The application implements a strict, deterministic financial model:

1. **Total Study Cost**:
   $$\text{Total Study Cost} = \text{Full-Course Tuition} + \text{Full-Course Living Expenses} + \text{Full-Course Additional Expenses}$$
   *Annual expenses are automatically converted to full-course figures using the course duration ($D$ years).*

2. **Remaining Study Cost**:
   $$\text{Remaining Study Cost} = \max(0, \text{Total Study Cost} - \text{Fees Already Paid})$$
   *Fees already paid are deducted exactly once.*

3. **Available Funding**:
   $$\text{Available Funding} = \text{Education-Allocated Savings} + \text{Applicable Scholarships} + \text{Family Contribution}$$
   *Excludes funds already applied toward initial fees paid to prevent double deduction.*

4. **Estimated Loan Requirement**:
   $$\text{Estimated Loan Requirement} = \max(0, \text{Remaining Study Cost} - \text{Available Funding})$$

5. **Net Worth & Discrepancy Detection**:
   $$\text{Calculated Net Worth} = \text{Total Financial Assets} - \text{Total Outstanding Liabilities}$$
   *If a CA Net Worth Certificate figure is declared, discrepancies are flagged separately without overwriting either value.*

6. **Net Available Collateral**:
   $$\text{Net Collateral Value} = \max(0, \text{Gross Asset Market Value} - \text{Existing Encumbrances})$$

---

## 🧠 The 3 Original Features

### Feature 1: What-if Funding Planner
- **Problem Solved**: Students often wonder how prospective scholarships or additional family contributions would alter their required loan amount.
- **Why It Matters**: Enables instant financial scenario modeling without corrupting or overwriting original baseline form inputs.
- **How It Works**: Operates an isolated scenario state with real-time sliders for scholarship awards, savings deltas, and annual tuition variations. Provides side-by-side gap and loan delta comparisons.

### Feature 2: Financial Consistency Check Engine
- **Problem Solved**: Education loan applications are frequently delayed due to inconsistent figures (e.g., counting scholarships in savings, mixing annual/monthly income, or mismatches between CA certificates and declared assets).
- **Why It Matters**: Prevents credit application rejection by auditing input integrity prior to bank submission.
- **How It Works**: Scans inputs against 5 audit categories:
  - CA Net Worth Certificate vs itemized net worth discrepancies.
  - Double-counted scholarships vs fees already paid.
  - Monthly vs annual income period anomalies.
  - Collateral encumbrances vs total liabilities double-deductions.
  - Funding surplus conditions.
  *Outputs audit findings framed as review questions with actionable corrective guidance.*

### Feature 3: Lender-Specific Application Readiness Checklist
- **Problem Solved**: Mandatory document checklists differ significantly across lenders (SBI vs BOB vs BOI vs Credila vs Auxilo) and loan routes (Collateral vs Non-collateral).
- **Why It Matters**: Eliminates document rejection cycles and provides a clear readiness score percentage.
- **How It Works**: Dynamically generates required document lists based on target bank, scheme, co-applicant employment type (Salaried vs Self-Employed), and property state location (e.g. Delhi Conveyance Deed / Maharashtra Index II). Calculates a live readiness score percentage while displaying missing document categories.

---

## 🔬 Regression Verification Benchmark

The application passes all regression tests built into `src/__tests__/calculations.test.ts`:

| Parameter | Input Value | Result / Status |
| :--- | :--- | :--- |
| **Total Study Cost** | ₹30,00,000 | Verified |
| **Fees Already Paid** | ₹2,00,000 | Verified |
| **Expected Remaining Cost** | ₹2,80,000 | Verified ($\text{30L} - \text{2L}$) |
| **Education Savings** | ₹4,00,000 | Verified |
| **Applicable Scholarship** | ₹3,00,000 | Verified |
| **Family Contribution** | ₹1,00,000 | Verified |
| **Expected Available Funding** | ₹8,00,000 | Verified ($\text{4L} + \text{3L} + \text{1L}$) |
| **Expected Loan Requirement** | **₹20,00,000** | **PASSED REGRESSION TEST** |

---

## 🎥 Ready-to-Record Video Walkthrough Script

*Since live video recording hardware is unattached in this build environment, below is the ready-to-record walkthrough script:*

1. **[0:00 - 0:25] Introduction & Sample Profile**:
   - "Welcome to the GradGuide Education Loan Assessment Tool. Today we're evaluating a student applying for Columbia University's MS in CS program."
   - Click **Load Sample Data**. Highlight the top banner showing ₹30L total study cost and ₹20L estimated loan requirement.

2. **[0:25 - 0:50] Workflow Steps & Financial Profile**:
   - Navigate through **Study Details** → **Funding** → **Financial Profile**.
   - Show annual to full-course cost conversion.
   - Point out the CA Certificate Net Worth input (₹30L) matching the calculated net worth (₹35L assets − ₹5L liabilities).

3. **[0:50 - 1:20] Document Upload & Extraction Workflow**:
   - Move to **Documents**. Demonstrate the **Extract Values** feature on the CA Net Worth Certificate.
   - Show page evidence tags ("Page 1, Paragraph 2: INR 30,00,000/-") and click **Confirm & Use Value**.

4. **[1:20 - 2:00] Assessment & 3 Original Features**:
   - Go to **Assessment**. View the Lender Matrix comparing SBI (8.40% collateral / 9.40% top 100 non-collateral), BOB, BOI, Credila, and Auxilo.
   - Demonstrate **Feature 1: What-if Funding Planner** by adjusting the scholarship slider to see real-time loan reduction.
   - Highlight **Feature 2: Financial Consistency Check** and **Feature 3: Application Readiness Checklist**.

---

## ⚠️ Source Grounding, Limitations & Disclaimers

1. **Source Database Truth**: Lender rules, rates, and CIBIL thresholds are strictly grounded in the supplied assignment dataset ([Google Doc Link](https://docs.google.com/document/d/17NyIZxq7mtm_IfiW2HoAWUepetSCKJOQ5pWAps8e8Pc/edit?usp=sharing)).
2. **Unstated Criteria**: Minimum CIBIL scores for HDFC Credila and Auxilo are not stated in the source; they are explicitly flagged as `Requires Lender Confirmation`.
3. **Collateral LTV & Valuation**: Property assets declared are not assumed to be automatically approved. LTV ratios and legal title verification require bank empaneled valuer appraisal.
4. **Decision Support Disclaimer**: This tool is an assessment and decision-support application. It does not constitute or guarantee official loan approval or rejection by any bank or financial institution.
