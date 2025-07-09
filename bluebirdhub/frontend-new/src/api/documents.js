export async function fetchDocuments() {
  const res = await fetch('http://localhost:8000/documents');
  if (!res.ok) throw new Error('Fehler beim Laden der Dokumente');
  return res.json();
}

export async function createDocument(doc) {
  const res = await fetch('http://localhost:8000/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc),
  });
  if (!res.ok) throw new Error('Fehler beim Anlegen');
  return res.json();
}

export async function deleteDocument(docId) {
  const res = await fetch(`http://localhost:8000/documents/${docId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Fehler beim Löschen');
  return res.json();
}