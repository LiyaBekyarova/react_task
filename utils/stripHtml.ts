export const stripHTML = (html: string) => {
    if (!html) return '';
    return html
    .replace(/&nbsp;/g, ' ')       
    .replace(/&amp;/g, '&')        
    .replace(/&quot;/g, '"')       
    .replace(/&#39;/g, "'")        
    .replace(/&lt;/g, '<')         
    .replace(/&gt;/g, '>')        
    .replace(/<[^>]*>/g, '')       
    .replace(/\s+/g, ' ')        
    .trim()                       
  };