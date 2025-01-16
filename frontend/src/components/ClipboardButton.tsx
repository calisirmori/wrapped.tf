import { useState } from 'react';

function ClipboardButton(props:any) {
    const clipboardData = props.clipboardData
    const [copied, setCopied] = useState(false); 

  
    const handleCopy = async () => { 
      try {
        // ... your clipboard.writeText() logic 
        await navigator.clipboard.writeText(clipboardData),

        setCopied(true); 
        setTimeout(() => {
          setCopied(false); 
        }, 3000);
      } catch (error) {
        console.error("Error copying to clipboard:", error); 
      }
    };

    return (
      <button 
        className="mt-6 px-4 py-2 bg-tf-orange text-lightmode-primary rounded hover:scale-110 duration-100 shadow-md"
        onClick={handleCopy} 
      >
        {copied ? '✓ Copied Alt Description' : 'Copy Alt Description'}
      </button>
    );
  };

export default ClipboardButton;