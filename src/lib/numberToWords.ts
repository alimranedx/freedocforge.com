// Number to Words converter supporting English and Bengali currency

const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];

const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

export function numberToWordsEnglish(num: number): string {
  if (num === 0) return "Zero Taka Only";
  if (num < 0) return "Minus " + numberToWordsEnglish(Math.abs(num));

  let words = "";

  if (Math.floor(num / 10000000) > 0) {
    words += numberToWordsEnglish(Math.floor(num / 10000000)) + " Crore ";
    num %= 10000000;
  }

  if (Math.floor(num / 100000) > 0) {
    words += numberToWordsEnglish(Math.floor(num / 100000)) + " Lakh ";
    num %= 100000;
  }

  if (Math.floor(num / 1000) > 0) {
    words += numberToWordsEnglish(Math.floor(num / 1000)) + " Thousand ";
    num %= 1000;
  }

  if (Math.floor(num / 100) > 0) {
    words += numberToWordsEnglish(Math.floor(num / 100)) + " Hundred ";
    num %= 100;
  }

  if (num > 0) {
    if (words !== "") words += "and ";
    if (num < 20) {
      words += ones[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10 > 0) {
        words += " " + ones[num % 10];
      }
    }
  }

  return words.trim() + " Taka Only";
}
