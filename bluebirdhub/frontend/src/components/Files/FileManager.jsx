import React from 'react';
import { useQuery } from 'react-query';
import { Upload, File, Download } from 'lucide-react';
import { fileService } from '../../services/api';

const FileManager = () => {
  const { data: filesData, isLoading } = useQuery(
    'files',
    () => fileService.getAll(),
    {
      select: (response) => response.data.files || [],
    }
  );

  const files = filesData || [];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) return '🖼️';
    if (mimetype.startsWith('video/')) return '🎥';
    if (mimetype.startsWith('audio/')) return '🎵';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word')) return '📝';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return '📊';
    if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return '📺';
    return '📁';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dateimanager</h1>
        <button className="btn-primary">
          <Upload className="w-4 h-4 mr-2" />
          Datei hochladen
        </button>
      </div>

      {/* Upload area */}
      <div className="card mb-6">
        <div className="dropzone">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Dateien hierher ziehen oder klicken zum Hochladen
          </p>
          <p className="text-sm text-gray-500">
            Unterstützt: Alle Dateitypen, max. 10MB pro Datei
          </p>
        </div>
      </div>

      {/* Files list */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Alle Dateien</h2>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Noch keine Dateien hochgeladen</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getFileIcon(file.mimetype)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{file.originalName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>Hochgeladen von {file.uploader?.displayName || file.uploader?.username}</span>
                      <span>{new Date(file.createdAt).toLocaleDateString('de-DE')}</span>
                    </div>
                    {file.tags && file.tags.length > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        {file.tags.map((tag, index) => (
                          <span key={index} className="badge-primary text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <a
                    href={fileService.download(file.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;