export const e2eJourneys = [
  {
    id: "journey-a",
    title: "Journey A: Happy Path",
    description: "Parent submits application -> Director assigns -> Parent pays -> Test -> Specialist -> Video session -> Plan.",
    steps: [
      "Parent Popescu submits application for child Matei",
      "Consent versions V1 recorded for GDPR compliance",
      "Director approves case and assigns Specialist Ionescu",
      "Parent pays 1500 RON for assessment package via Stripe",
      "Webhook confirms payment -> Entitlement 'RIASEC_TEST' created",
      "Matei completes RIASEC test",
      "Specialist inputs structured results and prepares report",
      "Parent books video interpretation session",
      "Video URL generated via Zoom/Daily.co API",
      "Specialist creates Career Plan",
      "Career Plan published to Parent dashboard",
      "Case marked as COMPLETED_SUCCESSFULLY"
    ]
  },
  {
    id: "journey-b",
    title: "Journey B: Product Versioning",
    description: "Validates that active cases are immune to catalog changes.",
    steps: [
      "Parent purchases 'Consiliere' V1 (5 sessions × 50 min)",
      "Super Admin publishes 'Consiliere' V2 (9 sessions × 60 min)",
      "Parent books session -> Deducts from 5x50 pool",
      "New Parent B purchases 'Consiliere' -> Receives V2 (9x60 pool)"
    ]
  },
  {
    id: "journey-d",
    title: "Journey D: Multi-Child Family Isolation",
    description: "Validates RBAC and data boundaries for parents with multiple children.",
    steps: [
      "Parent registers Child A (Matei) and Child B (Ana)",
      "Matei assigned to Case A; Ana assigned to Case B",
      "Matei takes Assessment X; Ana takes Assessment Y",
      "Parent views Matei's Dashboard -> Validates ONLY Assessment X is visible",
      "Parent views Ana's Dashboard -> Validates ONLY Assessment Y is visible",
      "Specialist for Matei attempts to view Ana's case -> 403 FORBIDDEN"
    ]
  },
  {
    id: "journey-f",
    title: "Journey F: Scheduling Resilience",
    description: "Validates double-booking prevention and DST changes.",
    steps: [
      "Specialist opens slot at 14:00",
      "Parent A and Parent B click 'Book' at the exact same millisecond",
      "Transaction locks row -> Parent A gets slot",
      "Parent B receives 'Slot taken' error and is refreshed",
      "Parent A reschedules to 15:00",
      "System frees 14:00 slot and locks 15:00 slot",
      "Specialist marks themselves unavailable at 15:00 -> Parent A auto-notified"
    ]
  }
];
