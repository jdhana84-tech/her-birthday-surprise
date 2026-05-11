import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-screen bg-black text-white flex items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <h1 className="text-2xl font-serif italic text-pink-400">Something went wrong</h1>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">
              We encountered an unexpected error while rendering this part of the universe. 
              Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest hover:bg-white/10"
            >
              Reload Galaxy
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
