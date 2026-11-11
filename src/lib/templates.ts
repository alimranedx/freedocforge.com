export interface TemplateField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "textarea" | "select";
  defaultValue?: string | number;
  placeholder?: string;
}

export interface TemplateDefinition {
  id: string;
  slug: string;
  title: string;
  category: "Business" | "Education" | "Healthcare" | "Restaurant" | "Printables";
  description: string;
  paperSize: "A4" | "POS_80MM";
  badge?: string;
  defaultData: any;
}

export const INITIAL_TEMPLATES: TemplateDefinition[] = [
  {
    id: "fcommerce-invoice",
    slug: "f-commerce-invoice",
    title: "Facebook Shop & F-Commerce Cash Memo",
    category: "Business",
    paperSize: "A4",
    badge: "Most Popular in BD",
    description: "Perfect for online sellers, Facebook clothing & gadget shops. Includes customer address, courier note, and payment status.",
    defaultData: {
      businessName: "Stylist Fashion BD",
      tagline: "Quality Products Delivered to Your Doorstep",
      phone: "+880 1712-345678",
      address: "Dhanmondi, Dhaka - 1205",
      invoiceNumber: "INV-2026-089",
      date: "2026-11-11",
      customerName: "Md. Tanvir Ahmed",
      customerPhone: "+880 1819-987654",
      customerAddress: "House 14, Road 5, Mirpur-10, Dhaka",
      courierPartner: "Steadfast Courier",
      currency: "৳",
      items: [
        { name: "Premium Cotton Formal Shirt (L)", quantity: 2, price: 1250 },
        { name: "Slim Fit Chino Pant (32)", quantity: 1, price: 1450 },
      ],
      deliveryCharge: 120,
      discount: 100,
      paidAmount: 500,
      notes: "Thank you for shopping with us! For return or exchange, please notify us within 48 hours of parcel delivery.",
      signatoryTitle: "Authorized Signature",
    },
  },
  {
    id: "school-result-sheet",
    slug: "school-result-sheet",
    title: "School / Coaching Center Result & Marksheet",
    category: "Education",
    paperSize: "A4",
    badge: "Schools & Madrasahs",
    description: "Format for academic evaluations, quarterly examinations, and coaching center progress cards with GPA calculation.",
    defaultData: {
      instituteName: "Dhaka Ideal Academic Care",
      tagline: "Inspiring Excellence in Education",
      phone: "+880 2-9876543",
      address: "Sector 4, Uttara, Dhaka",
      examTitle: "Annual Examination - 2026",
      studentName: "Sadia Rahman",
      rollNo: "12",
      classGrade: "Class 9 (Science)",
      academicYear: "2026",
      date: "2026-11-11",
      subjects: [
        { name: "Bangla", marks: 88, fullMarks: 100, grade: "A+" },
        { name: "English", marks: 82, fullMarks: 100, grade: "A+" },
        { name: "General Mathematics", marks: 95, fullMarks: 100, grade: "A+" },
        { name: "Physics", marks: 79, fullMarks: 100, grade: "A" },
        { name: "Chemistry", marks: 85, fullMarks: 100, grade: "A+" },
        { name: "Higher Mathematics", marks: 91, fullMarks: 100, grade: "A+" },
      ],
      remarks: "Excellent academic performance and analytical skills. Keep up the high standard!",
      signatory1: "Class Teacher",
      signatory2: "Headmaster / Principal",
    },
  },
  {
    id: "doctor-prescription",
    slug: "doctor-prescription",
    title: "Doctor & Clinic Prescription Pad (Rx)",
    category: "Healthcare",
    paperSize: "A4",
    badge: "Clinics & Doctors",
    description: "Professional doctor prescription layout with patient vitals, diagnosis, medicines with dosage instructions, and advice.",
    defaultData: {
      doctorName: "Dr. Farhana Yasmin, MBBS, FCPS",
      degrees: "Specialist in Internal Medicine & Diabetes Care",
      regNo: "BMDC Reg No: A-54321",
      hospitalName: "Popular Diagnostic & Care Center",
      phone: "+880 1911-223344",
      date: "2026-11-11",
      patientName: "Kamal Hossain",
      patientAge: "45 Yrs",
      patientGender: "Male",
      patientWeight: "68 kg",
      bp: "125/85 mmHg",
      complaints: "Mild fever and dry cough for 3 days.",
      medicines: [
        { name: "Tab. Napa Extra 665mg", dosage: "1 + 0 + 1 (After Meal)", duration: "5 Days" },
        { name: "Tab. Fexo 120mg", dosage: "0 + 0 + 1 (At Night)", duration: "7 Days" },
        { name: "Syr. Adrylex", dosage: "2 Teaspoon 3 times daily", duration: "5 Days" },
      ],
      advice: "Drink plenty of warm water. Avoid cold drinks and dust. Return for follow-up if symptoms persist after 5 days.",
      signatoryTitle: "Doctor's Signature & Seal",
    },
  },
  {
    id: "restaurant-pos-bill",
    slug: "restaurant-pos-bill",
    title: "Restaurant & Cafe Food Bill (Thermal Receipt)",
    category: "Restaurant",
    paperSize: "POS_80MM",
    badge: "Thermal 80mm",
    description: "Dine-in and takeaway food receipt formatted for standard 80mm POS thermal printers. Auto VAT & service charge.",
    defaultData: {
      restaurantName: "Dhaba & BBQ Nights",
      branch: "Banani Branch, Road 11",
      phone: "+880 1788-990011",
      billNo: "BILL-5491",
      tableNo: "Table 04",
      waiter: "Sujon",
      date: "2026-11-11 15:30",
      currency: "৳",
      items: [
        { name: "Chicken Dum Biryani (Spl)", quantity: 2, price: 380 },
        { name: "Chicken Reshmi Kebab (4pc)", quantity: 1, price: 420 },
        { name: "Butter Naan", quantity: 3, price: 60 },
        { name: "Mint Borhani (Glass)", quantity: 2, price: 90 },
      ],
      vatPercent: 5,
      serviceCharge: 50,
      discount: 0,
      footerMessage: "Thank you for dining with us! Please visit again.",
    },
  },
  {
    id: "daily-habit-planner",
    slug: "daily-productivity-planner",
    title: "Daily Focus & Habit Tracker (Printable)",
    category: "Printables",
    paperSize: "A4",
    badge: "Lifestyle & Study",
    description: "Aesthetic minimal daily planner for students and professionals. Top priorities, hourly schedule, and water intake tracker.",
    defaultData: {
      title: "Daily Focus & Master Plan",
      date: "2026-11-11",
      quote: "Small daily improvements over time lead to stunning results.",
      topPriorities: [
        "Complete client invoice template review",
        "Publish 3 social media product posts",
        "Review weekly budget and profit sheet",
      ],
      schedule: [
        { time: "09:00 AM", task: "Review order messages & packing list" },
        { time: "11:30 AM", task: "Dispatch courier parcels" },
        { time: "02:00 PM", task: "Inventory check & supplier coordination" },
        { time: "05:00 PM", task: "Customer support & review replies" },
      ],
      notes: "Remember to drink 8 glasses of water and take 15 min walking break.",
    },
  },
];
