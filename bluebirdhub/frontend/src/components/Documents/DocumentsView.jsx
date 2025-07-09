import React, { useState } from 'react';
import DocumentEditor from './DocumentEditor';
import Layout from '../Layout/Layout';

const DocumentsView = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  return (
    <Layout>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <DocumentEditor workspaceId={selectedWorkspace} />
      </div>
    </Layout>
  );
};

export default DocumentsView;