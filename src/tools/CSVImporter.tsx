import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicSelect } from '@/components/ui/basic-select';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
}

export default function CSVImporter() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const topicIdFromUrl = queryParams.get('topic');

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>(topicIdFromUrl || '');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [topicsLoading, setTopicsLoading] = useState<boolean>(true);
  const [importStats, setImportStats] = useState<{ total: number; success: number; failed: number } | null>(null);
  const { toast } = useToast();

  // Fetch topics on component mount
  useEffect(() => {
    async function fetchTopics() {
      try {
        const { data, error } = await supabase
          .from('topics')
          .select('id, title')
          .order('title', { ascending: true });

        if (error) throw error;
        setTopics(data || []);
      } catch (error) {
        console.error('Error fetching topics:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load topics. Please try again.',
        });
      } finally {
        setTopicsLoading(false);
      }
    }

    fetchTopics();
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedTopic) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a topic.',
      });
      return;
    }

    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a CSV file to import.',
      });
      return;
    }

    setLoading(true);
    setImportStats(null);

    try {
      const text = await file.text();
      const questions = parseCSV(text);

      if (questions.length === 0) {
        throw new Error('No valid questions found in the CSV file.');
      }

      // Prepare questions for insertion
      const questionsToInsert = questions.map(q => ({
        topic_id: selectedTopic,
        question: q.question,
        options: JSON.stringify(q.options),
        correct_answer: q.correct_answer,
        explanation: q.explanation || '',
      }));

      // Insert questions into the database
      const { data, error } = await supabase
        .from('questions')
        .insert(questionsToInsert)
        .select();

      if (error) throw error;

      setImportStats({
        total: questions.length,
        success: data?.length || 0,
        failed: questions.length - (data?.length || 0),
      });

      toast({
        title: 'Success',
        description: `Imported ${data?.length || 0} questions successfully.`,
      });

      // Clear the file input
      setFile(null);
      const fileInput = document.getElementById('csv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      console.error('Error importing questions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not import questions. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Parse CSV file
  const parseCSV = (text: string) => {
    const questions = [];
    const lines = text.split('\n');

    // Skip header row
    const headerRow = lines[0].trim();
    const hasHeader = headerRow.toLowerCase().includes('question') &&
                      headerRow.toLowerCase().includes('options') &&
                      headerRow.toLowerCase().includes('answer');

    const startRow = hasHeader ? 1 : 0;

    for (let i = startRow; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split by comma, but respect quotes
      const columns = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      if (!columns || columns.length < 3) continue;

      // Remove quotes if present
      const cleanColumns = columns.map(col => col.replace(/^"(.*)"$/, '$1').trim());

      const question = cleanColumns[0];
      const optionsStr = cleanColumns[1];
      const correctAnswer = cleanColumns[2];
      const explanation = cleanColumns[3] || '';

      // Parse options - expected format: "Option 1|Option 2|Option 3|Option 4"
      const options = optionsStr.split('|').map(opt => opt.trim());

      if (question && options.length >= 2 && correctAnswer) {
        questions.push({
          question,
          options,
          correct_answer: correctAnswer,
          explanation,
        });
      }
    }

    return questions;
  };

  // Generate a sample CSV
  const generateSampleCSV = () => {
    const csvContent = `Question,Options,Correct Answer,Explanation
"What is a firewall?","A security guard at a building|A software/hardware that monitors network traffic|A type of computer virus|A backup system","A software/hardware that monitors network traffic","A firewall is a network security device that monitors and filters incoming and outgoing network traffic."
"Which of the following is NOT a common authentication factor?","Something you know|Something you have|Something you are|Something you believe","Something you believe","Authentication typically uses three factors: something you know (password), something you have (token), and something you are (biometrics)."
"What is phishing?","A type of fishing sport|A social engineering attack to steal credentials|A network scanning technique|A type of encryption","A social engineering attack to steal credentials","Phishing is a cybercrime where targets are contacted by email, phone or text by someone posing as a legitimate institution to lure them into providing sensitive data."`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_questions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>CSV Question Importer</CardTitle>
        <CardDescription>
          Import questions from a CSV file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>CSV Format</AlertTitle>
            <AlertDescription>
              Your CSV should have these columns: Question, Options, Correct Answer, Explanation.
              Options should be separated by the pipe character (|).
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600"
                onClick={generateSampleCSV}
              >
                Download a sample CSV
              </Button>
            </AlertDescription>
          </Alert>

          <div>
            <label className="block text-sm font-medium mb-1">Select Topic</label>
            <BasicSelect
              options={topics.map(topic => ({ value: topic.id, label: topic.title }))}
              value={selectedTopic}
              onChange={setSelectedTopic}
              disabled={topicsLoading}
              placeholder="Select a topic"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Select CSV File
            </label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>

          <Button
            onClick={handleImport}
            disabled={loading || !selectedTopic || !file}
            className="w-full"
          >
            {loading ? 'Importing...' : 'Import Questions'}
          </Button>

          {importStats && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-medium text-green-800">Import Results</h3>
              <ul className="mt-2 text-sm text-green-700">
                <li>Total questions processed: {importStats.total}</li>
                <li>Successfully imported: {importStats.success}</li>
                {importStats.failed > 0 && (
                  <li>Failed to import: {importStats.failed}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
