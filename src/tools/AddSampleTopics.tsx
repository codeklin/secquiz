import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

const sampleTopics = [
  {
    title: "Network Security",
    description: "Fundamentals of network security including firewalls, VPNs, IDS/IPS, and secure network architecture.",
    image_url: "/topics/network-security.jpg"
  },
  {
    title: "Web Application Security",
    description: "Security concepts and best practices for web applications, including OWASP Top 10 vulnerabilities.",
    image_url: "/topics/web-app-security.jpg"
  },
  {
    title: "Ethical Hacking",
    description: "Techniques and methodologies used by ethical hackers to identify and fix security vulnerabilities.",
    image_url: "/topics/ethical-hacking.jpg"
  },
  {
    title: "Cryptography",
    description: "Principles and applications of cryptography in cybersecurity, including encryption algorithms.",
    image_url: "/topics/cryptography.jpg"
  },
  {
    title: "Security+",
    description: "CompTIA Security+ certification preparation covering network security, threats and vulnerabilities.",
    image_url: "/topics/security-plus.jpg"
  },
  {
    title: "CISSP",
    description: "Certified Information Systems Security Professional exam preparation covering the 8 domains.",
    image_url: "/topics/cissp.jpg"
  },
  {
    title: "CEH",
    description: "Certified Ethical Hacker exam preparation covering ethical hacking methodologies and techniques.",
    image_url: "/topics/ceh.jpg"
  },
  {
    title: "Cloud Security",
    description: "Security considerations and best practices for cloud computing environments.",
    image_url: "/topics/cloud-security.jpg"
  },
  {
    title: "Mobile Security",
    description: "Security challenges and solutions for mobile devices and applications.",
    image_url: "/topics/mobile-security.jpg"
  }
];

export default function AddSampleTopics() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleAddSampleTopics = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase
        .from('topics')
        .insert(sampleTopics)
        .select();
      
      if (error) throw error;
      
      setResult({
        success: true,
        message: `Successfully added ${data.length} sample topics to the database.`
      });
    } catch (error: any) {
      console.error('Error adding sample topics:', error);
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
      <h1 className="text-3xl font-bold mb-6">Add Sample Topics</h1>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          This tool will add {sampleTopics.length} sample cybersecurity topics to your database.
          Use this to quickly populate your topics table for testing.
        </p>
        
        <Button 
          onClick={handleAddSampleTopics} 
          disabled={loading}
          className="bg-cyber-blue hover:bg-cyber-blue/90"
        >
          {loading ? 'Adding...' : 'Add Sample Topics'}
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
        <h2 className="text-xl font-semibold mb-4">Sample Topics Preview</h2>
        <div className="grid gap-4">
          {sampleTopics.map((topic, index) => (
            <div key={index} className="border rounded p-4 bg-white">
              <h3 className="font-medium">{topic.title}</h3>
              <p className="text-sm text-gray-600">{topic.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
