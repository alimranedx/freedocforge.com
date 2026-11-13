export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface TemplateLocaleData {
  title: string;
  description: string;
  badge?: string;
  defaultData: any;
}

export interface TemplateDefinition {
  id: string;
  slug: string;
  category: "Business" | "Education" | "Healthcare" | "Restaurant" | "Printables";
  subCategory?: string;
  paperSize: "A4" | "POS_80MM";
  badge?: string;
  designStyle?: string;
  title: string;
  description: string;
  defaultData: any;
  locales: {
    en: TemplateLocaleData;
    bn: TemplateLocaleData;
  };
}

import { RECEIPT_TEMPLATES } from "./templates-receipts";
import { CLASS_ROUTINE_TEMPLATES } from "./templates-routines";
import { EXAM_ROUTINE_TEMPLATES } from "./examRoutineTemplates";
import { MEDICAL_RECEIPT_TEMPLATES } from "./templates-medical";
import { OTHER_EDUCATION_TEMPLATES } from "./templates-education-other";
import { OTHER_HEALTHCARE_TEMPLATES } from "./templates-healthcare-other";

export {
  RECEIPT_TEMPLATES,
  CLASS_ROUTINE_TEMPLATES,
  EXAM_ROUTINE_TEMPLATES,
  MEDICAL_RECEIPT_TEMPLATES,
  OTHER_EDUCATION_TEMPLATES,
  OTHER_HEALTHCARE_TEMPLATES,
};

export const INITIAL_TEMPLATES: TemplateDefinition[] = [
  ...RECEIPT_TEMPLATES,
  ...CLASS_ROUTINE_TEMPLATES,
  ...EXAM_ROUTINE_TEMPLATES,
  ...MEDICAL_RECEIPT_TEMPLATES,
  ...OTHER_EDUCATION_TEMPLATES,
  ...OTHER_HEALTHCARE_TEMPLATES,
];
