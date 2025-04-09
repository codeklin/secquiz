import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { useParams } from 'react-router-dom';

// Sample questions for CPN Certification
const sampleQuestions = [
  {
    question: "Which of the following is NOT a core component of the CPN Cybersecurity Framework?",
    options: ["Risk Assessment", "Threat Intelligence", "Financial Auditing", "Incident Response"],
    correct_answer: "Financial Auditing",
    explanation: "The CPN Cybersecurity Framework includes Risk Assessment, Threat Intelligence, and Incident Response as core components, but Financial Auditing is not a core component of the framework. Financial Auditing is more related to financial compliance rather than cybersecurity specifically."
  },
  {
    question: "What is the primary purpose of the Computer Professionals Registration Council of Nigeria (CPN)?",
    options: [
      "To regulate software imports into Nigeria",
      "To control and supervise the computing profession in Nigeria",
      "To provide internet services to government agencies",
      "To develop computer hardware in Nigeria"
    ],
    correct_answer: "To control and supervise the computing profession in Nigeria",
    explanation: "The Computer Professionals Registration Council of Nigeria (CPN) was established to control and supervise the computing profession in Nigeria. It ensures that computing is practiced according to professional standards and ethics."
  },
  {
    question: "Which Nigerian law provides the legal framework for cybersecurity and electronic transactions?",
    options: [
      "Nigerian Data Protection Regulation (NDPR)",
      "Cybercrimes (Prohibition, Prevention, etc.) Act 2015",
      "Computer Security Act 2010",
      "Electronic Commerce Act 2017"
    ],
    correct_answer: "Cybercrimes (Prohibition, Prevention, etc.) Act 2015",
    explanation: "The Cybercrimes (Prohibition, Prevention, etc.) Act 2015 is the primary legislation in Nigeria that provides a legal framework for cybersecurity, prohibits certain computer-related offenses, and establishes rules for electronic transactions and cybersecurity."
  },
  {
    question: "According to CPN certification requirements, what is the minimum educational qualification required to become a registered IT professional?",
    options: [
      "Secondary School Certificate",
      "National Diploma in Computer Science",
      "Bachelor's Degree in any IT-related field",
      "Master's Degree in Computer Science"
    ],
    correct_answer: "National Diploma in Computer Science",
    explanation: "According to CPN certification requirements, the minimum educational qualification to become a registered IT professional is a National Diploma in Computer Science or related field. Higher qualifications are required for higher membership categories."
  },
  {
    question: "Which of the following is a key responsibility of a CPN-certified cybersecurity professional in Nigeria?",
    options: [
      "Developing new programming languages",
      "Ensuring compliance with local and international cybersecurity standards",
      "Setting internet pricing regulations",
      "Manufacturing computer hardware"
    ],
    correct_answer: "Ensuring compliance with local and international cybersecurity standards",
    explanation: "A key responsibility of CPN-certified cybersecurity professionals is to ensure that organizations comply with both local Nigerian regulations (like the NDPR) and international cybersecurity standards (like ISO 27001, NIST, etc.)."
  },
  {
    question: "What is the role of NITDA (National Information Technology Development Agency) in relation to cybersecurity in Nigeria?",
    options: [
      "It manufactures security hardware",
      "It provides internet services to government agencies",
      "It regulates and develops the IT sector including issuing cybersecurity guidelines",
      "It trains all government employees in cybersecurity"
    ],
    correct_answer: "It regulates and develops the IT sector including issuing cybersecurity guidelines",
    explanation: "NITDA (National Information Technology Development Agency) is responsible for regulating and developing the IT sector in Nigeria, which includes issuing guidelines and standards for cybersecurity practices, particularly through the Nigerian Data Protection Regulation (NDPR)."
  },
  {
    question: "Which of these is NOT a category of membership in the Computer Professionals Registration Council of Nigeria?",
    options: [
      "Corporate Membership",
      "Fellow Membership",
      "Student Membership",
      "Executive Membership"
    ],
    correct_answer: "Executive Membership",
    explanation: "The Computer Professionals Registration Council of Nigeria (CPN) has several membership categories including Corporate, Fellow, and Student Membership, but 'Executive Membership' is not one of the official categories."
  },
  {
    question: "What is the primary focus of the Nigerian Data Protection Regulation (NDPR)?",
    options: [
      "Regulating internet service providers",
      "Protecting personal data and privacy rights",
      "Preventing cyber attacks on government infrastructure",
      "Licensing software developers"
    ],
    correct_answer: "Protecting personal data and privacy rights",
    explanation: "The Nigerian Data Protection Regulation (NDPR) primarily focuses on protecting the personal data and privacy rights of Nigerian citizens. It establishes guidelines for organizations that process personal data and outlines the rights of data subjects."
  },
  {
    question: "According to CPN standards, what should be the first step in responding to a cybersecurity incident?",
    options: [
      "Notify the public about the breach",
      "Identify and contain the incident",
      "Format all affected systems",
      "Terminate responsible employees"
    ],
    correct_answer: "Identify and contain the incident",
    explanation: "According to CPN and general cybersecurity best practices, the first step in incident response is to identify and contain the incident to prevent further damage. This comes before notification, recovery, or any disciplinary actions."
  },
  {
    question: "Which of the following is a key requirement for organizations under the Nigerian Data Protection Regulation?",
    options: [
      "All organizations must have a Data Protection Officer",
      "All data must be stored within Nigeria's borders",
      "Annual cybersecurity audits must be conducted by CPN members only",
      "All employees must be Nigerian citizens"
    ],
    correct_answer: "All organizations must have a Data Protection Officer",
    explanation: "Under the Nigerian Data Protection Regulation (NDPR), organizations that process personal data are required to designate a Data Protection Officer (DPO) who oversees compliance with data protection regulations."
  }
];

export default function AddSampleQuestions() {
  const { topicId } = useParams();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState(topicId || '');

  // Fetch topics when component mounts
  useEffect(() => {
    async function fetchTopics() {
      try {
        const { data } = await supabase.from('topics').select('id, title');
        if (data) {
          setTopics(data);
          if (!topicId && data.length > 0) {
            setSelectedTopicId(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    }
    fetchTopics();
  }, [topicId]);

  const handleAddSampleQuestions = async () => {
    if (!selectedTopicId) {
      setResult({
        success: false,
        message: 'Please select a topic first'
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Prepare questions with the selected topic_id
      const questionsToAdd = sampleQuestions.map(q => ({
        ...q,
        topic_id: selectedTopicId,
        options: JSON.stringify(q.options), // Convert options array to JSON string
        difficulty: 'medium' // Default difficulty
      }));

      const { data, error } = await supabase
        .from('questions')
        .insert(questionsToAdd)
        .select();

      if (error) throw error;

      setResult({
        success: true,
        message: `Successfully added ${data.length} sample questions to the database.`
      });
    } catch (error: any) {
      console.error('Error adding sample questions:', error);
      setResult({
        success: false,
        message: `Error: ${error.message || 'Unknown error occurred'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Add Sample Questions</h1>

      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          This tool will add {sampleQuestions.length} sample questions for the CPN Certification topic.
          Use this to quickly populate your questions table for testing.
        </p>

        {!topicId && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Topic</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
            >
              <option value="">-- Select a Topic --</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.title}</option>
              ))}
            </select>
          </div>
        )}

        <Button
          onClick={handleAddSampleQuestions}
          disabled={loading || !selectedTopicId}
          className="bg-cyber-blue hover:bg-cyber-blue/90"
        >
          {loading ? 'Adding...' : 'Add Sample Questions'}
        </Button>
      </div>

      {result && (
        <Alert className={result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
          <Shield className={result.success ? "text-green-500" : "text-red-500"} />
          <AlertTitle className={result.success ? "text-green-800" : "text-red-800"}>
            {result.success ? 'Success!' : 'Error!'}
          </AlertTitle>
          <AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>
            {result.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-8 border rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Sample Questions Preview</h2>
        <div className="space-y-4">
          {sampleQuestions.map((question, index) => (
            <div key={index} className="border rounded p-4 bg-white">
              <h3 className="font-medium mb-2">{question.question}</h3>
              <div className="pl-4 space-y-1">
                {question.options.map((option, i) => (
                  <div key={i} className={option === question.correct_answer ? "text-green-600 font-medium" : ""}>
                    {i + 1}. {option} {option === question.correct_answer && "(Correct)"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
