'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900/50 rounded-xl border border-red-500/30 m-4">
          <AlertTriangle size={48} className="text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 text-center text-sm mb-6">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 font-bold rounded-lg border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 font-bold rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <Home size={18} />
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for components to manually trigger error boundary
export function useErrorHandler() {
  const [, setError] = React.useState<Error | null>(null);

  return (error: Error | string) => {
    const err = typeof error === 'string' ? new Error(error) : error;
    setError(() => {
      throw err;
    });
  };
}

// Wrapper for async operations that might fail
export function withAsyncErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  onError?: (error: Error) => void
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  return (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    return fn(...args).catch((error: Error) => {
      console.error('Async operation failed:', error);
      onError?.(error);
      // Return a safe default instead of throwing
      return null;
    });
  };
}