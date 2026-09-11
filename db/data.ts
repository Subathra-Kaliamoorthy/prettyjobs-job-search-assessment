// This module must stay free of any runtime Drizzle import: the frontend
// imports the filter vocabularies below, and pulling schema.ts in would drag
// the ORM into the browser bundle.

export const JOB_TYPES = ['full-time', 'part-time', 'contract', 'remote'] as const;
export const EXPERIENCE_LEVELS = ['entry', 'mid', 'senior', 'lead'] as const;

export type JobType = (typeof JOB_TYPES)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export type Role = {
  title: string;
  /** Used instead of "Lead {title}" where that would read wrong. */
  leadTitle?: string;
  skills: string[];
  /** Mid-level annual band in INR; other levels are scaled from this. */
  salary: [number, number];
  levels: ExperienceLevel[];
  jobTypes: JobType[];
  summary: string;
};

export type Industry = {
  name: string;
  companies: string[];
  roles: Role[];
  /** Slots in the generator's rotation. Default 1. Technology carries a
   *  higher weight because software roles dominate real job boards. */
  weight?: number;
};

// Shorthands to keep the table below readable.
const ALL: ExperienceLevel[] = ['entry', 'mid', 'senior', 'lead'];
const NO_ENTRY: ExperienceLevel[] = ['mid', 'senior', 'lead'];
const SENIOR_UP: ExperienceLevel[] = ['senior', 'lead'];
const JUNIOR: ExperienceLevel[] = ['entry', 'mid'];
const LEAD_ONLY: ExperienceLevel[] = ['lead'];
const DESK: JobType[] = ['full-time', 'part-time', 'contract', 'remote'];
const ONSITE: JobType[] = ['full-time', 'part-time', 'contract'];
const FT: JobType[] = ['full-time'];

export const LOCATIONS = [
  'Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Gurugram', 'Noida',
  'Kochi', 'Coimbatore', 'Jaipur', 'Chandigarh', 'Indore',
];

export const INDUSTRIES: Industry[] = [
  {
    name: 'Technology & Software',
    weight: 4,
    companies: ['Infosys', 'TCS', 'Wipro', 'HCLTech', 'Tech Mahindra', 'Zoho', 'Freshworks', 'Razorpay', 'Swiggy', 'Zomato', 'Flipkart', 'PhonePe', 'CRED', 'Google India', 'Microsoft India', 'Amazon India', 'Adobe India', 'Oracle India', 'SAP Labs India', 'Salesforce India'],
    roles: [
      { title: 'Software Engineer', leadTitle: 'Engineering Manager', skills: ['Java', 'Python', 'Data Structures', 'System Design', 'Git', 'REST APIs', 'Microservices', 'Unit Testing', 'Agile'], salary: [1200000, 2100000], levels: ALL, jobTypes: DESK, summary: 'design, build and ship software across our product stack' },
      { title: 'Software Developer', skills: ['Java', 'C#', 'JavaScript', 'SQL', 'Git', 'OOP', 'Debugging', 'REST APIs'], salary: [1000000, 1800000], levels: ALL, jobTypes: DESK, summary: 'develop and maintain features across our applications' },
      { title: 'Full Stack Developer', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs', 'Express.js', 'MongoDB', 'Git'], salary: [1200000, 2100000], levels: ALL, jobTypes: DESK, summary: 'own features end to end, from database schema to UI' },
      { title: 'Backend Engineer', skills: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'Docker', 'AWS', 'Microservices', 'Redis', 'GraphQL'], salary: [1200000, 2000000], levels: ALL, jobTypes: DESK, summary: 'design and ship the services that power our core platform' },
      { title: 'Frontend Engineer', skills: ['React', 'TypeScript', 'CSS', 'Next.js', 'Angular', 'Vue.js', 'Testing Library', 'Accessibility', 'Webpack'], salary: [1100000, 1900000], levels: ALL, jobTypes: DESK, summary: 'build fast, accessible interfaces used by millions' },
      { title: 'Java Developer', skills: ['Java', 'Spring Boot', 'Hibernate', 'Maven', 'JUnit', 'Microservices', 'SQL', 'Kafka'], salary: [1100000, 1900000], levels: ALL, jobTypes: DESK, summary: 'build enterprise services on the JVM stack' },
      { title: 'Python Developer', skills: ['Python', 'Django', 'Flask', 'FastAPI', 'PostgreSQL', 'Celery', 'REST APIs', 'Pytest'], salary: [1100000, 1900000], levels: ALL, jobTypes: DESK, summary: 'build backend services and automation in Python' },
      { title: '.NET Developer', skills: ['C#', '.NET Core', 'ASP.NET', 'Entity Framework', 'SQL Server', 'Azure', 'LINQ'], salary: [1000000, 1800000], levels: ALL, jobTypes: DESK, summary: 'deliver business applications on the .NET platform' },
      { title: 'Mobile Developer', skills: ['React Native', 'Kotlin', 'Swift', 'Flutter', 'REST APIs', 'Firebase', 'Android SDK'], salary: [1100000, 1900000], levels: ALL, jobTypes: DESK, summary: 'craft our Android and iOS experience end to end' },
      { title: 'DevOps Engineer', skills: ['Kubernetes', 'Terraform', 'CI/CD', 'AWS', 'Linux', 'Prometheus', 'Ansible', 'Jenkins', 'Docker'], salary: [1400000, 2300000], levels: NO_ENTRY, jobTypes: DESK, summary: 'own our deployment pipelines and production reliability' },
      { title: 'Cloud Engineer', skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'Networking', 'IAM', 'Cost Optimisation'], salary: [1400000, 2400000], levels: NO_ENTRY, jobTypes: DESK, summary: 'design and run our cloud infrastructure' },
      { title: 'Site Reliability Engineer', skills: ['Observability', 'Incident Response', 'Kubernetes', 'Go', 'Linux', 'Terraform', 'SLOs'], salary: [1600000, 2700000], levels: NO_ENTRY, jobTypes: DESK, summary: 'keep production fast, observable and resilient' },
      { title: 'Machine Learning Engineer', skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Pandas', 'Model Deployment', 'SQL'], salary: [1600000, 2800000], levels: NO_ENTRY, jobTypes: DESK, summary: 'take models from notebook to production' },
      { title: 'Data Engineer', skills: ['Spark', 'Airflow', 'SQL', 'Python', 'Kafka', 'Snowflake', 'ETL', 'dbt'], salary: [1300000, 2200000], levels: NO_ENTRY, jobTypes: DESK, summary: 'build the pipelines that move and shape our data' },
      { title: 'QA Engineer', leadTitle: 'QA Manager', skills: ['Selenium', 'Manual Testing', 'Test Automation', 'JIRA', 'API Testing', 'Cypress', 'Playwright'], salary: [600000, 1100000], levels: ALL, jobTypes: DESK, summary: 'safeguard release quality across web and mobile' },
      { title: 'Security Engineer', skills: ['Application Security', 'Penetration Testing', 'OWASP', 'Threat Modelling', 'SIEM', 'Cryptography'], salary: [1500000, 2500000], levels: NO_ENTRY, jobTypes: DESK, summary: 'find and close security gaps before attackers do' },
      { title: 'Database Administrator', skills: ['PostgreSQL', 'MySQL', 'Query Optimisation', 'Backup and Recovery', 'Replication', 'SQL Server'], salary: [1000000, 1800000], levels: NO_ENTRY, jobTypes: DESK, summary: 'keep our databases fast, backed up and available' },
      { title: 'UI/UX Designer', leadTitle: 'Design Lead', skills: ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems', 'Usability Testing'], salary: [800000, 1600000], levels: ALL, jobTypes: DESK, summary: 'design product experiences people find obvious to use' },
      { title: 'Product Manager', leadTitle: 'Head of Product', skills: ['Roadmapping', 'User Research', 'Analytics', 'Agile', 'Stakeholder Management', 'A/B Testing'], salary: [1800000, 3000000], levels: NO_ENTRY, jobTypes: DESK, summary: 'define what we build next and why it matters' },
    ],
  },
  {
    name: 'Healthcare & Medical',
    companies: ['Apollo Hospitals', 'Fortis Healthcare', 'Manipal Hospitals', 'Max Healthcare', 'Narayana Health', 'Medanta', 'Columbia Asia'],
    roles: [
      { title: 'Registered Nurse', leadTitle: 'Nurse Manager', skills: ['Patient Care', 'IV Therapy', 'EMR', 'Triage', 'Wound Care', 'Vital Monitoring', 'Infection Control'], salary: [350000, 600000], levels: ALL, jobTypes: ONSITE, summary: 'deliver bedside care across our inpatient wards' },
      { title: 'Radiologist', skills: ['MRI', 'CT Imaging', 'Ultrasound', 'PACS', 'Diagnostic Reporting', 'Radiation Safety'], salary: [2400000, 4000000], levels: NO_ENTRY, jobTypes: FT, summary: 'read and report diagnostic imaging for our clinical teams' },
      { title: 'Physiotherapist', skills: ['Rehabilitation', 'Manual Therapy', 'Exercise Prescription', 'Sports Injury', 'Patient Assessment'], salary: [400000, 750000], levels: ALL, jobTypes: ONSITE, summary: 'plan and run rehabilitation programmes for our patients' },
      { title: 'Lab Technician', leadTitle: 'Laboratory Manager', skills: ['Sample Collection', 'Biochemistry', 'Microbiology', 'Lab Safety', 'Quality Control', 'LIMS'], salary: [300000, 550000], levels: ALL, jobTypes: ONSITE, summary: 'run diagnostic assays and maintain lab quality standards' },
      { title: 'Hospital Administrator', skills: ['Operations', 'NABH Accreditation', 'Budgeting', 'Staff Scheduling', 'Vendor Management'], salary: [800000, 1500000], levels: NO_ENTRY, jobTypes: FT, summary: 'keep clinical operations running smoothly day to day' },
      { title: 'Pharmacist', leadTitle: 'Chief Pharmacist', skills: ['Dispensing', 'Drug Interactions', 'Inventory Management', 'Prescription Review', 'Pharmacovigilance'], salary: [350000, 650000], levels: ALL, jobTypes: ONSITE, summary: 'manage dispensing and medication safety across departments' },
    ],
  },
  {
    name: 'Finance & Banking',
    companies: ['HDFC Bank', 'ICICI Bank', 'Kotak Mahindra Bank', 'Axis Bank', 'Zerodha', 'Goldman Sachs India', 'Bajaj Finserv', 'State Bank of India'],
    roles: [
      { title: 'Credit Analyst', skills: ['Credit Risk', 'Financial Modelling', 'Underwriting', 'Excel', 'Due Diligence', 'Basel Norms'], salary: [800000, 1400000], levels: ALL, jobTypes: DESK, summary: 'assess borrower risk and structure lending decisions' },
      { title: 'Relationship Manager', leadTitle: 'Regional Head - Banking', skills: ['Client Servicing', 'Cross Selling', 'Portfolio Management', 'KYC', 'Wealth Advisory'], salary: [700000, 1300000], levels: ALL, jobTypes: FT, summary: 'grow and retain a portfolio of priority banking clients' },
      { title: 'Risk Analyst', skills: ['Market Risk', 'Value at Risk', 'SQL', 'Regulatory Reporting', 'Stress Testing', 'Python'], salary: [1000000, 1800000], levels: NO_ENTRY, jobTypes: DESK, summary: 'model and monitor exposure across our trading book' },
      { title: 'Investment Banker', skills: ['Mergers and Acquisitions', 'Valuation', 'Pitch Decks', 'Financial Modelling', 'Capital Markets'], salary: [2200000, 4000000], levels: NO_ENTRY, jobTypes: FT, summary: 'execute mandates across M&A and capital raising' },
      { title: 'Branch Manager', skills: ['Team Leadership', 'Sales Targets', 'Compliance', 'Customer Retention', 'Operations'], salary: [1100000, 1900000], levels: SENIOR_UP, jobTypes: FT, summary: 'run a full-service branch and its sales performance' },
      { title: 'Accountant', leadTitle: 'Finance Controller', skills: ['Tally', 'GST', 'Reconciliation', 'Accounts Payable', 'TDS', 'Financial Reporting'], salary: [450000, 900000], levels: ALL, jobTypes: DESK, summary: 'own the books, filings and month-end close' },
    ],
  },
  {
    name: 'Education & Training',
    companies: ['BYJUS', 'Unacademy', 'Vedantu', 'Amity University', 'Delhi Public School', 'Aakash Institute', 'upGrad'],
    roles: [
      { title: 'Mathematics Teacher', leadTitle: 'Head of Department - Mathematics', skills: ['Lesson Planning', 'CBSE Curriculum', 'Classroom Management', 'Assessment Design', 'Student Mentoring'], salary: [400000, 800000], levels: ALL, jobTypes: ONSITE, summary: 'teach mathematics across senior secondary sections' },
      { title: 'Academic Counsellor', skills: ['Student Advising', 'CRM', 'Admissions', 'Career Guidance', 'Communication'], salary: [350000, 700000], levels: ALL, jobTypes: DESK, summary: 'guide prospective learners through programme selection' },
      { title: 'Curriculum Designer', skills: ['Instructional Design', 'Content Development', 'Assessment Design', 'EdTech Tools', 'Research'], salary: [700000, 1300000], levels: NO_ENTRY, jobTypes: DESK, summary: 'build learning paths and assessment frameworks' },
      { title: 'Content Developer', skills: ['Subject Writing', 'Editing', 'Question Banks', 'Research', 'Proofreading'], salary: [450000, 900000], levels: ALL, jobTypes: DESK, summary: 'author study material and practice content at scale' },
      { title: 'Lab Assistant', skills: ['Equipment Handling', 'Lab Safety', 'Inventory', 'Practical Setup', 'Record Keeping'], salary: [220000, 400000], levels: JUNIOR, jobTypes: ONSITE, summary: 'prepare and maintain science laboratories for practicals' },
      { title: 'School Principal', skills: ['School Leadership', 'Staff Development', 'Regulatory Compliance', 'Parent Engagement', 'Budgeting'], salary: [1500000, 2600000], levels: LEAD_ONLY, jobTypes: FT, summary: 'lead academic strategy and school administration' },
    ],
  },
  {
    name: 'Retail & E-commerce',
    companies: ['Reliance Retail', 'Amazon India', 'Myntra', 'Nykaa', 'DMart', 'Tata Cliq', 'Shoppers Stop', 'Croma'],
    roles: [
      { title: 'Store Manager', skills: ['Retail Operations', 'Team Leadership', 'Inventory Management', 'Sales Targets', 'Visual Merchandising'], salary: [600000, 1200000], levels: NO_ENTRY, jobTypes: FT, summary: 'run day-to-day store operations and hit revenue targets' },
      { title: 'Category Manager', skills: ['Assortment Planning', 'Vendor Negotiation', 'Pricing Strategy', 'Margin Analysis', 'Excel'], salary: [1200000, 2200000], levels: NO_ENTRY, jobTypes: DESK, summary: 'own assortment, pricing and margin for your category' },
      { title: 'Visual Merchandiser', skills: ['Store Layout', 'Window Display', 'Planogram', 'Brand Guidelines', 'Styling'], salary: [400000, 800000], levels: ALL, jobTypes: ONSITE, summary: 'shape how our stores look and how product is presented' },
      { title: 'Supply Planner', skills: ['Demand Forecasting', 'Replenishment', 'SAP', 'Excel', 'Stock Analysis'], salary: [700000, 1300000], levels: NO_ENTRY, jobTypes: DESK, summary: 'forecast demand and keep stock at the right places' },
      { title: 'Cashier', leadTitle: 'Cash Office Supervisor', skills: ['POS Systems', 'Cash Handling', 'Customer Service', 'Billing', 'Reconciliation'], salary: [200000, 350000], levels: JUNIOR, jobTypes: ONSITE, summary: 'handle billing and front-of-store customer service' },
      { title: 'E-commerce Executive', skills: ['Catalogue Management', 'Marketplace Operations', 'Order Management', 'Excel', 'Product Listing'], salary: [400000, 800000], levels: ALL, jobTypes: DESK, summary: 'manage listings and order flow across marketplaces' },
    ],
  },
  {
    name: 'Manufacturing & Industrial',
    companies: ['Tata Steel', 'Mahindra & Mahindra', 'Bosch India', 'Larsen & Toubro', 'Ashok Leyland', 'Godrej & Boyce', 'Hero MotoCorp'],
    roles: [
      { title: 'Production Supervisor', leadTitle: 'Production Manager', skills: ['Shop Floor Management', 'Lean Manufacturing', 'Shift Planning', 'Safety Compliance', 'OEE'], salary: [500000, 950000], levels: NO_ENTRY, jobTypes: FT, summary: 'oversee shift output, manpower and line efficiency' },
      { title: 'Quality Inspector', leadTitle: 'Quality Head', skills: ['Quality Control', 'ISO 9001', 'Six Sigma', 'Root Cause Analysis', 'Measurement Tools'], salary: [400000, 800000], levels: ALL, jobTypes: FT, summary: 'inspect output and drive corrective action on defects' },
      { title: 'Maintenance Engineer', skills: ['Preventive Maintenance', 'Hydraulics', 'PLC', 'Troubleshooting', 'Breakdown Analysis'], salary: [550000, 1000000], levels: ALL, jobTypes: FT, summary: 'keep plant machinery running with minimum downtime' },
      { title: 'CNC Operator', leadTitle: 'Machine Shop Supervisor', skills: ['CNC Programming', 'Blueprint Reading', 'Tooling', 'GD&T', 'Machining'], salary: [300000, 600000], levels: JUNIOR, jobTypes: FT, summary: 'set up and run CNC machines to spec' },
      { title: 'Industrial Designer', skills: ['CAD', 'SolidWorks', 'Prototyping', 'Design for Manufacture', '3D Modelling'], salary: [700000, 1400000], levels: NO_ENTRY, jobTypes: ONSITE, summary: 'design products that are buildable at scale' },
      { title: 'Plant Manager', skills: ['Plant Operations', 'P&L Ownership', 'Industrial Relations', 'Capacity Planning', 'EHS'], salary: [2000000, 3500000], levels: LEAD_ONLY, jobTypes: FT, summary: 'own end-to-end performance of the manufacturing unit' },
    ],
  },
  {
    name: 'Construction & Real Estate',
    companies: ['DLF', 'Godrej Properties', 'Prestige Group', 'Sobha Limited', 'Brigade Group', 'Oberoi Realty', 'Puravankara'],
    roles: [
      { title: 'Civil Engineer', leadTitle: 'Project Manager - Civil', skills: ['AutoCAD', 'Structural Analysis', 'Site Execution', 'Bar Bending Schedule', 'Quality Audits'], salary: [500000, 1100000], levels: ALL, jobTypes: ONSITE, summary: 'execute structural work packages on active sites' },
      { title: 'Site Supervisor', skills: ['Site Coordination', 'Labour Management', 'Safety Compliance', 'Material Tracking', 'Daily Reporting'], salary: [350000, 700000], levels: JUNIOR, jobTypes: FT, summary: 'coordinate contractors and daily progress on site' },
      { title: 'Architect', leadTitle: 'Principal Architect', skills: ['Revit', 'AutoCAD', 'Design Development', 'Building Codes', 'SketchUp', '3D Visualisation'], salary: [700000, 1500000], levels: ALL, jobTypes: ONSITE, summary: 'take designs from concept through construction drawings' },
      { title: 'Quantity Surveyor', skills: ['BOQ Preparation', 'Cost Estimation', 'Tendering', 'Contract Administration', 'Rate Analysis'], salary: [600000, 1200000], levels: ALL, jobTypes: ONSITE, summary: 'control project cost from tender to final account' },
      { title: 'Property Consultant', leadTitle: 'Sales Head - Real Estate', skills: ['Client Advisory', 'Site Visits', 'Negotiation', 'CRM', 'Market Research'], salary: [450000, 1000000], levels: ALL, jobTypes: FT, summary: 'guide buyers through inventory and close sales' },
      { title: 'MEP Engineer', skills: ['HVAC Design', 'Electrical Layout', 'Plumbing Design', 'Load Calculation', 'Coordination Drawings'], salary: [600000, 1200000], levels: NO_ENTRY, jobTypes: ONSITE, summary: 'design and coordinate mechanical, electrical and plumbing systems' },
    ],
  },
  {
    name: 'Hospitality & Travel',
    companies: ['Taj Hotels', 'The Oberoi Group', 'OYO Rooms', 'MakeMyTrip', 'Marriott India', 'IndiGo', 'ITC Hotels'],
    roles: [
      { title: 'Chef', leadTitle: 'Executive Chef', skills: ['Menu Planning', 'Food Costing', 'HACCP', 'Kitchen Management', 'Continental Cuisine', 'Plating'], salary: [450000, 1100000], levels: ALL, jobTypes: FT, summary: 'run a kitchen section and maintain food standards' },
      { title: 'Front Office Executive', leadTitle: 'Front Office Manager', skills: ['Guest Relations', 'Check-in Systems', 'Opera PMS', 'Complaint Handling', 'Upselling'], salary: [300000, 700000], levels: ALL, jobTypes: FT, summary: 'own the guest arrival and departure experience' },
      { title: 'Travel Consultant', skills: ['Itinerary Planning', 'GDS Amadeus', 'Ticketing', 'Visa Documentation', 'Customer Service'], salary: [350000, 750000], levels: ALL, jobTypes: DESK, summary: 'build and sell itineraries for leisure and corporate travel' },
      { title: 'Housekeeping Supervisor', leadTitle: 'Executive Housekeeper', skills: ['Room Inspection', 'Inventory Control', 'Staff Rostering', 'Hygiene Standards', 'Laundry Operations'], salary: [280000, 600000], levels: JUNIOR, jobTypes: FT, summary: 'maintain room readiness and cleanliness standards' },
      { title: 'Cabin Crew', leadTitle: 'Cabin Crew Manager', skills: ['In-flight Service', 'Safety Procedures', 'First Aid', 'Customer Handling', 'Grooming Standards'], salary: [400000, 900000], levels: JUNIOR, jobTypes: FT, summary: 'deliver safe, warm in-flight service on every sector' },
      { title: 'Banquet Manager', skills: ['Event Operations', 'Vendor Coordination', 'Budgeting', 'Client Briefing', 'Team Leadership'], salary: [600000, 1200000], levels: SENIOR_UP, jobTypes: FT, summary: 'deliver weddings, conferences and large-format events' },
    ],
  },
  {
    name: 'Logistics & Supply Chain',
    companies: ['Delhivery', 'Blue Dart', 'DHL India', 'Maersk India', 'Ecom Express', 'Gati', 'Safexpress'],
    roles: [
      { title: 'Warehouse Manager', skills: ['Warehouse Operations', 'WMS', 'Inventory Accuracy', 'Manpower Planning', '5S', 'Safety'], salary: [600000, 1200000], levels: NO_ENTRY, jobTypes: FT, summary: 'run inbound, storage and outbound across the facility' },
      { title: 'Logistics Coordinator', skills: ['Shipment Tracking', 'Freight Booking', 'Documentation', 'Vendor Coordination', 'Excel'], salary: [350000, 700000], levels: ALL, jobTypes: FT, summary: 'coordinate movements and keep shipments on schedule' },
      { title: 'Fleet Supervisor', leadTitle: 'Fleet Manager', skills: ['Route Planning', 'Driver Management', 'Vehicle Maintenance', 'Fuel Analysis', 'GPS Tracking'], salary: [400000, 850000], levels: JUNIOR, jobTypes: FT, summary: 'keep the fleet moving, compliant and cost-efficient' },
      { title: 'Customs Executive', skills: ['Import Documentation', 'Export Compliance', 'HS Codes', 'Customs Clearance', 'EDI Filing'], salary: [400000, 850000], levels: ALL, jobTypes: FT, summary: 'clear consignments and keep trade documentation clean' },
      { title: 'Procurement Officer', leadTitle: 'Head of Procurement', skills: ['Vendor Sourcing', 'Negotiation', 'Purchase Orders', 'SAP MM', 'Cost Reduction'], salary: [600000, 1300000], levels: ALL, jobTypes: DESK, summary: 'source suppliers and negotiate commercial terms' },
      { title: 'Supply Chain Analyst', skills: ['Demand Planning', 'SQL', 'Excel', 'Power BI', 'Network Optimisation'], salary: [700000, 1400000], levels: NO_ENTRY, jobTypes: DESK, summary: 'turn operational data into better network decisions' },
    ],
  },
  {
    name: 'Legal & Compliance',
    companies: ['Khaitan & Co', 'AZB & Partners', 'Cyril Amarchand Mangaldas', 'Trilegal', 'Shardul Amarchand Mangaldas', 'JSA Advocates'],
    roles: [
      { title: 'Corporate Lawyer', leadTitle: 'Partner - Corporate', skills: ['Contract Drafting', 'Mergers and Acquisitions', 'Due Diligence', 'Corporate Governance', 'Legal Research'], salary: [1200000, 2500000], levels: NO_ENTRY, jobTypes: FT, summary: 'advise clients on transactions and corporate structuring' },
      { title: 'Legal Associate', skills: ['Legal Research', 'Drafting', 'Case Preparation', 'Client Communication', 'Litigation Support'], salary: [600000, 1200000], levels: JUNIOR, jobTypes: FT, summary: 'support matters from research through to filings' },
      { title: 'Compliance Officer', leadTitle: 'Head of Compliance', skills: ['Regulatory Compliance', 'AML', 'Policy Drafting', 'Internal Audit', 'Risk Assessment'], salary: [900000, 1800000], levels: NO_ENTRY, jobTypes: DESK, summary: 'keep the business inside its regulatory perimeter' },
      { title: 'Paralegal', skills: ['Document Review', 'Case Filing', 'Legal Databases', 'Records Management', 'Proofreading'], salary: [350000, 700000], levels: JUNIOR, jobTypes: DESK, summary: 'prepare, review and manage case documentation' },
      { title: 'Contract Manager', skills: ['Contract Lifecycle', 'Negotiation', 'Vendor Agreements', 'Risk Review', 'Renewals'], salary: [1000000, 1900000], levels: NO_ENTRY, jobTypes: DESK, summary: 'own contracts from negotiation through renewal' },
      { title: 'Company Secretary', skills: ['Companies Act', 'Board Meetings', 'ROC Filings', 'Corporate Governance', 'Statutory Registers'], salary: [800000, 1600000], levels: ALL, jobTypes: FT, summary: 'run board processes and statutory compliance' },
    ],
  },
  {
    name: 'Marketing & Advertising',
    companies: ['Ogilvy India', 'Dentsu India', 'Madison World', 'Schbang', 'Wunderman Thompson', 'Leo Burnett India'],
    roles: [
      { title: 'Brand Manager', leadTitle: 'Head of Brand', skills: ['Brand Strategy', 'Campaign Planning', 'Market Research', 'Budgeting', 'Go To Market'], salary: [1200000, 2200000], levels: NO_ENTRY, jobTypes: DESK, summary: 'own brand positioning and campaign outcomes' },
      { title: 'SEO Specialist', skills: ['Keyword Research', 'Technical SEO', 'Google Analytics', 'Link Building', 'Content Strategy', 'Ahrefs'], salary: [500000, 1100000], levels: ALL, jobTypes: DESK, summary: 'grow organic traffic across our web properties' },
      { title: 'Copywriter', leadTitle: 'Creative Director', skills: ['Copywriting', 'Concept Development', 'Storytelling', 'Editing', 'Brand Voice'], salary: [450000, 1000000], levels: ALL, jobTypes: DESK, summary: 'write the words that carry the campaign' },
      { title: 'Media Planner', skills: ['Media Buying', 'Audience Planning', 'Budget Allocation', 'Campaign Analytics', 'Negotiation'], salary: [600000, 1300000], levels: ALL, jobTypes: DESK, summary: 'plan and buy media that reaches the right audience' },
      { title: 'Performance Marketer', skills: ['Google Ads', 'Meta Ads', 'Conversion Optimisation', 'Attribution', 'Analytics', 'ROAS'], salary: [700000, 1500000], levels: ALL, jobTypes: DESK, summary: 'run paid acquisition against hard efficiency targets' },
      { title: 'Social Media Manager', skills: ['Content Calendar', 'Community Management', 'Influencer Outreach', 'Analytics', 'Copywriting'], salary: [450000, 1000000], levels: ALL, jobTypes: DESK, summary: 'grow and engage our audience across platforms' },
    ],
  },
  {
    name: 'Media & Entertainment',
    companies: ['Netflix India', 'Zee Entertainment', 'Sony Pictures Networks', 'The Times Group', 'Dharma Productions', 'JioCinema'],
    roles: [
      { title: 'Video Editor', leadTitle: 'Post Production Head', skills: ['Premiere Pro', 'After Effects', 'Colour Grading', 'DaVinci Resolve', 'Storytelling'], salary: [450000, 1100000], levels: ALL, jobTypes: DESK, summary: 'cut footage into finished, on-brand stories' },
      { title: 'Content Producer', skills: ['Production Planning', 'Budgeting', 'Crew Coordination', 'Scripting', 'Scheduling'], salary: [700000, 1600000], levels: NO_ENTRY, jobTypes: ONSITE, summary: 'take productions from brief to delivered cut' },
      { title: 'Motion Designer', skills: ['After Effects', 'Cinema 4D', 'Animation', 'Typography', 'Storyboarding'], salary: [500000, 1200000], levels: ALL, jobTypes: DESK, summary: 'design motion graphics for screen and social' },
      { title: 'Journalist', leadTitle: 'Editor', skills: ['Reporting', 'Interviewing', 'Fact Checking', 'News Writing', 'Research'], salary: [400000, 1000000], levels: ALL, jobTypes: ONSITE, summary: 'report and file stories against daily deadlines' },
      { title: 'Sound Engineer', skills: ['Audio Mixing', 'Pro Tools', 'Sound Design', 'Mastering', 'Location Recording'], salary: [400000, 950000], levels: ALL, jobTypes: ONSITE, summary: 'record, mix and master audio for our productions' },
      { title: 'Graphic Designer', leadTitle: 'Art Director', skills: ['Photoshop', 'Illustrator', 'Figma', 'Layout Design', 'Typography', 'Branding'], salary: [400000, 950000], levels: ALL, jobTypes: DESK, summary: 'design assets across print, digital and social' },
    ],
  },
  {
    name: 'Human Resources',
    companies: ['Randstad India', 'Naukri', 'TeamLease', 'ABC Consultants', 'Adecco India', 'Michael Page India'],
    roles: [
      { title: 'Recruiter', leadTitle: 'Talent Acquisition Head', skills: ['Sourcing', 'Screening', 'ATS', 'Interview Coordination', 'Offer Negotiation', 'LinkedIn Recruiter'], salary: [400000, 900000], levels: ALL, jobTypes: DESK, summary: 'own hiring pipelines end to end for your business units' },
      { title: 'HR Business Partner', skills: ['Employee Relations', 'Performance Management', 'Workforce Planning', 'Coaching', 'HR Analytics'], salary: [1000000, 1900000], levels: NO_ENTRY, jobTypes: DESK, summary: 'partner with leaders on people strategy and org health' },
      { title: 'Payroll Specialist', skills: ['Payroll Processing', 'PF and ESI', 'Statutory Compliance', 'Excel', 'HRMS'], salary: [450000, 900000], levels: ALL, jobTypes: DESK, summary: 'run accurate, compliant payroll every cycle' },
      { title: 'Learning and Development Manager', skills: ['Training Design', 'Facilitation', 'Competency Mapping', 'LMS', 'Evaluation'], salary: [1100000, 2000000], levels: SENIOR_UP, jobTypes: DESK, summary: 'build capability programmes across the organisation' },
      { title: 'HR Generalist', skills: ['Onboarding', 'HR Policies', 'Employee Engagement', 'Exit Formalities', 'HRMS'], salary: [400000, 850000], levels: ALL, jobTypes: DESK, summary: 'cover the full employee lifecycle for your location' },
      { title: 'Compensation Analyst', skills: ['Benchmarking', 'Salary Structures', 'Excel Modelling', 'Benefits Design', 'Job Evaluation'], salary: [800000, 1500000], levels: NO_ENTRY, jobTypes: DESK, summary: 'keep our pay structures competitive and internally fair' },
    ],
  },
  {
    name: 'Sales & Business Development',
    companies: ['Salesforce India', 'Zoho', 'Asian Paints', 'Hindustan Unilever', 'Dabur India', 'Pidilite Industries', 'Marico'],
    roles: [
      { title: 'Field Sales Executive', leadTitle: 'Area Sales Manager', skills: ['Territory Management', 'Lead Generation', 'Negotiation', 'CRM', 'Distributor Handling'], salary: [350000, 800000], levels: ALL, jobTypes: FT, summary: 'grow revenue across your assigned territory' },
      { title: 'Key Account Manager', skills: ['Account Planning', 'Relationship Management', 'Upselling', 'Forecasting', 'Contract Renewal'], salary: [900000, 1800000], levels: NO_ENTRY, jobTypes: DESK, summary: 'deepen revenue within our largest accounts' },
      { title: 'Inside Sales Representative', skills: ['Cold Calling', 'Lead Qualification', 'CRM', 'Email Outreach', 'Pipeline Management'], salary: [400000, 850000], levels: JUNIOR, jobTypes: DESK, summary: 'qualify inbound demand and build early pipeline' },
      { title: 'Business Development Manager', leadTitle: 'Director of Business Development', skills: ['Partnerships', 'Market Entry', 'Proposal Writing', 'Negotiation', 'Pipeline Strategy'], salary: [1200000, 2300000], levels: NO_ENTRY, jobTypes: DESK, summary: 'open new markets, partners and revenue lines' },
      { title: 'Sales Operations Analyst', skills: ['Salesforce', 'Sales Analytics', 'Excel', 'Quota Planning', 'Reporting'], salary: [700000, 1400000], levels: NO_ENTRY, jobTypes: DESK, summary: 'give the sales org clean numbers and better process' },
      { title: 'Presales Consultant', skills: ['Solution Demos', 'RFP Response', 'Technical Discovery', 'Proposal Design', 'Client Workshops'], salary: [1000000, 2000000], levels: NO_ENTRY, jobTypes: DESK, summary: 'turn customer problems into credible solution proposals' },
    ],
  },
  {
    name: 'Customer Support & BPO',
    companies: ['Concentrix', 'Teleperformance India', 'WNS Global Services', 'Genpact', 'Tech Mahindra BPS', 'Infosys BPM'],
    roles: [
      { title: 'Customer Support Associate', leadTitle: 'Support Operations Manager', skills: ['Voice Support', 'Ticketing Systems', 'Zendesk', 'Complaint Resolution', 'Communication'], salary: [250000, 500000], levels: JUNIOR, jobTypes: DESK, summary: 'resolve customer issues across voice and chat' },
      { title: 'Technical Support Engineer', skills: ['Troubleshooting', 'Networking Basics', 'Remote Support', 'Ticketing Systems', 'Windows Administration'], salary: [400000, 900000], levels: ALL, jobTypes: DESK, summary: 'diagnose and resolve technical issues for customers' },
      { title: 'Team Lead - Voice Process', skills: ['Team Coaching', 'SLA Management', 'Quality Monitoring', 'Rostering', 'Escalation Handling'], salary: [500000, 1000000], levels: SENIOR_UP, jobTypes: FT, summary: 'lead a floor team against service-level targets' },
      { title: 'Quality Analyst', skills: ['Call Auditing', 'Quality Frameworks', 'Feedback Delivery', 'Reporting', 'Root Cause Analysis'], salary: [400000, 800000], levels: ALL, jobTypes: DESK, summary: 'audit interactions and lift service quality' },
      { title: 'Process Trainer', skills: ['Training Delivery', 'Content Design', 'Process Documentation', 'Assessment', 'Coaching'], salary: [450000, 900000], levels: NO_ENTRY, jobTypes: FT, summary: 'onboard and upskill agents on process and product' },
      { title: 'Customer Success Manager', skills: ['Account Health', 'Onboarding', 'Retention', 'QBR', 'Upselling'], salary: [900000, 1800000], levels: NO_ENTRY, jobTypes: DESK, summary: 'drive adoption and renewals across your book of accounts' },
    ],
  },
  {
    name: 'Agriculture & Food',
    companies: ['Amul', 'Britannia Industries', 'Nestle India', 'ITC Agri Business', 'Zomato Hyperpure', 'Godrej Agrovet', 'Parle Products'],
    roles: [
      { title: 'Food Technologist', leadTitle: 'Head of Product Development', skills: ['Product Development', 'Food Safety', 'FSSAI Standards', 'Shelf Life Testing', 'Sensory Evaluation'], salary: [500000, 1100000], levels: ALL, jobTypes: FT, summary: 'develop and validate new food products' },
      { title: 'Agronomist', skills: ['Crop Management', 'Soil Testing', 'Pest Control', 'Farmer Advisory', 'Yield Analysis'], salary: [400000, 900000], levels: ALL, jobTypes: FT, summary: 'advise growers and improve yield across our sourcing belt' },
      { title: 'Quality Assurance Officer', skills: ['HACCP', 'Food Safety Audits', 'Microbial Testing', 'Documentation', 'ISO 22000'], salary: [400000, 850000], levels: ALL, jobTypes: FT, summary: 'enforce food safety and quality across production' },
      { title: 'Farm Manager', skills: ['Farm Operations', 'Irrigation Planning', 'Labour Management', 'Harvest Planning', 'Budgeting'], salary: [500000, 1000000], levels: NO_ENTRY, jobTypes: FT, summary: 'run daily farm operations and seasonal planning' },
      { title: 'Packaging Supervisor', leadTitle: 'Packaging Manager', skills: ['Packaging Lines', 'Material Handling', 'Shift Supervision', 'Waste Reduction', 'Safety'], salary: [350000, 700000], levels: JUNIOR, jobTypes: FT, summary: 'supervise packing lines and reduce material waste' },
      { title: 'Procurement Executive - Agri', skills: ['Commodity Sourcing', 'Price Negotiation', 'Farmer Networks', 'Logistics', 'Quality Grading'], salary: [450000, 950000], levels: ALL, jobTypes: FT, summary: 'source raw produce at the right price and grade' },
    ],
  },
  {
    name: 'Energy & Utilities',
    companies: ['NTPC', 'Tata Power', 'Adani Green Energy', 'ReNew Power', 'Indian Oil Corporation', 'Suzlon Energy'],
    roles: [
      { title: 'Electrical Engineer', leadTitle: 'Electrical Design Head', skills: ['Power Systems', 'Substation Design', 'Load Flow Analysis', 'AutoCAD Electrical', 'Testing and Commissioning'], salary: [600000, 1300000], levels: ALL, jobTypes: ONSITE, summary: 'design and commission electrical systems on our assets' },
      { title: 'Solar Project Manager', skills: ['Solar PV', 'Project Scheduling', 'EPC Coordination', 'Site Execution', 'Vendor Management'], salary: [1200000, 2400000], levels: SENIOR_UP, jobTypes: FT, summary: 'deliver utility-scale solar projects on time and budget' },
      { title: 'Safety Officer', leadTitle: 'EHS Manager', skills: ['HSE Compliance', 'Risk Assessment', 'Incident Investigation', 'Safety Audits', 'Toolbox Talks'], salary: [450000, 950000], levels: ALL, jobTypes: FT, summary: 'keep every site incident-free and audit-ready' },
      { title: 'Grid Operator', skills: ['SCADA', 'Load Dispatch', 'Grid Stability', 'Shift Operations', 'Fault Analysis'], salary: [500000, 1100000], levels: NO_ENTRY, jobTypes: FT, summary: 'monitor and balance load across the network in real time' },
      { title: 'Energy Analyst', skills: ['Energy Modelling', 'Power Market Analysis', 'Excel', 'Regulatory Policy', 'Forecasting'], salary: [700000, 1500000], levels: NO_ENTRY, jobTypes: DESK, summary: 'model generation economics and market exposure' },
      { title: 'Wind Turbine Technician', skills: ['Turbine Maintenance', 'Hydraulics', 'Electrical Troubleshooting', 'Working at Height', 'Preventive Maintenance'], salary: [350000, 750000], levels: JUNIOR, jobTypes: FT, summary: 'service and repair turbines across the wind farm' },
    ],
  },
  {
    name: 'Government, NGO & Public Sector',
    companies: ['UNICEF India', 'CRY', 'Teach For India', 'Smile Foundation', 'Pratham Education Foundation', 'WWF India', 'Akshaya Patra'],
    roles: [
      { title: 'Program Officer', leadTitle: 'Program Director', skills: ['Program Management', 'Stakeholder Engagement', 'Budget Tracking', 'Report Writing', 'Field Coordination'], salary: [500000, 1200000], levels: ALL, jobTypes: FT, summary: 'run programme delivery across your assigned districts' },
      { title: 'Field Coordinator', skills: ['Community Mobilisation', 'Data Collection', 'Local Liaison', 'Training Delivery', 'Reporting'], salary: [300000, 650000], levels: JUNIOR, jobTypes: FT, summary: 'work directly with communities to deliver on the ground' },
      { title: 'Policy Analyst', skills: ['Policy Research', 'Data Analysis', 'Report Writing', 'Public Finance', 'Stakeholder Consultation'], salary: [700000, 1500000], levels: NO_ENTRY, jobTypes: DESK, summary: 'turn evidence into actionable policy recommendations' },
      { title: 'Grant Writer', skills: ['Proposal Writing', 'Donor Research', 'Budget Narratives', 'Compliance Reporting', 'Editing'], salary: [500000, 1000000], levels: ALL, jobTypes: DESK, summary: 'win and retain institutional funding through strong proposals' },
      { title: 'Monitoring and Evaluation Specialist', skills: ['M&E Frameworks', 'Impact Assessment', 'Survey Design', 'Statistical Analysis', 'Data Visualisation'], salary: [700000, 1400000], levels: NO_ENTRY, jobTypes: DESK, summary: 'measure whether our programmes actually work' },
      { title: 'Communications Officer', skills: ['Content Writing', 'Media Relations', 'Social Media', 'Campaign Design', 'Photography'], salary: [450000, 950000], levels: ALL, jobTypes: DESK, summary: 'tell the story of our work to donors and the public' },
    ],
  },
  {
    name: 'Pharma & Life Sciences',
    companies: ['Sun Pharmaceutical', 'Cipla', 'Dr Reddys Laboratories', 'Biocon', 'Serum Institute of India', 'Lupin', 'Glenmark'],
    roles: [
      { title: 'Clinical Research Associate', leadTitle: 'Clinical Operations Manager', skills: ['Clinical Trials', 'GCP', 'Site Monitoring', 'Protocol Compliance', 'Data Verification'], salary: [600000, 1300000], levels: ALL, jobTypes: FT, summary: 'monitor trial sites and safeguard data integrity' },
      { title: 'Regulatory Affairs Executive', skills: ['Dossier Preparation', 'CDSCO Submissions', 'Regulatory Strategy', 'Labelling', 'Compliance'], salary: [600000, 1300000], levels: ALL, jobTypes: DESK, summary: 'prepare submissions and steer products through approval' },
      { title: 'Formulation Scientist', skills: ['Formulation Development', 'Stability Studies', 'Analytical Methods', 'Scale Up', 'Documentation'], salary: [700000, 1500000], levels: NO_ENTRY, jobTypes: FT, summary: 'develop and optimise dosage forms from bench to batch' },
      { title: 'Medical Representative', leadTitle: 'Area Business Manager', skills: ['Doctor Detailing', 'Territory Coverage', 'Product Knowledge', 'Sales Reporting', 'Relationship Building'], salary: [300000, 700000], levels: JUNIOR, jobTypes: FT, summary: 'build prescriber relationships across your territory' },
      { title: 'Quality Control Chemist', skills: ['HPLC', 'GC', 'Wet Chemistry', 'GLP', 'Method Validation'], salary: [400000, 900000], levels: ALL, jobTypes: FT, summary: 'test and release material against specification' },
      { title: 'Pharmacovigilance Associate', skills: ['Adverse Event Reporting', 'Case Processing', 'MedDRA', 'Signal Detection', 'Regulatory Timelines'], salary: [450000, 1000000], levels: JUNIOR, jobTypes: DESK, summary: 'process safety cases within regulatory timelines' },
    ],
  },
  {
    name: 'Skilled Trades & Facilities',
    companies: ['Quess Corp', 'Sodexo India', 'ISS Facility Services', 'Urban Company', 'JLL India', 'CBRE India'],
    roles: [
      { title: 'Electrician', leadTitle: 'Electrical Supervisor', skills: ['Wiring', 'Fault Diagnosis', 'Panel Work', 'Electrical Safety', 'Preventive Maintenance'], salary: [250000, 500000], levels: JUNIOR, jobTypes: ONSITE, summary: 'install, test and repair electrical systems on site' },
      { title: 'HVAC Technician', leadTitle: 'HVAC Supervisor', skills: ['Chiller Maintenance', 'Refrigeration', 'Air Handling Units', 'Troubleshooting', 'Preventive Maintenance'], salary: [280000, 600000], levels: JUNIOR, jobTypes: ONSITE, summary: 'maintain cooling and ventilation systems across properties' },
      { title: 'Welder', leadTitle: 'Fabrication Supervisor', skills: ['MIG Welding', 'TIG Welding', 'Arc Welding', 'Blueprint Reading', 'Fabrication', 'Metal Cutting'], salary: [250000, 480000], levels: JUNIOR, jobTypes: ONSITE, summary: 'fabricate and weld structural and piping assemblies' },
      { title: 'Facility Manager', skills: ['Facility Operations', 'Vendor Management', 'Budgeting', 'Soft Services', 'Compliance'], salary: [700000, 1500000], levels: SENIOR_UP, jobTypes: FT, summary: 'run building operations across hard and soft services' },
      { title: 'Security Supervisor', leadTitle: 'Security Manager', skills: ['Access Control', 'CCTV Monitoring', 'Guard Deployment', 'Incident Reporting', 'Emergency Response'], salary: [280000, 600000], levels: JUNIOR, jobTypes: FT, summary: 'deploy and supervise site security coverage' },
      { title: 'Plumber', leadTitle: 'Plumbing Supervisor', skills: ['Pipe Fitting', 'Leak Detection', 'Sanitary Installation', 'Drainage Systems', 'Maintenance'], salary: [240000, 460000], levels: JUNIOR, jobTypes: ONSITE, summary: 'install and repair plumbing and drainage systems' },
    ],
  },
];
