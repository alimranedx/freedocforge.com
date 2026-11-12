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
    options: { showLogo: true, showTagline: true, showContact: true, showTaxId: false },
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
    options: { showQuantity: true, showUnitPrice: true, showItemCode: false },
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
        category: (t.category.name as any) || "Business",
        paperSize: (t.paperSize as any) || "A4",
        badge: t.isFeatured ? "Featured" : "Custom Template",
        isCustom: true,
        blocks: fieldSchema.blocks || DEFAULT_TEMPLATE_BLOCKS,
        defaultData: fieldSchema.locales?.en?.defaultData || fieldSchema.defaultData || {
          businessName: "Sample Business",
          currency: "৳",
          items: [{ name: "Sample Item", quantity: 1, price: 100 }],
        },
        locales: {
          en: fieldSchema.locales?.en || {
            title: t.title,
            description: t.description || "",
            badge: "English Edition",
            defaultData: {
              businessName: "Sample Business",
              currency: "৳",
              items: [{ name: "Sample Item", quantity: 1, price: 100 }],
            },
          },
          bn: fieldSchema.locales?.bn || {
            title: t.title,
            description: t.description || "",
            badge: "বাংলা সংস্করণ",
            defaultData: {
              businessName: "নমুনা প্রতিষ্ঠান",
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

    // 1. Strict Server-Side Validation
    const slug = (body.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    const categoryName = (body.category || "Business").trim();
    const paperSize = body.paperSize === "POS_80MM" ? "POS_80MM" : "A4";

    const enTitle = (body.en_title || "").trim();
    const enDescription = (body.en_description || "").trim();
    const enSignatory = (body.en_signatory || "Authorized Signature").trim();
    const enCurrency = (body.en_currency || "৳").trim();

    const bnTitle = (body.bn_title || "").trim();
    const bnDescription = (body.bn_description || "").trim();
    const bnSignatory = (body.bn_signatory || "অনুমোদিত স্বাক্ষর").trim();
    const bnCurrency = (body.bn_currency || "৳").trim();

    const blocks: TemplateBlock[] = Array.isArray(body.blocks) && body.blocks.length > 0
      ? body.blocks
      : DEFAULT_TEMPLATE_BLOCKS;

    if (!slug || slug.length < 3) {
      return NextResponse.json({ error: "A valid URL slug (at least 3 characters) is required." }, { status: 400 });
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
          defaultData: {
            businessName: enTitle,
            invoiceNumber: "INV-001",
            date: new Date().toISOString().split("T")[0],
            currency: enCurrency,
            items: [
              { name: "Sample Service or Item 01", quantity: 1, price: 1000 },
              { name: "Sample Service or Item 02", quantity: 2, price: 500 },
            ],
            signatoryTitle: enSignatory,
            deliveryCharge: 60,
            discount: 0,
            notes: "Thank you for doing business with us.",
          },
          locales: {
            en: {
              title: enTitle,
              description: enDescription,
              badge: "Admin Custom Template",
              defaultData: {
                businessName: enTitle,
                invoiceNumber: "INV-001",
                date: new Date().toISOString().split("T")[0],
                currency: enCurrency,
                items: [
                  { name: "Sample Service or Item 01", quantity: 1, price: 1000 },
                  { name: "Sample Service or Item 02", quantity: 2, price: 500 },
                ],
                signatoryTitle: enSignatory,
                deliveryCharge: 60,
                discount: 0,
                notes: "Thank you for doing business with us.",
              },
            },
            bn: {
              title: bnTitle,
              description: bnDescription,
              badge: "কাস্টম এডমিন টেমপ্লেট",
              defaultData: {
                businessName: bnTitle,
                invoiceNumber: "মেমো-০০১",
                date: new Date().toLocaleDateString("bn-BD"),
                currency: bnCurrency,
                items: [
                  { name: "নমুনা পণ্য বা সেবা ০১", quantity: 1, price: 1000 },
                  { name: "নমুনা পণ্য বা সেবা ০২", quantity: 2, price: 500 },
                ],
                signatoryTitle: bnSignatory,
                deliveryCharge: 60,
                discount: 0,
                notes: "আমাদের সেবা গ্রহণ করার জন্য আপনাকে ধন্যবাদ।",
              },
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
    const id = body.id;
    const slug = (body.slug || "").trim().toLowerCase();

    if (!id && !slug) {
      return NextResponse.json({ error: "Template ID or Slug required for update." }, { status: 400 });
    }

    const enTitle = (body.en_title || "").trim();
    const bnTitle = (body.bn_title || "").trim();

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

    const updated = await prisma.template.update({
      where: { id: existing.id },
      data: {
        title: enTitle,
        description: body.en_description || existing.description,
        paperSize: body.paperSize === "POS_80MM" ? "POS_80MM" : "A4",
        fieldSchema: {
          blocks: body.blocks || (existing.fieldSchema as any)?.blocks || DEFAULT_TEMPLATE_BLOCKS,
          locales: {
            en: {
              title: enTitle,
              description: body.en_description || "",
              badge: "Admin Custom Template",
              defaultData: body.defaultDataEn || (existing.fieldSchema as any)?.locales?.en?.defaultData,
            },
            bn: {
              title: bnTitle,
              description: body.bn_description || "",
              badge: "কাস্টম এডমিন টেমপ্লেট",
              defaultData: body.defaultDataBn || (existing.fieldSchema as any)?.locales?.bn?.defaultData,
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
