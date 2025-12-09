import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Oops! Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We encountered an unexpected error. Please try refreshing the
                page.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={this.handleReload}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </button>

              <button
                onClick={this.handleReset}
                className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Try Again
              </button>
            </div>

            {(import.meta as any).env?.MODE === "development" &&
              this.state.error && (
                <details className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <summary className="cursor-pointer text-sm font-medium text-red-800 hover:text-red-900">
                    Error Details (Development Mode)
                  </summary>
                  <div className="mt-3 text-xs text-red-700 overflow-auto">
                    <p className="font-semibold">Error:</p>
                    <pre className="whitespace-pre-wrap mb-3">
                      {this.state.error.toString()}
                    </pre>

                    {this.state.errorInfo && (
                      <>
                        <p className="font-semibold">Component Stack:</p>
                        <pre className="whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </>
                    )}
                  </div>
                </details>
              )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
