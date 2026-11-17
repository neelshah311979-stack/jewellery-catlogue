export type Currency = 'INR' | 'USD';

export type GoldPurity = '10K' | '14K' | '18K' | 'Platinum 950';
export type GoldTone = 'Yellow Gold' | 'White Gold' | 'Rose Gold';

export type CategoryKey = 
  | 'all'
  | 'solitaires'
  | 'engagement-rings'
  | 'toi-et-moi-vintage'
  | 'pendants-necklaces'
  | 'fine-bracelets'
  | 'earrings'
  | 'bespoke-atelier';

export interface StoneDetails {
  type: string; // e.g. "VVS1 D-Color Lab Moissanite"
  caratWeight: number; // e.g. 2.5
  shape: string; // "Oval", "Emerald", "Pear", "Cushion", "Round", "Asscher", "Marquise", "Two-Stone Duo"
  dimensions: string; // e.g. "10 x 8 mm"
  colorGrade: 'D' | 'E' | 'F';
  clarityGrade: 'VVS1' | 'VVS2' | 'FL' | 'IF';
  cutGrade: 'Ideal Hearts & Arrows' | 'Excellent Step-Cut' | 'Antique Heritage Cut' | 'Ideal Hearts & Arrows / Step-Cut';
  refractiveIndex: string; // "2.65 - 2.69"
  dispersionFire: string; // "0.104 (2.4x higher than diamond)"
  mohsHardness: number; // 9.25
  polishSymmetry: 'Excellent / Excellent';
  graCertificateNumber: string; // e.g. "GRA-98241088"
  laserInscribed: boolean;
  accentStones?: string;
}

export interface PricingBreakdown {
  goldWeightGrams: number;
  goldPurity: GoldPurity;
  purityFactor: number;
  effectiveGoldRatePerGramInr: number;
  goldComponentInr: number;
  stoneComponentInr: number;
  makingChargeInr: number;
  totalPriceInr: number;
  totalPriceUsd: number;
}

export interface JewelryItem {
  id: string;
  sku: string;
  title: string;
  category: CategoryKey;
  subtitle: string;
  description: string;
  craftsmanshipNotes: string;
  availableMetals: GoldPurity[];
  defaultMetal: GoldPurity;
  availableTones: GoldTone[];
  defaultTone: GoldTone;
  baseGoldWeightGrams: number;
  baseCaratWeight: number;
  availableCarats: number[];
  stoneDetails: StoneDetails;
  baseStoneCostInr: number;
  fixedMakingChargeInr: number;
  etsyFavoriteCount: number;
  verifiedBuyerReviewsCount: number;
  rating: number;
  inStock: boolean;
  leadTimeDays: string;
  badge?: string;
  visualTag: 'oval' | 'toi-et-moi' | 'emerald' | 'riviere' | 'round' | 'pear' | 'cushion' | 'pendant' | 'earrings';
  imageUrl?: string;
  onHandImageUrl?: string;
  galleryImages?: string[];
}

export interface ClientReview {
  id: string;
  author: string;
  location: string;
  verifiedSource: 'Etsy Verified Buyer' | 'Bespoke Atelier Client';
  date: string;
  rating: number;
  productPurchased: string;
  comment: string;
  ringSpecs: string;
  proposalStorySnippet?: string;
  clientPhotoPlaceholderText?: string;
  photoUrl?: string;
}

export interface CustomCadInquiry {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  stoneCut: string;
  targetCarat: string;
  metalPurity: string;
  budgetRange: string;
  designNotes: string;
  inquiryDate: string;
}

export interface VideoConsultationRequest {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  timeZone: string;
  itemsToInspect: string[];
  notes: string;
}
