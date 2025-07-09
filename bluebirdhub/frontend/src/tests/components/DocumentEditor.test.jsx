import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DocumentEditor from '../../components/Documents/DocumentEditor'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { describe, it, expect, vi } from 'vitest'

// Mock TipTap Editor
vi.mock('../../components/Editor/TipTapEditor', () => ({
  default: ({ content, onChange, placeholder }) => (
    <div data-testid="tiptap-editor">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid="editor-textarea"
      />
    </div>
  ),
}))

describe('DocumentEditor', () => {
  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  }

  const mockDocuments = [
    {
      id: 1,
      title: 'Test Document 1',
      content: 'Content 1',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Test Document 2',
      content: 'Content 2',
      updatedAt: new Date().toISOString(),
    },
  ]

  beforeEach(() => {
    useQueryClient.mockReturnValue(mockQueryClient)
    
    useQuery.mockReturnValue({
      data: mockDocuments,
      isLoading: false,
      error: null,
    })

    useMutation.mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      error: null,
    })
  })

  it('renders document list and editor', () => {
    render(<DocumentEditor workspaceId="1" />)

    expect(screen.getByText('Test Document 1')).toBeInTheDocument()
    expect(screen.getByText('Test Document 2')).toBeInTheDocument()
    expect(screen.getByText('Kein Dokument ausgewählt')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    })

    render(<DocumentEditor workspaceId="1" />)

    expect(screen.getByText('Lädt...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load documents'),
    })

    render(<DocumentEditor workspaceId="1" />)

    expect(screen.getByText(/Fehler beim Laden der Dokumente/)).toBeInTheDocument()
  })

  it('selects document when clicked', async () => {
    const user = userEvent.setup()
    
    render(<DocumentEditor workspaceId="1" />)

    const documentItem = screen.getByText('Test Document 1')
    await user.click(documentItem)

    expect(screen.getByDisplayValue('Test Document 1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Content 1')).toBeInTheDocument()
  })

  it('creates new document', async () => {
    const mockCreateMutation = vi.fn()
    const user = userEvent.setup()
    
    useMutation.mockReturnValue({
      mutate: mockCreateMutation,
      isLoading: false,
      error: null,
    })

    render(<DocumentEditor workspaceId="1" />)

    const newDocButton = screen.getByText('📄 Neues Dokument')
    await user.click(newDocButton)

    expect(mockCreateMutation).toHaveBeenCalledWith({
      title: 'Neues Dokument',
      content: '',
      workspaceId: '1',
    })
  })

  it('updates document title', async () => {
    const mockUpdateMutation = vi.fn()
    const user = userEvent.setup()
    
    useMutation.mockReturnValue({
      mutate: mockUpdateMutation,
      isLoading: false,
      error: null,
    })

    render(<DocumentEditor workspaceId="1" />)

    // Select document first
    const documentItem = screen.getByText('Test Document 1')
    await user.click(documentItem)

    // Update title
    const titleInput = screen.getByDisplayValue('Test Document 1')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Title')

    // Simulate auto-save delay
    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalledWith({
        id: 1,
        title: 'Updated Title',
        content: 'Content 1',
      })
    }, { timeout: 1000 })
  })

  it('updates document content', async () => {
    const mockUpdateMutation = vi.fn()
    const user = userEvent.setup()
    
    useMutation.mockReturnValue({
      mutate: mockUpdateMutation,
      isLoading: false,
      error: null,
    })

    render(<DocumentEditor workspaceId="1" />)

    // Select document first
    const documentItem = screen.getByText('Test Document 1')
    await user.click(documentItem)

    // Update content
    const contentEditor = screen.getByDisplayValue('Content 1')
    await user.clear(contentEditor)
    await user.type(contentEditor, 'Updated content')

    // Simulate auto-save delay
    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalledWith({
        id: 1,
        title: 'Test Document 1',
        content: 'Updated content',
      })
    }, { timeout: 1000 })
  })

  it('deletes document', async () => {
    const mockDeleteMutation = vi.fn()
    const user = userEvent.setup()
    
    global.confirm.mockReturnValue(true)
    
    useMutation.mockReturnValue({
      mutate: mockDeleteMutation,
      isLoading: false,
      error: null,
    })

    render(<DocumentEditor workspaceId="1" />)

    // Select document first
    const documentItem = screen.getByText('Test Document 1')
    await user.click(documentItem)

    // Delete document
    const deleteButton = screen.getByText('🗑️ Löschen')
    await user.click(deleteButton)

    expect(global.confirm).toHaveBeenCalledWith('Sind Sie sicher, dass Sie dieses Dokument löschen möchten?')
    expect(mockDeleteMutation).toHaveBeenCalledWith(1)
  })

  it('does not delete document if user cancels', async () => {
    const mockDeleteMutation = vi.fn()
    const user = userEvent.setup()
    
    global.confirm.mockReturnValue(false)
    
    useMutation.mockReturnValue({
      mutate: mockDeleteMutation,
      isLoading: false,
      error: null,
    })

    render(<DocumentEditor workspaceId="1" />)

    // Select document first
    const documentItem = screen.getByText('Test Document 1')
    await user.click(documentItem)

    // Try to delete document
    const deleteButton = screen.getByText('🗑️ Löschen')
    await user.click(deleteButton)

    expect(global.confirm).toHaveBeenCalled()
    expect(mockDeleteMutation).not.toHaveBeenCalled()
  })

  it('filters documents by search term', async () => {
    const user = userEvent.setup()
    
    render(<DocumentEditor workspaceId="1" />)

    const searchInput = screen.getByPlaceholderText('Dokumente durchsuchen...')
    await user.type(searchInput, 'Document 1')

    expect(screen.getByText('Test Document 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Document 2')).not.toBeInTheDocument()
  })

  it('shows manual save button', async () => {
    const mockUpdateMutation = vi.fn()
    const user = userEvent.setup()
    
    useMutation.mockReturnValue({
      mutate: mockUpdateMutation,
      isLoading: false,
      error: null,
    })

    render(<DocumentEditor workspaceId="1" />)

    // Select document first
    const documentItem = screen.getByText('Test Document 1')
    await user.click(documentItem)

    // Click manual save
    const saveButton = screen.getByText('💾 Speichern')
    await user.click(saveButton)

    expect(mockUpdateMutation).toHaveBeenCalledWith({
      id: 1,
      title: 'Test Document 1',
      content: 'Content 1',
    })
  })
})