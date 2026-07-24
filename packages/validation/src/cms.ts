import { z } from "zod";

export const CmsSectionTypeEnum = z.enum([
  "HERO",
  "TRUST_BAR",
  "LOGO_CLOUD",
  "RICH_TEXT",
  "STATS",
  "FEATURE_GRID",
  "PROCESS_STEPS",
  "PROGRAM_CARDS",
  "PRICING",
  "TESTIMONIALS",
  "FAQ",
  "CTA",
  "CONTACT",
  "LEGAL_TEXT",
  "PROBLEM",
  "FINAL_CTA",
]);

export const HeroSectionSchema = z.object({
  eyebrow: z.string().optional(),
  headline: z.string().min(1, "Headline is required"),
  subtitle: z.string().optional(),
  primaryCtaLabel: z.string().optional(),
  primaryCtaLink: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  trustNote: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const TrustStripItemSchema = z.object({
  icon: z.string(),
  text: z.string(),
});

export const TrustStripSectionSchema = z.object({
  items: z.array(TrustStripItemSchema).max(6),
});

export const ProblemSectionSchema = z.object({
  headline: z.string(),
  paragraphs: z.array(z.string()),
});

export const ProcessStepSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const ProcessSectionSchema = z.object({
  title: z.string(),
  steps: z.array(ProcessStepSchema),
});

export const ProgramCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.string().optional(),
  features: z.array(z.string()),
  ctaLabel: z.string(),
  ctaLink: z.string().optional(),
  isRecommended: z.boolean().default(false),
});

export const ProgramCardsSectionSchema = z.object({
  headline: z.string(),
  programs: z.array(ProgramCardSchema),
});

export const FinalCtaSectionSchema = z.object({
  headline: z.string(),
  subtitle: z.string().optional(),
  ctaLabel: z.string(),
  ctaLink: z.string().optional(),
  variant: z.enum(["A", "B"]).default("A"),
});

export const RichTextSectionSchema = z.object({
  content: z.string(),
});

export const LogoCloudSectionSchema = z.object({
  headline: z.string().optional(),
  logos: z.array(z.object({
    name: z.string(),
    imageUrl: z.string(),
    url: z.string().optional(),
  })).max(12),
});

export const StatItemSchema = z.object({
  value: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

export const StatsSectionSchema = z.object({
  headline: z.string().optional(),
  subtitle: z.string().optional(),
  stats: z.array(StatItemSchema).min(1).max(6),
});

export const FeatureItemSchema = z.object({
  icon: z.string().optional(),
  title: z.string(),
  description: z.string(),
});

export const FeatureGridSectionSchema = z.object({
  headline: z.string(),
  subtitle: z.string().optional(),
  features: z.array(FeatureItemSchema).min(1).max(9),
});

export const PricingTierSchema = z.object({
  name: z.string(),
  price: z.string(),
  period: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()),
  ctaLabel: z.string(),
  ctaLink: z.string().optional(),
  isHighlighted: z.boolean().default(false),
});

export const PricingSectionSchema = z.object({
  headline: z.string(),
  subtitle: z.string().optional(),
  tiers: z.array(PricingTierSchema).min(1).max(4),
});

export const TestimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
  avatarUrl: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});

export const TestimonialsSectionSchema = z.object({
  headline: z.string(),
  subtitle: z.string().optional(),
  testimonials: z.array(TestimonialSchema).min(1).max(8),
});

export const FaqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const FaqSectionSchema = z.object({
  headline: z.string(),
  subtitle: z.string().optional(),
  items: z.array(FaqItemSchema).min(1).max(20),
});

export const CtaSectionSchema = z.object({
  headline: z.string(),
  subtitle: z.string().optional(),
  ctaLabel: z.string(),
  ctaLink: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  variant: z.enum(["light", "dark", "teal"]).default("light"),
});

export const ContactSectionSchema = z.object({
  headline: z.string(),
  subtitle: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  showForm: z.boolean().default(true),
});

export const LegalTextSectionSchema = z.object({
  title: z.string(),
  lastUpdated: z.string().optional(),
  content: z.string(),
});

export const CmsSectionDataSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("HERO"), data: HeroSectionSchema }),
  z.object({ type: z.literal("TRUST_BAR"), data: TrustStripSectionSchema }),
  z.object({ type: z.literal("LOGO_CLOUD"), data: LogoCloudSectionSchema }),
  z.object({ type: z.literal("RICH_TEXT"), data: RichTextSectionSchema }),
  z.object({ type: z.literal("STATS"), data: StatsSectionSchema }),
  z.object({ type: z.literal("FEATURE_GRID"), data: FeatureGridSectionSchema }),
  z.object({ type: z.literal("PROCESS_STEPS"), data: ProcessSectionSchema }),
  z.object({ type: z.literal("PROGRAM_CARDS"), data: ProgramCardsSectionSchema }),
  z.object({ type: z.literal("PRICING"), data: PricingSectionSchema }),
  z.object({ type: z.literal("TESTIMONIALS"), data: TestimonialsSectionSchema }),
  z.object({ type: z.literal("FAQ"), data: FaqSectionSchema }),
  z.object({ type: z.literal("CTA"), data: CtaSectionSchema }),
  z.object({ type: z.literal("CONTACT"), data: ContactSectionSchema }),
  z.object({ type: z.literal("LEGAL_TEXT"), data: LegalTextSectionSchema }),
  z.object({ type: z.literal("PROBLEM"), data: ProblemSectionSchema }),
  z.object({ type: z.literal("FINAL_CTA"), data: FinalCtaSectionSchema }),
]);

export type HeroSectionData = z.infer<typeof HeroSectionSchema>;
export type TrustStripSectionData = z.infer<typeof TrustStripSectionSchema>;
export type ProblemSectionData = z.infer<typeof ProblemSectionSchema>;
export type ProcessSectionData = z.infer<typeof ProcessSectionSchema>;
export type ProgramCardsSectionData = z.infer<typeof ProgramCardsSectionSchema>;
export type FinalCtaSectionData = z.infer<typeof FinalCtaSectionSchema>;
export type RichTextSectionData = z.infer<typeof RichTextSectionSchema>;
export type LogoCloudSectionData = z.infer<typeof LogoCloudSectionSchema>;
export type StatsSectionData = z.infer<typeof StatsSectionSchema>;
export type FeatureGridSectionData = z.infer<typeof FeatureGridSectionSchema>;
export type PricingSectionData = z.infer<typeof PricingSectionSchema>;
export type TestimonialsSectionData = z.infer<typeof TestimonialsSectionSchema>;
export type FaqSectionData = z.infer<typeof FaqSectionSchema>;
export type CtaSectionData = z.infer<typeof CtaSectionSchema>;
export type ContactSectionData = z.infer<typeof ContactSectionSchema>;
export type LegalTextSectionData = z.infer<typeof LegalTextSectionSchema>;
export type CmsSectionData = z.infer<typeof CmsSectionDataSchema>;
