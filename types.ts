export interface Receipt {
  date: string;
  company: string;
  category: string;
  description: string;
  total: number;
  totalTax: number;
  gst: number;
  pst: number;
  thumbnail: string;
}
