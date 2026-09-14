import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#07090c] p-6 text-center text-[#e8edf2]">
          <h2 className="font-mono text-xl font-bold text-[#FFD43B]">Stylus3D Error Notice</h2>
          <p className="mt-2 max-w-md text-sm text-[#7C8896]">
            {this.state.error?.message || "An unexpected error occurred while rendering the page."}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="mt-6 rounded border border-[#C6F24E] px-4 py-2 font-mono text-xs uppercase text-[#C6F24E] transition hover:bg-[#C6F24E] hover:text-[#07090c]"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
