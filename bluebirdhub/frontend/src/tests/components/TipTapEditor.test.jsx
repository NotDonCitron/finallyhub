import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TipTapEditor from '../../components/Editor/TipTapEditor'
import { describe, it, expect, vi } from 'vitest'

// Mock TipTap dependencies
vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(),
  EditorContent: ({ editor }) => (
    <div data-testid="editor-content">
      {editor ? 'Editor loaded' : 'No editor'}
    </div>
  ),
}))

vi.mock('@tiptap/starter-kit', () => ({
  default: vi.fn(),
}))

vi.mock('@tiptap/extension-placeholder', () => ({
  default: {
    configure: vi.fn(),
  },
}))

vi.mock('@tiptap/extension-link', () => ({
  default: {
    configure: vi.fn(),
  },
}))

vi.mock('@tiptap/extension-image', () => ({
  default: vi.fn(),
}))

vi.mock('@tiptap/extension-table', () => ({
  default: {
    configure: vi.fn(),
  },
}))

vi.mock('@tiptap/extension-table-row', () => ({
  default: vi.fn(),
}))

vi.mock('@tiptap/extension-table-header', () => ({
  default: vi.fn(),
}))

vi.mock('@tiptap/extension-table-cell', () => ({
  default: vi.fn(),
}))

vi.mock('react-icons/fa', () => ({
  FaBold: () => <span data-testid="bold-icon">B</span>,
  FaItalic: () => <span data-testid="italic-icon">I</span>,
  FaStrikethrough: () => <span data-testid="strikethrough-icon">S</span>,
  FaListUl: () => <span data-testid="list-ul-icon">UL</span>,
  FaListOl: () => <span data-testid="list-ol-icon">OL</span>,
  FaQuoteLeft: () => <span data-testid="quote-icon">Q</span>,
  FaCode: () => <span data-testid="code-icon">C</span>,
  FaLink: () => <span data-testid="link-icon">L</span>,
  FaImage: () => <span data-testid="image-icon">IMG</span>,
  FaTable: () => <span data-testid="table-icon">T</span>,
  FaUndo: () => <span data-testid="undo-icon">U</span>,
  FaRedo: () => <span data-testid="redo-icon">R</span>,
}))

describe('TipTapEditor', () => {
  const mockEditor = {
    chain: () => ({
      focus: () => ({
        toggleBold: () => ({ run: vi.fn() }),
        toggleItalic: () => ({ run: vi.fn() }),
        toggleStrike: () => ({ run: vi.fn() }),
        toggleHeading: () => ({ run: vi.fn() }),
        toggleBulletList: () => ({ run: vi.fn() }),
        toggleOrderedList: () => ({ run: vi.fn() }),
        toggleBlockquote: () => ({ run: vi.fn() }),
        toggleCode: () => ({ run: vi.fn() }),
        toggleCodeBlock: () => ({ run: vi.fn() }),
        setLink: () => ({ run: vi.fn() }),
        setImage: () => ({ run: vi.fn() }),
        insertTable: () => ({ run: vi.fn() }),
        undo: () => ({ run: vi.fn() }),
        redo: () => ({ run: vi.fn() }),
      }),
    }),
    isActive: vi.fn(),
    can: () => ({
      undo: vi.fn().mockReturnValue(true),
      redo: vi.fn().mockReturnValue(true),
    }),
  }

  beforeEach(() => {
    const { useEditor } = require('@tiptap/react')
    useEditor.mockReturnValue(mockEditor)
  })

  it('renders editor with menu bar', () => {
    const mockOnChange = vi.fn()
    
    render(
      <TipTapEditor
        content="<p>Test content</p>"
        onChange={mockOnChange}
        placeholder="Start typing..."
      />
    )

    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
    expect(screen.getByText('Editor loaded')).toBeInTheDocument()
  })

  it('renders all toolbar buttons', () => {
    const mockOnChange = vi.fn()
    
    render(
      <TipTapEditor
        content=""
        onChange={mockOnChange}
      />
    )

    expect(screen.getByTestId('bold-icon')).toBeInTheDocument()
    expect(screen.getByTestId('italic-icon')).toBeInTheDocument()
    expect(screen.getByTestId('strikethrough-icon')).toBeInTheDocument()
    expect(screen.getByTestId('list-ul-icon')).toBeInTheDocument()
    expect(screen.getByTestId('list-ol-icon')).toBeInTheDocument()
    expect(screen.getByTestId('quote-icon')).toBeInTheDocument()
    expect(screen.getByTestId('code-icon')).toBeInTheDocument()
    expect(screen.getByTestId('link-icon')).toBeInTheDocument()
    expect(screen.getByTestId('image-icon')).toBeInTheDocument()
    expect(screen.getByTestId('table-icon')).toBeInTheDocument()
    expect(screen.getByTestId('undo-icon')).toBeInTheDocument()
    expect(screen.getByTestId('redo-icon')).toBeInTheDocument()
  })

  it('handles bold button click', async () => {
    const mockOnChange = vi.fn()
    const user = userEvent.setup()
    
    render(
      <TipTapEditor
        content=""
        onChange={mockOnChange}
      />
    )

    const boldButton = screen.getByTestId('bold-icon').closest('button')
    await user.click(boldButton)

    expect(mockEditor.chain().focus().toggleBold).toHaveBeenCalled()
  })

  it('handles italic button click', async () => {
    const mockOnChange = vi.fn()
    const user = userEvent.setup()
    
    render(
      <TipTapEditor
        content=""
        onChange={mockOnChange}
      />
    )

    const italicButton = screen.getByTestId('italic-icon').closest('button')
    await user.click(italicButton)

    expect(mockEditor.chain().focus().toggleItalic).toHaveBeenCalled()
  })

  it('handles link insertion with prompt', async () => {
    const mockOnChange = vi.fn()
    const user = userEvent.setup()
    
    global.prompt.mockReturnValue('https://example.com')
    
    render(
      <TipTapEditor
        content=""
        onChange={mockOnChange}
      />
    )

    const linkButton = screen.getByTestId('link-icon').closest('button')
    await user.click(linkButton)

    expect(global.prompt).toHaveBeenCalledWith('Enter URL:')
    expect(mockEditor.chain().focus().setLink).toHaveBeenCalled()
  })

  it('handles image insertion with prompt', async () => {
    const mockOnChange = vi.fn()
    const user = userEvent.setup()
    
    global.prompt.mockReturnValue('https://example.com/image.jpg')
    
    render(
      <TipTapEditor
        content=""
        onChange={mockOnChange}
      />
    )

    const imageButton = screen.getByTestId('image-icon').closest('button')
    await user.click(imageButton)

    expect(global.prompt).toHaveBeenCalledWith('Enter image URL:')
    expect(mockEditor.chain().focus().setImage).toHaveBeenCalled()
  })

  it('handles table insertion', async () => {
    const mockOnChange = vi.fn()
    const user = userEvent.setup()
    
    render(
      <TipTapEditor
        content=""
        onChange={mockOnChange}
      />
    )

    const tableButton = screen.getByTestId('table-icon').closest('button')
    await user.click(tableButton)

    expect(mockEditor.chain().focus().insertTable).toHaveBeenCalledWith({
      rows: 3,
      cols: 3,
      withHeaderRow: true,
    })
  })

  it('shows active state for formatting buttons', () => {
    const mockOnChange = vi.fn()
    
    mockEditor.isActive.mockImplementation((format) => format === 'bold')
    
    render(
      <TipTapEditor
        content=""
        onChange={mockOnChange}
      />
    )

    const boldButton = screen.getByTestId('bold-icon').closest('button')
    expect(boldButton).toHaveClass('is-active')
  })

  it('disables undo/redo buttons when not available', () => {
    const mockOnChange = vi.fn()
    
    mockEditor.can = () => ({
      undo: vi.fn().mockReturnValue(false),
      redo: vi.fn().mockReturnValue(false),
    })
    
    render(
      <TipTapEditor
        content=""
        onChange={mockOnChange}
      />
    )

    const undoButton = screen.getByTestId('undo-icon').closest('button')
    const redoButton = screen.getByTestId('redo-icon').closest('button')
    
    expect(undoButton).toBeDisabled()
    expect(redoButton).toBeDisabled()
  })
})