
export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
  category?: string;
  duration?: string;
  modules?: number;
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  explanation: string;
  reference: string;
  references: string[];
  multipleCorrect: boolean;
  topics: string[];
}

export const topics: Topic[] = [
  {
    id: "network-security",
    name: "Network Security",
    description: "Explore topics related to securing network infrastructure and data transmission",
    icon: "shield-check",
    questionCount: 15,
    category: "Security",
    duration: "45",
    modules: 3
  },
  {
    id: "application-security",
    name: "Application Security",
    description: "Learn about securing applications from vulnerabilities and attacks",
    icon: "code",
    questionCount: 18,
    category: "Development",
    duration: "60",
    modules: 4
  },
  {
    id: "cryptography",
    name: "Cryptography",
    description: "Understand encryption, hashing, and secure communication protocols",
    icon: "key",
    questionCount: 14,
    category: "Security",
    duration: "50",
    modules: 3
  },
  {
    id: "security-governance",
    name: "Security Governance",
    description: "Study security policies, compliance, and risk management frameworks",
    icon: "activity",
    questionCount: 12,
    category: "Governance",
    duration: "40",
    modules: 2
  },
  {
    id: "identity-access",
    name: "Identity & Access Management",
    description: "Learn about authentication, authorization, and access control models",
    icon: "user-check",
    questionCount: 16,
    category: "Security",
    duration: "55",
    modules: 4
  },
  {
    id: "security-operations",
    name: "Security Operations",
    description: "Explore incident response, threat hunting, and security monitoring",
    icon: "award",
    questionCount: 14,
    category: "Operations",
    duration: "45",
    modules: 3
  },
  {
    id: "cloud-security",
    name: "Cloud Security",
    description: "Understand security challenges and solutions in cloud environments",
    icon: "network",
    questionCount: 15,
    category: "Technology",
    duration: "50",
    modules: 3
  },
  {
    id: "ceh-preparation",
    name: "CEH Preparation",
    description: "Practice questions aligned with Certified Ethical Hacker exam",
    icon: "file-code",
    questionCount: 25,
    category: "Certification",
    duration: "80",
    modules: 5
  },
  {
    id: "cissp-preparation",
    name: "CISSP Preparation",
    description: "Test your knowledge for the CISSP certification exam",
    icon: "lock",
    questionCount: 30,
    category: "Certification",
    duration: "90",
    modules: 6
  },
  {
    id: "database-security",
    name: "Database Security",
    description: "Learn about securing databases from unauthorized access and attacks",
    icon: "database",
    questionCount: 18,
    category: "Technology",
    duration: "60",
    modules: 4
  },
  {
    id: "security-frameworks",
    name: "Security Frameworks",
    description: "Study NIST, ISO 27001, CIS and other security frameworks",
    icon: "lock",
    questionCount: 20,
    category: "Governance",
    duration: "65",
    modules: 4
  },
  {
    id: "mobile-security",
    name: "Mobile Security",
    description: "Understand security challenges specific to mobile applications and devices",
    icon: "shield-check",
    questionCount: 15,
    category: "Technology",
    duration: "50",
    modules: 3
  }
];

// Create a new export for the questions array
export const questions: Question[] = [
  {
    id: "q1",
    text: "Which of the following is NOT a common network security control?",
    answers: [
      { id: "a", text: "Firewall", isCorrect: false },
      { id: "b", text: "Intrusion Detection System", isCorrect: false },
      { id: "c", text: "Database Indexing", isCorrect: true },
      { id: "d", text: "Network Access Control", isCorrect: false }
    ],
    explanation: "Database indexing is a database performance optimization technique, not a network security control. All other options are common network security controls used to protect network infrastructure.",
    reference: "NIST SP 800-53: Security and Privacy Controls",
    references: ["NIST SP 800-53: Security and Privacy Controls"],
    multipleCorrect: false,
    topics: ["network-security", "security-operations"]
  },
  {
    id: "q2",
    text: "Which of the following are components of the CIA triad in information security? (Select all that apply)",
    answers: [
      { id: "a", text: "Confidentiality", isCorrect: true },
      { id: "b", text: "Intelligence", isCorrect: false },
      { id: "c", text: "Integrity", isCorrect: true },
      { id: "d", text: "Availability", isCorrect: true }
    ],
    explanation: "The CIA triad consists of Confidentiality, Integrity, and Availability. These are the three key principles of information security. Intelligence is not part of the CIA triad.",
    reference: "ISC2 CISSP Common Body of Knowledge",
    references: ["ISC2 CISSP Common Body of Knowledge"],
    multipleCorrect: true,
    topics: ["security-governance", "cissp-preparation"]
  },
  {
    id: "q3",
    text: "Which access control model is based on the concept of subjects and objects?",
    answers: [
      { id: "a", text: "Role-Based Access Control (RBAC)", isCorrect: false },
      { id: "b", text: "Mandatory Access Control (MAC)", isCorrect: false },
      { id: "c", text: "Discretionary Access Control (DAC)", isCorrect: true },
      { id: "d", text: "Attribute-Based Access Control (ABAC)", isCorrect: false }
    ],
    explanation: "Discretionary Access Control (DAC) is based on the concept of subjects (users) and objects (resources). In DAC, the owner of an object determines who can access it.",
    reference: "NIST SP 800-192: Access Control Models",
    references: ["NIST SP 800-192: Access Control Models"],
    multipleCorrect: false,
    topics: ["identity-access", "security-governance"]
  },
  {
    id: "q4",
    text: "Which of the following encryption algorithms is symmetric?",
    answers: [
      { id: "a", text: "RSA", isCorrect: false },
      { id: "b", text: "AES", isCorrect: true },
      { id: "c", text: "ECC", isCorrect: false },
      { id: "d", text: "Diffie-Hellman", isCorrect: false }
    ],
    explanation: "AES (Advanced Encryption Standard) is a symmetric encryption algorithm that uses the same key for both encryption and decryption. The other options are asymmetric encryption algorithms or key exchange protocols.",
    reference: "NIST SP 800-175B: Guideline for Using Cryptographic Standards",
    references: ["NIST SP 800-175B: Guideline for Using Cryptographic Standards"],
    multipleCorrect: false,
    topics: ["cryptography"]
  },
  {
    id: "q5",
    text: "What is the main purpose of a Web Application Firewall (WAF)?",
    answers: [
      { id: "a", text: "To protect against network-layer attacks", isCorrect: false },
      { id: "b", text: "To filter application-layer traffic and protect against web attacks", isCorrect: true },
      { id: "c", text: "To encrypt data in transit", isCorrect: false },
      { id: "d", text: "To authenticate users to a website", isCorrect: false }
    ],
    explanation: "A Web Application Firewall (WAF) is designed to filter, monitor, and block HTTP/HTTPS traffic to and from a web application. It protects web applications from attacks such as cross-site scripting (XSS), SQL injection, and other application-layer attacks.",
    reference: "OWASP Web Application Firewall Guide",
    references: ["OWASP Web Application Firewall Guide"],
    multipleCorrect: false,
    topics: ["application-security", "network-security"]
  },
  {
    id: "q6",
    text: "Which of the following is a characteristic of a buffer overflow attack?",
    answers: [
      { id: "a", text: "It exploits input validation vulnerabilities", isCorrect: true },
      { id: "b", text: "It only affects web applications", isCorrect: false },
      { id: "c", text: "It requires physical access to the target system", isCorrect: false },
      { id: "d", text: "It can only be performed on Linux systems", isCorrect: false }
    ],
    explanation: "Buffer overflow attacks exploit input validation vulnerabilities where a program writes more data to a buffer than it can hold. This can allow an attacker to overwrite adjacent memory and potentially execute arbitrary code.",
    reference: "CWE-120: Buffer Copy without Checking Size of Input",
    references: ["CWE-120: Buffer Copy without Checking Size of Input"],
    multipleCorrect: false,
    topics: ["application-security", "ceh-preparation"]
  },
  {
    id: "q7",
    text: "What is the primary function of a SIEM system in a security operations center?",
    answers: [
      { id: "a", text: "To block incoming network attacks", isCorrect: false },
      { id: "b", text: "To collect, analyze, and correlate security events", isCorrect: true },
      { id: "c", text: "To scan for vulnerabilities in applications", isCorrect: false },
      { id: "d", text: "To manage user access rights", isCorrect: false }
    ],
    explanation: "Security Information and Event Management (SIEM) systems collect logs and security event data from multiple sources across an organization, then analyze and correlate this data to identify potential security incidents and support incident response.",
    reference: "NIST SP 800-92: Guide to Computer Security Log Management",
    references: ["NIST SP 800-92: Guide to Computer Security Log Management"],
    multipleCorrect: false,
    topics: ["security-operations"]
  },
  {
    id: "q8",
    text: "Which cloud service model places the most security responsibility on the customer?",
    answers: [
      { id: "a", text: "Software as a Service (SaaS)", isCorrect: false },
      { id: "b", text: "Platform as a Service (PaaS)", isCorrect: false },
      { id: "c", text: "Infrastructure as a Service (IaaS)", isCorrect: true },
      { id: "d", text: "Function as a Service (FaaS)", isCorrect: false }
    ],
    explanation: "In Infrastructure as a Service (IaaS), the cloud provider is responsible for securing the physical infrastructure, hypervisor, and network, but the customer is responsible for securing everything else, including the operating system, applications, and data. This places more security responsibility on the customer compared to PaaS and SaaS models.",
    reference: "CSA Cloud Security Alliance: Security Guidance for Critical Areas of Focus in Cloud Computing",
    references: ["CSA Cloud Security Alliance: Security Guidance for Critical Areas of Focus in Cloud Computing"],
    multipleCorrect: false,
    topics: ["cloud-security", "cissp-preparation"]
  },
  {
    id: "q9",
    text: "Which of the following frameworks primarily focuses on privacy requirements in the European Union?",
    answers: [
      { id: "a", text: "NIST Cybersecurity Framework", isCorrect: false },
      { id: "b", text: "GDPR", isCorrect: true },
      { id: "c", text: "ISO 27001", isCorrect: false },
      { id: "d", text: "HIPAA", isCorrect: false }
    ],
    explanation: "The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection and privacy that specifically addresses the protection of personal data of individuals within the European Union and the European Economic Area.",
    reference: "EU General Data Protection Regulation (GDPR)",
    references: ["EU General Data Protection Regulation (GDPR)"],
    multipleCorrect: false,
    topics: ["security-frameworks", "security-governance"]
  },
  {
    id: "q10",
    text: "What is the purpose of a SQL injection attack?",
    answers: [
      { id: "a", text: "To install malware on a user's device", isCorrect: false },
      { id: "b", text: "To gain unauthorized access to a database", isCorrect: true },
      { id: "c", text: "To cause a denial of service", isCorrect: false },
      { id: "d", text: "To intercept network traffic", isCorrect: false }
    ],
    explanation: "SQL injection is an attack that consists of insertion or 'injection' of a SQL query via the input data from the client to the application. A successful SQL injection attack can allow attackers to read sensitive data from the database, modify database data, execute administration operations on the database, and in some cases issue commands to the operating system.",
    reference: "OWASP Top Ten: A1:2017-Injection",
    references: ["OWASP Top Ten: A1:2017-Injection"],
    multipleCorrect: false,
    topics: ["application-security", "database-security", "ceh-preparation"]
  },
  {
    id: "q11",
    text: "What is the main function of a Certificate Authority (CA) in a PKI system?",
    answers: [
      { id: "a", text: "To encrypt data in transit", isCorrect: false },
      { id: "b", text: "To issue and manage digital certificates", isCorrect: true },
      { id: "c", text: "To detect network intrusions", isCorrect: false },
      { id: "d", text: "To enforce access control policies", isCorrect: false }
    ],
    explanation: "A Certificate Authority (CA) is a trusted entity that issues digital certificates. These certificates certify the ownership of a public key by the named subject of the certificate, allowing others to rely upon signatures or on assertions made about the private key that corresponds to the certified public key.",
    reference: "NIST SP 800-57: Recommendation for Key Management",
    references: ["NIST SP 800-57: Recommendation for Key Management"],
    multipleCorrect: false,
    topics: ["cryptography", "identity-access"]
  },
  {
    id: "q12",
    text: "Which of the following mobile security controls helps prevent unauthorized access to a lost or stolen device? (Select all that apply)",
    answers: [
      { id: "a", text: "Remote wipe capability", isCorrect: true },
      { id: "b", text: "Screen lock with strong authentication", isCorrect: true },
      { id: "c", text: "Mobile application firewall", isCorrect: false },
      { id: "d", text: "Full device encryption", isCorrect: true }
    ],
    explanation: "Remote wipe allows administrators or users to erase data on a lost device. Screen locks with strong authentication (like PINs, patterns, or biometrics) prevent unauthorized access to the device. Full device encryption ensures that even if someone bypasses the screen lock, they won't be able to access the data without the encryption key. Mobile application firewalls primarily protect against network-based attacks, not physical device theft.",
    reference: "NIST SP 800-124: Guidelines for Managing the Security of Mobile Devices",
    references: ["NIST SP 800-124: Guidelines for Managing the Security of Mobile Devices"],
    multipleCorrect: true,
    topics: ["mobile-security"]
  },
  {
    id: "q13",
    text: "Which of the following is the BEST way to defend against Cross-Site Scripting (XSS) attacks?",
    answers: [
      { id: "a", text: "Enable HTTPS on the web server", isCorrect: false },
      { id: "b", text: "Implement proper input validation and output encoding", isCorrect: true },
      { id: "c", text: "Use strong passwords for administrator accounts", isCorrect: false },
      { id: "d", text: "Install a network firewall", isCorrect: false }
    ],
    explanation: "Cross-Site Scripting (XSS) attacks occur when untrusted data is included in a web page without proper validation or encoding. The best defense is to implement proper input validation (to reject malicious input) and output encoding (to prevent any approved input from being interpreted as code rather than data).",
    reference: "OWASP XSS Prevention Cheat Sheet",
    references: ["OWASP XSS Prevention Cheat Sheet"],
    multipleCorrect: false,
    topics: ["application-security", "ceh-preparation"]
  },
  {
    id: "q14",
    text: "Which of these is NOT one of the 8 domains in the CEH exam?",
    answers: [
      { id: "a", text: "Reconnaissance and Footprinting", isCorrect: false },
      { id: "b", text: "System Hacking", isCorrect: false },
      { id: "c", text: "Cloud Virtualization", isCorrect: true },
      { id: "d", text: "Sniffing", isCorrect: false }
    ],
    explanation: "Cloud Virtualization is not one of the 8 domains in the CEH exam. The domains include: Reconnaissance and Footprinting, Scanning Networks, Enumeration, System Hacking, Malware Threats, Sniffing, Social Engineering, and Denial-of-Service.",
    reference: "EC-Council CEH Exam Blueprint",
    references: ["EC-Council CEH Exam Blueprint"],
    multipleCorrect: false,
    topics: ["ceh-preparation"]
  },
  {
    id: "q15",
    text: "Which of the following describes the CISSP Common Body of Knowledge (CBK) domain that focuses on protecting the confidentiality, integrity, and availability of data?",
    answers: [
      { id: "a", text: "Security Architecture and Engineering", isCorrect: false },
      { id: "b", text: "Asset Security", isCorrect: true },
      { id: "c", text: "Security Assessment and Testing", isCorrect: false },
      { id: "d", text: "Communication and Network Security", isCorrect: false }
    ],
    explanation: "Asset Security is the CISSP domain that focuses on protecting the confidentiality, integrity, and availability of information assets throughout their lifecycle. It covers data classification, ownership, retention, and protection.",
    reference: "ISC2 CISSP Common Body of Knowledge",
    references: ["ISC2 CISSP Common Body of Knowledge"],
    multipleCorrect: false,
    topics: ["cissp-preparation"]
  }
];

// This is where the questions would be defined
// For now, we'll just export placeholder data
export const getQuestionsByTopic = (topicId: string): Question[] => {
  return questions.filter(question => question.topics.includes(topicId));
};
