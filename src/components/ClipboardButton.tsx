"use client";
import { useState, useCallback } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

const ClipboardButton = ({ textToCopy,title }:any) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback((text:any) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <button
      onClick={() => copyToClipboard(textToCopy)}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-950 flex items-center"
    >
      <a
        href={textToCopy}
        className="hover:underline p-1"
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>
      {copied ? (
        <>
          <FiCheck className="mr-2" />
          Copied
        </>
      ) : (
        <>
          <FiCopy className="mr-2" />
          Copy
        </>
      )}
    </button>
  );
};

export default ClipboardButton;
