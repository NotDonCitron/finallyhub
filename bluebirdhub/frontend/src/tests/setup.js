import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock React Query
vi.mock('react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }) => children,
}))

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
  BrowserRouter: ({ children }) => children,
  Route: ({ children }) => children,
  Routes: ({ children }) => children,
}))

// Mock API service
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  documentService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  workspaceService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock window.prompt for TipTap editor
global.prompt = vi.fn()

// Mock window.confirm
global.confirm = vi.fn()

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})