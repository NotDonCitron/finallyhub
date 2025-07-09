import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { documentService } from '../../services/api';

const DocumentEditor = ({ workspaceId }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  // Fetch documents
  const { data: documentsData, isLoading: documentsLoading } = useQuery(
    ['documents', workspaceId],
    () => documentService.getAll({ workspace_id: workspaceId }),
    {
      enabled: !!workspaceId,
      onSuccess: (data) => {
        setDocuments(data);
      }
    }
  );

  // Create document mutation
  const createDocumentMutation = useMutation(
    (newDoc) => documentService.create(newDoc),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['documents', workspaceId]);
        setDocuments(prev => [...prev, data]);
        setSelectedDoc(data);
        setTitle(data.title);
        setContent(data.content);
        setError(null);
      },
      onError: (error) => {
        setError(error.response?.data?.error || 'Fehler beim Erstellen');
      }
    }
  );

  // Update document mutation
  const updateDocumentMutation = useMutation(
    ({ id, updates }) => documentService.update(id, updates),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['documents', workspaceId]);
        setDocuments(prev => prev.map(doc => doc.id === data.id ? data : doc));
        setSelectedDoc(data);
        setError(null);
      },
      onError: (error) => {
        setError(error.response?.data?.error || 'Fehler beim Speichern');
      }
    }
  );

  // Delete document mutation
  const deleteDocumentMutation = useMutation(
    (id) => documentService.delete(id),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(['documents', workspaceId]);
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        if (selectedDoc?.id === id) {
          setSelectedDoc(null);
          setTitle('');
          setContent('');
        }
        setError(null);
      },
      onError: (error) => {
        setError(error.response?.data?.error || 'Fehler beim Löschen');
      }
    }
  );

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (selectedDoc && (title !== selectedDoc.title || content !== selectedDoc.content)) {
      updateDocumentMutation.mutate({
        id: selectedDoc.id,
        updates: { title, content }
      });
    }
  }, [selectedDoc, title, content, updateDocumentMutation]);

  // Auto-save timer
  useEffect(() => {
    if (selectedDoc) {
      const timer = setTimeout(autoSave, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedDoc, title, content, autoSave]);

  const handleNewDocument = () => {
    if (!workspaceId) return;
    
    createDocumentMutation.mutate({
      title: 'Neues Dokument',
      content: '',
      workspace_id: workspaceId
    });
  };

  const handleSelectDocument = (doc) => {
    setSelectedDoc(doc);
    setTitle(doc.title);
    setContent(doc.content);
  };

  const handleDeleteDocument = (docId) => {
    if (window.confirm('Möchten Sie dieses Dokument wirklich löschen?')) {
      deleteDocumentMutation.mutate(docId);
    }
  };

  const handleSave = () => {
    if (selectedDoc) {
      updateDocumentMutation.mutate({
        id: selectedDoc.id,
        updates: { title, content }
      });
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (documentsLoading) {
    return <div className="loading">Lade Dokumente...</div>;
  }

  return (
    <div className="editor-container">
      {/* Sidebar */}
      <div className="editor-sidebar">
        <button 
          onClick={handleNewDocument} 
          className="btn-primary"
          style={{ width: '100%', marginBottom: '20px' }}
          disabled={!workspaceId}
        >
          📄 Neues Dokument
        </button>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Dokumente durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {error && (
          <div style={{ 
            padding: '8px 12px', 
            background: '#fee2e2', 
            color: '#dc2626', 
            borderRadius: '8px', 
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div className="document-list">
          {filteredDocuments.length === 0 ? (
            <div className="empty-state">
              <h3>Keine Dokumente</h3>
              <p>Erstellen Sie Ihr erstes Dokument</p>
            </div>
          ) : (
            filteredDocuments.map(doc => (
              <div
                key={doc.id}
                className={`document-item ${selectedDoc?.id === doc.id ? 'active' : ''}`}
                onClick={() => handleSelectDocument(doc)}
              >
                <h4>{doc.title}</h4>
                <p>{formatDate(doc.updatedAt)}</p>
                <div className="document-meta">
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {doc.creator?.displayName || doc.creator?.username}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(doc.id);
                    }}
                    className="btn-danger btn-small"
                    style={{ fontSize: '10px', padding: '4px 8px' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Editor */}
      <div className="editor-main">
        {selectedDoc ? (
          <>
            <div className="editor-header">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Dokumenttitel"
              />
            </div>
            
            <div className="editor-content">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Beginnen Sie mit dem Schreiben..."
              />
            </div>

            <div className="editor-toolbar">
              <button 
                onClick={handleSave} 
                className="btn-primary"
                disabled={updateDocumentMutation.isLoading}
              >
                {updateDocumentMutation.isLoading ? 'Speichert...' : '💾 Speichern'}
              </button>
              <span style={{ 
                fontSize: '12px', 
                color: '#64748b', 
                marginLeft: '12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                Zuletzt bearbeitet: {formatDate(selectedDoc.updatedAt)}
              </span>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%'
          }}>
            <h3>Kein Dokument ausgewählt</h3>
            <p>Wählen Sie ein Dokument aus der Liste oder erstellen Sie ein neues</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentEditor;