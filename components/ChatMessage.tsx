
import React from 'react';
import { Message } from '../types';
import { USER_AVATAR_URL, ROBOT_AVATAR_URL, EXPERT_AVATAR_URL } from '../constants';

// Helper function to render markdown-like text
const renderChatMessageMarkdown = (markdownText: string | undefined, isUserMessage: boolean) => {
  if (!markdownText) return null;

  const normalizedText = markdownText.replace(/\r\n/g, '\n');
  let lines = normalizedText.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;

  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*([^*]+|(?<=\*)\*+?[^*]+)\*)/g).filter(part => part && part.length > 0);
    return parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={partIndex}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const isTableStart = (lineIndex: number): boolean => {
    if (lineIndex + 1 >= lines.length) return false;
    const currentLine = lines[lineIndex].trim();
    const nextLine = lines[lineIndex + 1].trim();
    return currentLine.startsWith('|') && currentLine.endsWith('|') &&
           nextLine.startsWith('|') && nextLine.endsWith('|') &&
           nextLine.replace(/\|/g, '').replace(/:/g, '').replace(/-/g, '').trim() === '';
  };
  
  const parseTableAlignments = (separatorLine: string): string[] => {
    return separatorLine.slice(1, -1).split('|').map(cell => {
      const trimmed = cell.trim();
      if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
      if (trimmed.endsWith(':')) return 'right';
      if (trimmed.startsWith(':')) return 'left'; // Default to left if only one colon
      return 'left'; // Default alignment
    });
  };


  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (isTableStart(i)) {
        const tableRows: JSX.Element[] = [];
        const headerLine = lines[i].trim();
        const separatorLine = lines[i + 1].trim();
        
        const alignments = parseTableAlignments(separatorLine);

        const headerCells = headerLine.slice(1, -1).split('|').map((cell, cellIndex) => (
            <th key={`th-${elements.length}-${tableRows.length}-${cellIndex}`} className={`p-1.5 border border-brand-border/40 text-${alignments[cellIndex] || 'left'} bg-brand-bg-light/50`}>
                {renderInlineMarkdown(cell.trim())}
            </th>
        ));
        tableRows.push(<tr key={`tr-header-${elements.length}`}>{headerCells}</tr>);
        i += 2; // Move past header and separator

        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
            const bodyLine = lines[i].trim();
            const bodyCells = bodyLine.slice(1, -1).split('|').map((cell, cellIndex) => (
                <td key={`td-${elements.length}-${tableRows.length}-${cellIndex}`} className={`p-1.5 border border-brand-border/30 text-${alignments[cellIndex] || 'left'}`}>
                    {renderInlineMarkdown(cell.trim())}
                </td>
            ));
            tableRows.push(<tr key={`tr-body-${elements.length}-${tableRows.length}`}>{bodyCells}</tr>);
            i++;
        }
        elements.push(
            <div key={`table-wrapper-${elements.length}`} className="overflow-x-auto my-2">
                <table className="min-w-full border-collapse border border-brand-border/50 bg-white shadow-sm rounded-md text-sm">
                    <thead>{tableRows.shift()}</thead>
                    <tbody>{tableRows}</tbody>
                </table>
            </div>
        );

    } else if (trimmedLine.startsWith('### ')) {
      elements.push(<h3 key={`h-${elements.length}`}>{renderInlineMarkdown(trimmedLine.substring(4))}</h3>);
      i++;
    } else if (trimmedLine.startsWith('## ')) {
      elements.push(<h2 key={`h-${elements.length}`}>{renderInlineMarkdown(trimmedLine.substring(3))}</h2>);
      i++;
    } else if (trimmedLine.startsWith('# ')) {
      elements.push(<h1 key={`h-${elements.length}`}>{renderInlineMarkdown(trimmedLine.substring(2))}</h1>);
      i++;
    } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const listItems: JSX.Element[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        const listItemContent = lines[i].trim().substring(lines[i].trim().indexOf(' ') + 1);
        listItems.push(<li key={`li-${elements.length}-${listItems.length}`}>{renderInlineMarkdown(listItemContent)}</li>);
        i++;
      }
      elements.push(<ul key={`ul-${elements.length}`}>{listItems}</ul>);
    } else if (trimmedLine === '') {
      i++;
    } else { 
      const paragraphLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' &&
             !lines[i].trim().startsWith('#') && 
             !lines[i].trim().startsWith('- ') && 
             !lines[i].trim().startsWith('* ') &&
             !isTableStart(i) ) { // Check if the next line is not part of a table
        paragraphLines.push(lines[i]);
        i++;
      }
      if (paragraphLines.length > 0) {
        elements.push(<p key={`p-${elements.length}`}>{renderInlineMarkdown(paragraphLines.join(' '))}</p>);
      }
    }
  }

  return (
    <div className={`prose prose-sm max-w-none 
        ${isUserMessage 
            ? 'text-white prose-strong:text-white prose-headings:text-white prose-ul:text-white/90 prose-ol:text-white/90 prose-li:[&::marker]:text-white/70 prose-em:text-white/90' 
            : 'text-brand-dark-text prose-strong:text-brand-dark-text prose-headings:text-brand-primary prose-ul:text-brand-light-text prose-ol:text-brand-light-text prose-li:[&::marker]:text-brand-primary prose-em:text-brand-light-text/90'
        }
        prose-p:my-1 first:prose-p:mt-0 last:prose-p:mb-0 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 
        prose-headings:my-3 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h3:font-semibold
        prose-table:my-2 prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1 prose-table:text-xs sm:prose-table:text-sm
    `}>
      {elements}
    </div>
  );
};

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  let avatarUrl = USER_AVATAR_URL; 
  let senderName = "You";
  let messageBubbleStyle = '';

  if (message.sender === 'bot') {
    avatarUrl = ROBOT_AVATAR_URL;
    senderName = "DadMind AI";
    if (message.id.startsWith('system-kb-error-') || message.id.startsWith('system-error-')) {
      messageBubbleStyle = 'bg-system-error-bg text-system-error-text border border-system-error-border';
    } else if (message.id.startsWith('system-kb-warn-') || message.id.startsWith('system-warn-')) {
      messageBubbleStyle = 'bg-system-warn-bg text-system-warn-text border border-system-warn-border';
    } else if (message.id.startsWith('system-kb-') || message.id.startsWith('system-info-')) { // Includes loading, loaded, ready, all-loaded
      messageBubbleStyle = 'bg-system-info-bg text-system-info-text border border-system-info-border';
    } else { // Regular bot message
      messageBubbleStyle = 'bg-brand-bg-card text-brand-dark-text rounded-bl-lg border border-brand-primary/30';
    }
  } else if (message.sender === 'expert') {
    avatarUrl = message.avatar || EXPERT_AVATAR_URL; 
    senderName = "Expert"; 
    messageBubbleStyle = 'bg-brand-bg-card text-brand-dark-text rounded-bl-lg border border-brand-accent/50';
  } else { // User message
     messageBubbleStyle = 'bg-gradient-button text-white rounded-br-lg';
  }
  
  const avatarErrorPlaceholder = (e: React.SyntheticEvent<HTMLImageElement, Event>, senderType: 'user' | 'bot' | 'expert', name?: string) => {
    const target = e.currentTarget;
    let placeholderText = "U";
    let bgColor = "7F5283"; 
    let textColor = "FFFFFF";

    if (senderType === 'bot') {
      placeholderText = "AI";
      bgColor = "4A55A2"; 
    } else if (senderType === 'expert') {
      placeholderText = name ? name.substring(0,1).toUpperCase() : "E";
      bgColor = "E178C5"; 
    }
    target.src = `https://via.placeholder.com/40/${bgColor}/${textColor}?text=${placeholderText}`;
  };


  return (
    <div className={`flex items-end space-x-2.5 my-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <img 
            src={avatarUrl} 
            alt={`${senderName} avatar`} 
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0" 
            onError={(e) => avatarErrorPlaceholder(e, message.sender, message.sender === 'expert' ? senderName: undefined)}
        />
      )}
      <div
        className={`max-w-[70%] lg:max-w-[75%] xl:max-w-[80%] px-4 py-3 rounded-2xl shadow-md ${messageBubbleStyle}`}
      >
        {renderChatMessageMarkdown(message.text, isUser)}
         {!isUser && (
             <p className={`text-xs mt-1.5 text-right ${message.id.startsWith('system-') ? 'text-current opacity-70' : 'text-gray-400'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </p>
         )}
         {isUser && (
             <p className="text-xs text-white/80 mt-1.5 text-left">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </p>
         )}
      </div>
      {isUser && (
         <img 
            src={USER_AVATAR_URL} 
            alt="user avatar" 
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
            onError={(e) => avatarErrorPlaceholder(e, 'user')}
        />
      )}
    </div>
  );
};
