import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { INITIAL_TEMPLATES, TemplateDefinition } from "@/lib/templates";

export interface TemplateBlock {
  id: string;
  type: string;
  titleEn: string;
  titleBn: string;
  enabled: boolean;
  order: number;
  descriptionEn?: string;
  descriptionBn?: string;
  options?: Record<string, any>;
}

// Allowed component types in the Smart CMS
export const ALLOWED_BLOCK_TYPES = [
  "header",
  "meta",
  "recipient",
  "table",
  "summary",
  "signatory",
  "terms",
  "callout",
  "qrcode",
  "custom",
];

// Reserved slugs to prevent URL hijacking and prototype pollution
const RESERVED_SLUGS = new Set([
  "api",
  "admin",
  "login",
  "register",
  "dashboard",
  "templates",
  "auth",
  "profile",
  "contact",
  "about",
  "privacy",
  "terms",
  "sitemap",
  "robots",
  "ads",
  "null",
  "undefined",
  "__proto__",
  "constructor",
  "settings",
  "history",
  "users",
  "documents",
]);

// Security: Strip dangerous script and HTML tags to prevent stored XSS
function sanitizeText(val: any, maxLength = 500): string {
  if (typeof val !== "string") return "";
  const cleaned = val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/onerror\s*=/gi, "")
    .replace(/onload\s*=/gi, "")
    .replace(/onclick\s*=/gi, "")
    .trim();
  return cleaned.slice(0, maxLength);
}

// Security: Sanitize line items inside dynamic tables
function sanitizeLineItems(rawItems: any[]): Array<{ name: string; quantity: number; price: number; unit?: string }> {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return [
      { name: "Premium Formal Cotton Shirt", quantity: 2, price: 1250 },
      { name: "Standard Consultation / Service Fee", quantity: 1, price: 500 },
    ];
  }
  return rawItems.slice(0, 50).map((it, idx) => ({
    name: sanitizeText(it?.name || `Item ${idx + 1}`, 100),
    quantity: Math.max(1, Math.min(999999, Number(it?.quantity) || 1)),
    price: Math.max(0, Math.min(99999999, Number(it?.price) || 0)),
    unit: it?.unit ? sanitizeText(it.unit, 20) : undefined,
  }));
}

// Security: Sanitize full dynamic template data
function sanitizeDefaultData(raw: any, fallbackTitle: string, currency: string, isBangla = false) {
  if (!raw || typeof raw !== "object") {
    return {
      businessName: fallbackTitle,
      tagline: isBangla ? "গুণগত মানসম্পন্ন সেবা ও দ্রুততম ডেলিভারি" : "Quality Products & Diagnostic Services",
      phone: isBangla ? "০১৭১২-০০০০০০" : "+880 1712-000000",
      address: isBangla ? "ঢাকা - ১২০৫, বাংলাদেশ" : "Dhaka - 1205, Bangladesh",
      invoiceNumber: isBangla ? "মেমো-০০১" : "INV-001",
      date: new Date().toISOString().split("T")[0],
      courierPartner: "Steadfast Courier",
      customerName: isBangla ? "মোঃ তানভীর আহমেদ" : "Md. Tanvir Ahmed",
      customerPhone: "+880 1819-000000",
      customerAddress: isBangla ? "মিরপুর-১০, ঢাকা" : "Mirpur-10, Dhaka",
      currency: currency || "৳",
      items: sanitizeLineItems([]),
      deliveryCharge: 60,
      discount: 0,
      paidAmount: 0,
      notes: isBangla ? "আমাদের সেবা গ্রহণ করার জন্য আপনাকে ধন্যবাদ।" : "Thank you for doing business with us.",
      signatoryTitle: isBangla ? "অনুমোদিত স্বাক্ষর" : "Authorized Signature",
    };
  }

  return {
    businessName: sanitizeText(raw.businessName || fallbackTitle, 120),
    tagline: sanitizeText(raw.tagline || "", 150),
    phone: sanitizeText(raw.phone || "", 60),
    address: sanitizeText(raw.address || "", 200),
    invoiceNumber: sanitizeText(raw.invoiceNumber || (isBangla ? "মেমো-০০১" : "INV-001"), 60),
    date: sanitizeText(raw.date || new Date().toISOString().split("T")[0], 40),
    courierPartner: sanitizeText(raw.courierPartner || "Steadfast Courier", 60),
    customerName: sanitizeText(raw.customerName || (isBangla ? "মোঃ তানভীর আহমেদ" : "Md. Tanvir Ahmed"), 100),
    customerPhone: sanitizeText(raw.customerPhone || "+880 1819-000000", 60),
    customerAddress: sanitizeText(raw.customerAddress || (isBangla ? "মিরপুর-১০, ঢাকা" : "Mirpur-10, Dhaka"), 200),
    currency: sanitizeText(raw.currency || currency || "৳", 10),
    items: sanitizeLineItems(raw.items),
    deliveryCharge: Math.max(0, Math.min(999999, Number(raw.deliveryCharge) || 0)),
    discount: Math.max(0, Math.min(999999, Number(raw.discount) || 0)),
    paidAmount: Math.max(0, Math.min(99999999, Number(raw.paidAmount) || 0)),
    notes: sanitizeText(raw.notes || "", 300),
    signatoryTitle: sanitizeText(raw.signatoryTitle || (isBangla ? "অনুমোদিত স্বাক্ষর" : "Authorized Signature"), 60),
    contacts: Array.isArray(raw.contacts)
      ? raw.contacts.slice(0, 10).map((c: any) => ({
          id: sanitizeText(c?.id || "", 40),
          label: sanitizeText(c?.label || "", 40),
          value: sanitizeText(c?.value || "", 100),
        }))
      : undefined,
    metaItems: Array.isArray(raw.metaItems)
      ? raw.metaItems.slice(0, 10).map((m: any) => ({
          id: sanitizeText(m?.id || "", 40),
          label: sanitizeText(m?.label || "", 40),
          value: sanitizeText(m?.value || "", 100),
        }))
      : undefined,
  };
}

// Security: Validate and sanitize blocks
function sanitizeBlocks(rawBlocks: any[]): TemplateBlock[] {
  if (!Array.isArray(rawBlocks)) return DEFAULT_TEMPLATE_BLOCKS;

  // Max 30 blocks per template to prevent DoS via massive payloads
  const sliced = rawBlocks.slice(0, 30);

  return sliced.map((b, index) => {
    const rawType = typeof b.type === "string" ? b.type.toLowerCase().trim() : "custom";
    const type = ALLOWED_BLOCK_TYPES.includes(rawType) ? rawType : "custom";
    const id = typeof b.id === "string" ? b.id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 50) : `block_${index}`;

    const titleEn = sanitizeText(b.titleEn || "Custom Block", 80);
    const titleBn = sanitizeText(b.titleBn || "কাস্টম সেকশন", 80);
    const descriptionEn = sanitizeText(b.descriptionEn || "", 200);
    const descriptionBn = sanitizeText(b.descriptionBn || "", 200);

    const safeOptions: Record<string, any> = {};
    if (b.options && typeof b.options === "object" && !Array.isArray(b.options)) {
      for (const [k, v] of Object.entries(b.options)) {
        const safeKey = k.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 30);
        if (typeof v === "boolean" || typeof v === "number") {
          safeOptions[safeKey] = v;
        } else if (typeof v === "string") {
          safeOptions[safeKey] = sanitizeText(v, 200);
        }
      }
    }

    return {
      id,
      type,
      titleEn,
      titleBn,
      enabled: Boolean(b.enabled !== false),
      order: index,
      descriptionEn,
      descriptionBn,
      options: safeOptions,
    };
  });
}

export const DEFAULT_TEMPLATE_BLOCKS: TemplateBlock[] = [
  {
    id: "header",
    type: "header",
    titleEn: "Brand & Organization Header",
    titleBn: "প্রতিষ্ঠান ও ব্র্যান্ড পরিচিতি",
    enabled: true,
    order: 0,
    descriptionEn: "Business/Institute name, logo, phone, address, and license/BIN",
    descriptionBn: "প্রতিষ্ঠান বা ক্লিনিকের নাম, লোগো, ফোন নম্বর, ঠিকানা ও বিআইএন",
    options: { showLogo: true, showTagline: true, showContact: true, showTaxId: false, headerTheme: "modern" },
  },
  {
    id: "meta",
    type: "meta",
    titleEn: "Document Identifier & Date Info",
    titleBn: "নথির তথ্য ও তারিখ",
    enabled: true,
    order: 1,
    descriptionEn: "Invoice / Rx / Token No, issue date, due date, courier",
    descriptionBn: "চালান / প্রেসক্রিপশন নম্বর, তারিখ ও কুরিয়ার তথ্য",
    options: { showDate: true, showDueDate: false, showCourier: true },
  },
  {
    id: "recipient",
    type: "recipient",
    titleEn: "Customer / Recipient Profile",
    titleBn: "ক্রেতা বা প্রাপকের তথ্য",
    enabled: true,
    order: 2,
    descriptionEn: "Customer name, mobile number, delivery address or patient/student info",
    descriptionBn: "ক্রেতার নাম, মোবাইল, ঠিকানা বা রোগীর বিবরণ",
    options: { showPhone: true, showAddress: true, showCustomId: false },
  },
  {
    id: "table",
    type: "table",
    titleEn: "Dynamic Itemized Table",
    titleBn: "পণ্য বা সেবার বিবরণী ছক",
    enabled: true,
    order: 3,
    descriptionEn: "Line items table with quantity, unit price, and calculated amount",
    descriptionBn: "পণ্য বা সেবার তালিকা, পরিমাণ, একক মূল্য এবং মোট টাকা",
    options: { showQuantity: true, showUnitPrice: true, showItemCode: false, tableTheme: "bordered" },
  },
  {
    id: "summary",
    type: "summary",
    titleEn: "Financial Totals & Due Calculation",
    titleBn: "হিসাব ও মোট টাকার বিবরণ",
    enabled: true,
    order: 4,
    descriptionEn: "Subtotal, VAT/Tax %, delivery fee, special discount, and due balance",
    descriptionBn: "মোট মূল্য, ভ্যাট, ডেলিভারি চার্জ, ছাড় ও বকেয়া টাকার হিসাব",
    options: { showTax: false, showDiscount: true, showDelivery: true, showPaidDue: true },
  },
  {
    id: "signatory",
    type: "signatory",
    titleEn: "Signatory Authority & Official Stamp",
    titleBn: "অনুমোদিত স্বাক্ষর ও সিল",
    enabled: true,
    order: 5,
    descriptionEn: "Official authorized signature, BMDC doctor seal, or cashier signature",
    descriptionBn: "কর্মকর্তার স্বাক্ষর, বিএমডিসি চিকিৎসকের সিল বা ক্যাশিয়ার স্বাক্ষর",
    options: { showSeal: true, titleEn: "Authorized Signature", titleBn: "অনুমোদিত স্বাক্ষর" },
  },
  {
    id: "terms",
    type: "terms",
    titleEn: "Terms, Conditions & Return Notes",
    titleBn: "শর্তাবলি ও মন্তব্য",
    enabled: true,
    order: 6,
    descriptionEn: "Return warranty policy, payment instructions (bKash/Nagad), footer notes",
    descriptionBn: "পণ্য ফেরতের শর্ত, বিকাশ বা ব্যাংক পেমেন্ট তথ্য এবং ফুটনোট",
    options: { showFooterNote: true },
  },
];

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const admin = await getAdminSession(token);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const categoryFilter = searchParams.get("category");
  const searchFilter = (searchParams.get("search") || "").trim().toLowerCase();

  try {
    // 1. Fetch categories from DB
    const dbCategories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    // 2. Fetch custom templates from DB
    const dbTemplates = await prisma.template.findMany({
      include: {
        category: true,
        createdBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 3. Transform DB templates to TemplateDefinition
    const customTemplates: (TemplateDefinition & { isCustom: boolean; blocks?: TemplateBlock[] })[] = dbTemplates.map((t) => {
      const fieldSchema = (t.fieldSchema as any) || {};
      return {
        id: t.id,
        slug: t.slug,
        title: t.title,
        description: t.description || "",
        category: (t.category?.name as any) || "Business",
        paperSize: (t.paperSize as any) || "A4",
        badge: t.isFeatured ? "Featured" : "Custom Template",
        isCustom: true,
        blocks: sanitizeBlocks(fieldSchema.blocks || DEFAULT_TEMPLATE_BLOCKS),
        defaultData: fieldSchema.locales?.en?.defaultData || fieldSchema.defaultData || {
          businessName: t.title,
          currency: "৳",
          items: [{ name: "Sample Item", quantity: 1, price: 100 }],
        },
        locales: {
          en: fieldSchema.locales?.en || {
            title: t.title,
            description: t.description || "",
            badge: "English Edition",
            defaultData: {
              businessName: t.title,
              currency: "৳",
              items: [{ name: "Sample Item", quantity: 1, price: 100 }],
            },
          },
          bn: fieldSchema.locales?.bn || {
            title: t.title,
            description: t.description || "",
            badge: "বাংলা সংস্করণ",
            defaultData: {
              businessName: t.title,
              currency: "৳",
              items: [{ name: "নমুনা পণ্য", quantity: 1, price: 100 }],
            },
          },
        },
      };
    });

    // 4. Combine system templates with custom templates
    const systemTemplatesWithFlag = INITIAL_TEMPLATES.map((t) => ({
      ...t,
      isCustom: false,
      blocks: DEFAULT_TEMPLATE_BLOCKS,
    }));

    let combined = [...customTemplates, ...systemTemplatesWithFlag];

    // Filter by category if requested
    if (categoryFilter && categoryFilter !== "all") {
      combined = combined.filter(
        (t) => t.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Filter by search query if requested
    if (searchFilter) {
      combined = combined.filter((t) => {
        const enTitle = t.locales?.en?.title?.toLowerCase() || t.title.toLowerCase();
        const bnTitle = t.locales?.bn?.title?.toLowerCase() || "";
        const descEn = t.locales?.en?.description?.toLowerCase() || t.description.toLowerCase();
        const descBn = t.locales?.bn?.description?.toLowerCase() || "";
        const slug = t.slug.toLowerCase();

        return (
          enTitle.includes(searchFilter) ||
          bnTitle.includes(searchFilter) ||
          descEn.includes(searchFilter) ||
          descBn.includes(searchFilter) ||
          slug.includes(searchFilter)
        );
      });
    }

    return NextResponse.json({
      dbOnline: true,
      templates: combined,
      categories: dbCategories,
      metrics: {
        total: combined.length,
        system: systemTemplatesWithFlag.length,
        custom: customTemplates.length,
        byCategory: {
          business: combined.filter((t) => t.category === "Business").length,
          healthcare: combined.filter((t) => t.category === "Healthcare").length,
          education: combined.filter((t) => t.category === "Education").length,
          restaurant: combined.filter((t) => t.category === "Restaurant").length,
          printables: combined.filter((t) => t.category === "Printables").length,
        },
      },
    });
  } catch (error: any) {
    // Offline / fallback mode
    const systemTemplatesWithFlag = INITIAL_TEMPLATES.map((t) => ({
      ...t,
      isCustom: false,
      blocks: DEFAULT_TEMPLATE_BLOCKS,
    }));

    let filtered = systemTemplatesWithFlag;
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter(
        (t) => t.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    if (searchFilter) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(searchFilter) ||
        t.slug.toLowerCase().includes(searchFilter)
      );
    }

    return NextResponse.json({
      dbOnline: false,
      templates: filtered,
      categories: [
        { id: "cat-1", name: "Business", slug: "business" },
        { id: "cat-2", name: "Healthcare", slug: "healthcare" },
        { id: "cat-3", name: "Education", slug: "education" },
        { id: "cat-4", name: "Restaurant", slug: "restaurant" },
        { id: "cat-5", name: "Printables", slug: "printables" },
      ],
      metrics: {
        total: filtered.length,
        system: filtered.length,
        custom: 0,
        byCategory: {
          business: filtered.filter((t) => t.category === "Business").length,
          healthcare: filtered.filter((t) => t.category === "Healthcare").length,
          education: filtered.filter((t) => t.category === "Education").length,
          restaurant: filtered.filter((t) => t.category === "Restaurant").length,
          printables: filtered.filter((t) => t.category === "Printables").length,
        },
      },
    });
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const admin = await getAdminSession(token);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
  }

  try {
    const body = await req.json();

    // 1. Strict Server-Side Validation & Sanitization
    const rawSlug = (body.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const slug = rawSlug.slice(0, 60);

    const categoryName = sanitizeText(body.category || "Business", 40);
    const paperSize = body.paperSize === "POS_80MM" ? "POS_80MM" : "A4";

    const enTitle = sanitizeText(body.en_title || "", 120);
    const enDescription = sanitizeText(body.en_description || "", 500);
    const enSignatory = sanitizeText(body.en_signatory || "Authorized Signature", 60);
    const enCurrency = sanitizeText(body.en_currency || "৳", 10);

    const bnTitle = sanitizeText(body.bn_title || "", 120);
    const bnDescription = sanitizeText(body.bn_description || "", 500);
    const bnSignatory = sanitizeText(body.bn_signatory || "অনুমোদিত স্বাক্ষর", 60);
    const bnCurrency = sanitizeText(body.bn_currency || "৳", 10);

    const blocks = sanitizeBlocks(body.blocks || []);

    if (!slug || slug.length < 3) {
      return NextResponse.json({ error: "A valid URL slug (at least 3 characters, alphanumeric with hyphens) is required." }, { status: 400 });
    }

    if (RESERVED_SLUGS.has(slug)) {
      return NextResponse.json({
        error: `The slug '${slug}' is a reserved system keyword. Please choose a distinct slug.`,
      }, { status: 400 });
    }

    if (!enTitle || !enDescription) {
      return NextResponse.json({ error: "English Title and Description are strictly required." }, { status: 400 });
    }

    // MANDATORY BILINGUAL PARITY ENFORCEMENT
    if (!bnTitle || !bnDescription) {
      return NextResponse.json({
        error: "Bilingual Parity Requirement: Bangla (বাংলা) Title and Description are mandatory before publishing.",
      }, { status: 400 });
    }

    // Check slug collision against system templates
    const isSystemSlug = INITIAL_TEMPLATES.some((t) => t.slug === slug);
    if (isSystemSlug) {
      return NextResponse.json({
        error: `The slug '${slug}' is reserved for built-in system templates. Please pick a distinct custom slug.`,
      }, { status: 400 });
    }

    // Check slug collision against DB
    const existing = await prisma.template.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({
        error: `A template with slug '${slug}' already exists in the database.`,
      }, { status: 400 });
    }

    // Ensure category exists
    const categoryRecord = await prisma.category.upsert({
      where: { slug: categoryName.toLowerCase() },
      update: { name: categoryName },
      create: {
        name: categoryName,
        slug: categoryName.toLowerCase(),
        icon: categoryName === "Healthcare" ? "stethoscope" : categoryName === "Education" ? "graduation-cap" : "briefcase",
      },
    });

    // Sanitize dynamic defaultData for English & Bangla
    const defaultDataEn = sanitizeDefaultData(
      body.defaultDataEn || body.defaultData || body.locales?.en?.defaultData,
      enTitle,
      enCurrency,
      false
    );
    const defaultDataBn = sanitizeDefaultData(
      body.defaultDataBn || body.locales?.bn?.defaultData,
      bnTitle,
      bnCurrency,
      true
    );

    // Create custom template
    const newTemplate = await prisma.template.create({
      data: {
        title: enTitle,
        slug,
        description: enDescription,
        paperSize,
        categoryId: categoryRecord.id,
        createdById: admin.userId,
        isFeatured: Boolean(body.isFeatured),
        isApproved: true,
        fieldSchema: {
          blocks,
          paperSize,
          category: categoryName,
          defaultData: defaultDataEn,
          locales: {
            en: {
              title: enTitle,
              description: enDescription,
              badge: "Admin Custom Template",
              defaultData: defaultDataEn,
            },
            bn: {
              title: bnTitle,
              description: bnDescription,
              badge: "কাস্টম এডমিন টেমপ্লেট",
              defaultData: defaultDataBn,
            },
          },
        } as any,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "New dual-locale template published successfully!",
      template: newTemplate,
    });
  } catch (error: any) {
    console.error("Template creation error:", error);
    return NextResponse.json({
      error: error.message || "Failed to create template in database.",
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const admin = await getAdminSession(token);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = typeof body.id === "string" ? body.id : undefined;
    const slug = (body.slug || "").trim().toLowerCase();

    if (!id && !slug) {
      return NextResponse.json({ error: "Template ID or Slug required for update." }, { status: 400 });
    }

    const enTitle = sanitizeText(body.en_title || "", 120);
    const bnTitle = sanitizeText(body.bn_title || "", 120);
    const enDescription = sanitizeText(body.en_description || "", 500);
    const bnDescription = sanitizeText(body.bn_description || "", 500);

    if (!enTitle || !bnTitle) {
      return NextResponse.json({
        error: "Both English and Bangla titles are strictly required.",
      }, { status: 400 });
    }

    // Find custom template in DB
    const existing = await prisma.template.findFirst({
      where: {
        OR: [{ id: id || undefined }, { slug: slug || undefined }],
      },
    });

    if (!existing) {
      return NextResponse.json({
        error: "Custom template not found in database. System templates are read-only source files.",
      }, { status: 404 });
    }

    const blocks = sanitizeBlocks(body.blocks || (existing.fieldSchema as any)?.blocks || DEFAULT_TEMPLATE_BLOCKS);
    const enCurrency = sanitizeText(body.en_currency || "৳", 10);
    const bnCurrency = sanitizeText(body.bn_currency || "৳", 10);

    const defaultDataEn = sanitizeDefaultData(
      body.defaultDataEn || body.defaultData || (existing.fieldSchema as any)?.defaultData || (existing.fieldSchema as any)?.locales?.en?.defaultData,
      enTitle,
      enCurrency,
      false
    );
    const defaultDataBn = sanitizeDefaultData(
      body.defaultDataBn || (existing.fieldSchema as any)?.locales?.bn?.defaultData,
      bnTitle,
      bnCurrency,
      true
    );

    const updated = await prisma.template.update({
      where: { id: existing.id },
      data: {
        title: enTitle,
        description: enDescription || existing.description,
        paperSize: body.paperSize === "POS_80MM" ? "POS_80MM" : "A4",
        fieldSchema: {
          blocks,
          defaultData: defaultDataEn,
          locales: {
            en: {
              title: enTitle,
              description: enDescription,
              badge: "Admin Custom Template",
              defaultData: defaultDataEn,
            },
            bn: {
              title: bnTitle,
              description: bnDescription,
              badge: "কাস্টম এডমিন টেমপ্লেট",
              defaultData: defaultDataBn,
            },
          },
        } as any,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Template updated successfully!",
      template: updated,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || "Failed to update template.",
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const admin = await getAdminSession(token);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json({ error: "Template ID or slug is required for deletion." }, { status: 400 });
    }

    // Check if it's a system template
    if (slug && INITIAL_TEMPLATES.some((t) => t.slug === slug)) {
      return NextResponse.json({
        error: "System templates are core built-in assets and cannot be deleted from disk.",
      }, { status: 400 });
    }

    const existing = await prisma.template.findFirst({
      where: {
        OR: [{ id: id || undefined }, { slug: slug || undefined }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Custom template not found in database." }, { status: 404 });
    }

    await prisma.template.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      success: true,
      message: `Template '${existing.title}' deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || "Failed to delete template.",
    }, { status: 500 });
  }
}
