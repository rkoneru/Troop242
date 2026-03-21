import React from 'react';

/**
 * Error Boundary - Catches React component errors and prevents app crashes
 * Provides fallback UI and error logging
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Optional: Send to error tracking service (Sentry, etc)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              textAlign: 'center',
              padding: '30px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--accent)',
            }}
          >
            <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>
              ⚠️ Something went wrong
            </h1>
            <p style={{ marginBottom: '20px', opacity: 0.8 }}>
              We encountered an unexpected error. Try refreshing the page or
              going back to the home page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div
                style={{
                  textAlign: 'left',
                  padding: '15px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '4px',
                  marginBottom: '20px',
                  fontSize: '12px',
                  maxHeight: '200px',
                  overflow: 'auto',
                  fontFamily: 'monospace',
                }}
              >
                <strong>Error Details:</strong>
                <p style={{ color: '#ff6b6b', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details style={{ marginTop: '10px' }}>
                    <summary>Stack trace</summary>
                    <p style={{ color: '#999', whiteSpace: 'pre-wrap' }}>
                      {this.state.errorInfo.componentStack}
                    </p>
                  </details>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--accent)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
