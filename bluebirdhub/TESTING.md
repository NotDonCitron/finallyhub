# Bluebirdhub Testing Guide

This document outlines the comprehensive testing strategy for the Bluebirdhub application.

## Overview

The testing framework consists of:
- **Backend Testing**: Jest with Supertest for API endpoint testing
- **Frontend Testing**: Vitest with React Testing Library for component testing
- **Test Coverage**: Comprehensive coverage reporting for both backend and frontend

## Backend Testing

### Setup
- **Framework**: Jest
- **HTTP Testing**: Supertest
- **Database**: SQLite in-memory for testing
- **Configuration**: `jest.config.js`

### Test Structure
```
backend/
├── tests/
│   ├── setup.js              # Test configuration and database setup
│   ├── auth.test.js          # Authentication endpoint tests
│   ├── documents.test.js     # Document CRUD operation tests
│   └── workspaces.test.js    # Workspace management tests
└── jest.config.js            # Jest configuration
```

### Running Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

### Test Coverage
- **Routes**: All API endpoints (/api/auth, /api/documents, /api/workspaces)
- **Models**: Database models and associations
- **Middleware**: Authentication and validation middleware
- **Error Handling**: Error responses and edge cases

## Frontend Testing

### Setup
- **Framework**: Vitest
- **Testing Library**: React Testing Library
- **DOM Environment**: jsdom
- **Configuration**: `vite.config.js`

### Test Structure
```
frontend/src/
├── tests/
│   ├── setup.js                        # Test configuration and mocks
│   ├── components/
│   │   ├── TipTapEditor.test.jsx      # Rich text editor tests
│   │   └── DocumentEditor.test.jsx    # Document editor component tests
│   └── services/
│       └── api.test.js                # API service tests
```

### Running Frontend Tests
```bash
cd frontend
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run test:ui          # Run tests with UI interface
```

### Test Coverage
- **Components**: All React components and their interactions
- **Services**: API service calls and error handling
- **User Interactions**: Button clicks, form submissions, navigation
- **State Management**: React Query state and mutations

## Test Categories

### 1. Unit Tests
- Individual component functionality
- Service method behavior
- Utility function correctness

### 2. Integration Tests
- API endpoint integration
- Database operations
- Component interaction with services

### 3. End-to-End Scenarios
- Complete user workflows
- Authentication flows
- Document creation and editing
- Workspace management

## Test Data Management

### Backend
- In-memory SQLite database for isolation
- Test data cleanup after each test
- Factory functions for creating test data

### Frontend
- Mocked API responses
- Mock implementations for external dependencies
- Controlled test environment

## Continuous Integration

### Pre-commit Hooks
- Run linting and formatting
- Execute test suite
- Ensure code quality

### GitHub Actions
- Automated test execution on push/PR
- Coverage reporting
- Build verification

## Best Practices

### Backend Testing
```javascript
describe('API Endpoint', () => {
  beforeEach(async () => {
    // Clean database and create test data
    await TestDataFactory.create();
  });

  it('should handle valid requests', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send(validData);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('expectedField');
  });
});
```

### Frontend Testing
```javascript
describe('Component', () => {
  it('should render with expected content', () => {
    render(<Component prop="value" />);
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    const mockHandler = vi.fn();
    
    render(<Component onAction={mockHandler} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

## Coverage Targets

- **Backend**: 85% line coverage
- **Frontend**: 80% line coverage
- **Critical paths**: 95% coverage for authentication and data operations

## Running All Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Full test suite with coverage
npm run test:all
```

## Test Environment Variables

```env
# Backend
NODE_ENV=test
JWT_SECRET=test-secret
DB_DIALECT=sqlite
DB_STORAGE=:memory:

# Frontend
VITE_API_URL=http://localhost:5000
VITE_TEST_ENV=true
```

## Debugging Tests

### Backend
- Use `console.log` for debugging
- Add `--verbose` flag for detailed output
- Use `--detectOpenHandles` to find hanging processes

### Frontend
- Use browser dev tools with `--debug` flag
- Screenshot testing with `--screenshot`
- Component debugging with React DevTools

## Performance Testing

### Backend
- API response time testing
- Database query optimization
- Memory usage monitoring

### Frontend
- Component rendering performance
- Bundle size analysis
- User interaction responsiveness

## Security Testing

### Backend
- Authentication bypass attempts
- SQL injection prevention
- Input validation testing

### Frontend
- XSS prevention
- CSRF protection
- Secure data handling

## Maintenance

### Regular Tasks
- Update test dependencies
- Review and update test coverage
- Clean up outdated test data
- Monitor test performance

### Test Review Process
1. Code review includes test review
2. Test coverage requirements for new features
3. Regular test suite maintenance
4. Performance impact assessment

## Troubleshooting

### Common Issues
- **Database connection errors**: Check test database setup
- **Timeout errors**: Increase test timeout or optimize test code
- **Mock issues**: Verify mock implementations match real behavior
- **Flaky tests**: Identify and fix race conditions

### Getting Help
- Check test logs for detailed error messages
- Review test configuration files
- Consult framework documentation
- Ask team members for assistance

This testing framework ensures reliable, maintainable, and comprehensive test coverage for the Bluebirdhub application.