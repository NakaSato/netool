import React from "react";

interface ActionButtonsProps {
  handleCopy: () => void;
  handleShare: () => void;
  isCopied: boolean;
  isShared: boolean;
}

export default function ActionButtons({
  handleCopy,
  handleShare,
  isCopied,
  isShared,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center sm:justify-end gap-3 md:gap-4 p-3 sm:p-4 md:p-5 mt-3 md:mt-4 border-t border-slate-700">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-medium text-white bg-gradient-to-r from-cyan-700 to-cyan-900 hover:from-cyan-800 hover:to-cyan-950 active:from-cyan-900 active:to-cyan-950 rounded border border-cyan-600 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
        title="Copy the CIDR notation to clipboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        {isCopied ? (
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-emerald-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-emerald-300">Copied!</span>
          </span>
        ) : (
          <span className="font-mono tracking-wide">Copy CIDR</span>
        )}
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-medium text-white bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 active:from-slate-900 active:to-slate-950 rounded border border-slate-600 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
        title="Copy a shareable URL with the current CIDR notation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        {isShared ? (
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-emerald-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-emerald-300">Copied!</span>
          </span>
        ) : (
          <span className="font-mono tracking-wide">Copy Share Link</span>
        )}
      </button>
    </div>
  );
}
