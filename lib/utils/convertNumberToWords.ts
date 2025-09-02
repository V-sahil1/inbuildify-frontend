const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];
  
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
  
  export function numberToWords(num: number): string {
    if (num === 0) return 'zero';
    
    const numStr = num.toString();
    const chunks = [];
    
    // Split the number into chunks of 3 digits from right to left
    for (let i = numStr.length; i > 0; i -= 3) {
      chunks.unshift(numStr.substring(Math.max(0, i - 3), i));
    }
  
    let result = '';
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = parseInt(chunks[i]);
      
      if (chunk === 0) continue;
      
      const scale = scales[chunks.length - 1 - i];
      const chunkWords = convertChunk(chunk);
      
      result += (result ? ' ' : '') + chunkWords + (scale ? ' ' + scale : '');
    }
    
    return result;
  }
  
  function convertChunk(num: number): string {
    if (num === 0) return '';
    if (num < 20) return ones[num];
    
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return tens[ten] + (one ? '-' + ones[one] : '');
    }
    
    // Handle hundreds
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    return ones[hundred] + ' Hundred' + (remainder ? ' And ' + convertChunk(remainder) : '');
  }
  