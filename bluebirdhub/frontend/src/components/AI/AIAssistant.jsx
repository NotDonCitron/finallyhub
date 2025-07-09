import React, { useState, useCallback } from 'react';
import { useMutation } from 'react-query';
import aiService from '../../services/aiService';
import './AIAssistant.css';

const AIAssistant = ({ document, onInsertContent }) => {
  const [activeTab, setActiveTab] = useState('summarize');
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [length, setLength] = useState('medium');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Summarize document
  const summarizeMutation = useMutation(
    () => aiService.summarizeDocument(document?.content || '', document?.title || ''),
    {
      onSuccess: (data) => {
        setResult({ type: 'summary', content: data.summary });
      },
      onError: (error) => {
        setResult({ type: 'error', content: error.message });
      }
    }
  );

  // Get suggestions
  const suggestMutation = useMutation(
    () => aiService.suggestImprovements(document?.content || ''),
    {
      onSuccess: (data) => {
        setResult({ type: 'suggestions', content: data.suggestions });
      },
      onError: (error) => {
        setResult({ type: 'error', content: error.message });
      }
    }
  );

  // Answer question
  const questionMutation = useMutation(
    (questionText) => aiService.answerQuestion(document?.content || '', questionText),
    {
      onSuccess: (data) => {
        setResult({ type: 'answer', content: data.answer, question: data.question });
      },
      onError: (error) => {
        setResult({ type: 'error', content: error.message });
      }
    }
  );

  // Generate outline
  const outlineMutation = useMutation(
    ({ topic, details }) => aiService.generateOutline(topic, details),
    {
      onSuccess: (data) => {
        setResult({ type: 'outline', content: data.outline });
      },
      onError: (error) => {
        setResult({ type: 'error', content: error.message });
      }
    }
  );

  // Improve writing
  const improveMutation = useMutation(
    () => aiService.improveWriting(document?.content || ''),
    {
      onSuccess: (data) => {
        setResult({ type: 'improvement', content: data.improvedContent });
      },
      onError: (error) => {
        setResult({ type: 'error', content: error.message });
      }
    }
  );

  // Generate content
  const generateMutation = useMutation(
    ({ topic, length }) => aiService.generateContent(topic, length),
    {
      onSuccess: (data) => {
        setResult({ type: 'generated', content: data.content });
      },
      onError: (error) => {
        setResult({ type: 'error', content: error.message });
      }
    }
  );

  const handleSummarize = useCallback(() => {
    if (!document?.content) {
      setResult({ type: 'error', content: 'No document content to summarize' });
      return;
    }
    setResult(null);
    summarizeMutation.mutate();
  }, [document, summarizeMutation]);

  const handleSuggest = useCallback(() => {
    if (!document?.content) {
      setResult({ type: 'error', content: 'No document content to analyze' });
      return;
    }
    setResult(null);
    suggestMutation.mutate();
  }, [document, suggestMutation]);

  const handleQuestion = useCallback(() => {
    if (!document?.content) {
      setResult({ type: 'error', content: 'No document content to ask about' });
      return;
    }
    if (!question.trim()) {
      setResult({ type: 'error', content: 'Please enter a question' });
      return;
    }
    setResult(null);
    questionMutation.mutate(question);
  }, [document, question, questionMutation]);

  const handleOutline = useCallback(() => {
    if (!topic.trim()) {
      setResult({ type: 'error', content: 'Please enter a topic' });
      return;
    }
    setResult(null);
    outlineMutation.mutate({ topic, details });
  }, [topic, details, outlineMutation]);

  const handleImprove = useCallback(() => {
    if (!document?.content) {
      setResult({ type: 'error', content: 'No document content to improve' });
      return;
    }
    setResult(null);
    improveMutation.mutate();
  }, [document, improveMutation]);

  const handleGenerate = useCallback(() => {
    if (!topic.trim()) {
      setResult({ type: 'error', content: 'Please enter a topic' });
      return;
    }
    setResult(null);
    generateMutation.mutate({ topic, length });
  }, [topic, length, generateMutation]);

  const handleInsertContent = useCallback(() => {
    if (result?.content && onInsertContent) {
      onInsertContent(result.content);
      setResult(null);
    }
  }, [result, onInsertContent]);

  const isLoading = summarizeMutation.isLoading || 
                   suggestMutation.isLoading || 
                   questionMutation.isLoading || 
                   outlineMutation.isLoading || 
                   improveMutation.isLoading || 
                   generateMutation.isLoading;

  return (
    <div className="ai-assistant">
      <div className="ai-assistant-header">
        <h3>🤖 AI Assistant</h3>
        <div className="ai-status">
          {isLoading && <span className="loading-indicator">Processing...</span>}
        </div>
      </div>

      <div className="ai-tabs">
        <button 
          className={activeTab === 'summarize' ? 'active' : ''}
          onClick={() => setActiveTab('summarize')}
        >
          Summarize
        </button>
        <button 
          className={activeTab === 'suggest' ? 'active' : ''}
          onClick={() => setActiveTab('suggest')}
        >
          Suggest
        </button>
        <button 
          className={activeTab === 'question' ? 'active' : ''}
          onClick={() => setActiveTab('question')}
        >
          Q&A
        </button>
        <button 
          className={activeTab === 'outline' ? 'active' : ''}
          onClick={() => setActiveTab('outline')}
        >
          Outline
        </button>
        <button 
          className={activeTab === 'improve' ? 'active' : ''}
          onClick={() => setActiveTab('improve')}
        >
          Improve
        </button>
        <button 
          className={activeTab === 'generate' ? 'active' : ''}
          onClick={() => setActiveTab('generate')}
        >
          Generate
        </button>
      </div>

      <div className="ai-content">
        {activeTab === 'summarize' && (
          <div className="ai-panel">
            <p>Generate a concise summary of your document</p>
            <button 
              onClick={handleSummarize}
              disabled={isLoading || !document?.content}
              className="btn-primary"
            >
              📝 Summarize Document
            </button>
          </div>
        )}

        {activeTab === 'suggest' && (
          <div className="ai-panel">
            <p>Get AI suggestions to improve your document</p>
            <button 
              onClick={handleSuggest}
              disabled={isLoading || !document?.content}
              className="btn-primary"
            >
              💡 Get Suggestions
            </button>
          </div>
        )}

        {activeTab === 'question' && (
          <div className="ai-panel">
            <p>Ask questions about your document content</p>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to know about this document?"
              rows="3"
            />
            <button 
              onClick={handleQuestion}
              disabled={isLoading || !document?.content || !question.trim()}
              className="btn-primary"
            >
              ❓ Ask Question
            </button>
          </div>
        )}

        {activeTab === 'outline' && (
          <div className="ai-panel">
            <p>Generate a structured outline for a topic</p>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic (e.g., 'Project Management')"
            />
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Additional context or requirements (optional)"
              rows="2"
            />
            <button 
              onClick={handleOutline}
              disabled={isLoading || !topic.trim()}
              className="btn-primary"
            >
              📋 Generate Outline
            </button>
          </div>
        )}

        {activeTab === 'improve' && (
          <div className="ai-panel">
            <p>Improve the writing quality of your document</p>
            <button 
              onClick={handleImprove}
              disabled={isLoading || !document?.content}
              className="btn-primary"
            >
              ✨ Improve Writing
            </button>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="ai-panel">
            <p>Generate new content about a topic</p>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic to write about"
            />
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
            >
              <option value="short">Short (2-3 paragraphs)</option>
              <option value="medium">Medium (4-6 paragraphs)</option>
              <option value="long">Long (8-10 paragraphs)</option>
            </select>
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="btn-primary"
            >
              🚀 Generate Content
            </button>
          </div>
        )}

        {result && (
          <div className={`ai-result ${result.type}`}>
            <div className="ai-result-header">
              <h4>
                {result.type === 'summary' && '📝 Summary'}
                {result.type === 'suggestions' && '💡 Suggestions'}
                {result.type === 'answer' && '❓ Answer'}
                {result.type === 'outline' && '📋 Outline'}
                {result.type === 'improvement' && '✨ Improved Text'}
                {result.type === 'generated' && '🚀 Generated Content'}
                {result.type === 'error' && '⚠️ Error'}
              </h4>
              {result.type !== 'error' && (
                <button 
                  onClick={handleInsertContent}
                  className="btn-secondary btn-small"
                >
                  Insert into Document
                </button>
              )}
            </div>
            
            {result.question && (
              <div className="ai-question">
                <strong>Question:</strong> {result.question}
              </div>
            )}
            
            <div className="ai-result-content">
              {result.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;