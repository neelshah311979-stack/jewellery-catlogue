/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Currency, CategoryKey, JewelryItem, GoldPurity, GoldTone } from './types/jewelry';
import { JEWELRY_CATALOGUE } from './data/jewelryData';
import { DEFAULT_LIVE_18K_GOLD_RATE_INR } from './utils/pricing';

import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AtelierLookbook } from './components/AtelierLookbook';
import { ProductCatalogue } from './components/ProductCatalogue';
import { GemologicalMastery } from './components/GemologicalMastery';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';

import { ProductDetailModal } from './components/ProductDetailModal';
import { CustomCadModal } from './components/CustomCadModal';
import { VideoConsultationModal } from './components/VideoConsultationModal';
import { GraVerificationModal } from './components/GraVerificationModal';
import { BudgetPickerModal } from './components/BudgetPickerModal';
import { InquiryDrawer, InquiryBagItem } from './components/InquiryDrawer';
import { WishlistModal } from './components/WishlistModal';
import { LiveGoldRateModal } from './components/LiveGoldRateModal';

import { ThreeJewelryExperience } from './components/ThreeJewelryExperience';

export default function App() {
  // App-level state
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [live18kGoldRateInr, setLive18kGoldRateInr] = useState<number>(DEFAULT_LIVE_18K_GOLD_RATE_INR);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [activeBudget, setActiveBudget] = useState<string>('all');

  const toggleThemeMode = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Wishlist & Inquiry Bag state
  const [wishlistIds, setWishlistIds] = useState<string[]>(['os-ring-01', 'os-ring-03']);
  const [inquiryBag, setInquiryBag] = useState<InquiryBagItem[]>([
    {
      id: 'inq-initial-1',
      item: JEWELRY_CATALOGUE[0], // The Royal Oval Solitaire
      metal: '18K',
      tone: 'Yellow Gold',
      carat: 2.5,
      ringSize: 'US 6.5 (UK M / India 13)',
      addedAt: 'Initial curation',
    },
  ]);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<JewelryItem | null>(null);
  const [isCadModalOpen, setIsCadModalOpen] = useState<boolean>(false);
  const [cadStoneCut, setCadStoneCut] = useState<string>('Classic Oval');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [videoItemTitle, setVideoItemTitle] = useState<string>('General Atelier Collection');
  const [isGraModalOpen, setIsGraModalOpen] = useState<boolean>(false);
  const [graCertNumber, setGraCertNumber] = useState<string>('GRA-98241088');
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [isInquiryDrawerOpen, setIsInquiryDrawerOpen] = useState<boolean>(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState<boolean>(false);
  const [isGoldRateModalOpen, setIsGoldRateModalOpen] = useState<boolean>(false);
  const [isPriceLocked, setIsPriceLocked] = useState<boolean>(false);

  // Wishlist toggler
  const handleToggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add to inquiry bag handler
  const handleAddToInquiry = (
    item: JewelryItem,
    selectedMetal: GoldPurity,
    selectedTone: GoldTone,
    selectedCarat: number,
    ringSize: string
  ) => {
    const newItem: InquiryBagItem = {
      id: `inq-${Date.now()}`,
      item,
      metal: selectedMetal,
      tone: selectedTone,
      carat: selectedCarat,
      ringSize,
      addedAt: new Date().toISOString(),
    };
    setInquiryBag((prev) => [...prev, newItem]);
  };

  const handleRemoveInquiryItem = (id: string) => {
    setInquiryBag((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearInquiryBag = () => {
    setInquiryBag([]);
  };

  const handleOpenVideoModalFor = (title: string) => {
    setVideoItemTitle(title);
    setIsVideoModalOpen(true);
  };

  const handleOpenGraModalFor = (certNumber?: string) => {
    if (certNumber) {
      setGraCertNumber(certNumber);
    }
    setIsGraModalOpen(true);
  };

  const handleOpenCadModalFor = (stoneShape?: string) => {
    if (stoneShape) {
      setCadStoneCut(stoneShape);
    }
    setIsCadModalOpen(true);
  };

  const handleAdd3DItemToInquiry = (metal: GoldPurity, tone: GoldTone, carat: number) => {
    const bespoke3dItem: JewelryItem = {
      id: `os-3d-custom-${Date.now()}`,
      sku: 'OSJ-3D-BESPOKE',
      title: 'The Royal Crown Cushion Solitaire (3D Atelier Commission)',
      category: 'solitaires',
      subtitle: `${carat.toFixed(1)} CT D-Color VVS1 Moissanite in ${metal} ${tone}`,
      description: 'Interactive 3D Solitaire commissioned with hand-forged 4-claw compass prongs, pavé diamond shoulder accents, and velvet presentation case.',
      craftsmanshipNotes: 'Crafted according to the 3D cinematic specification in our Mumbai atelier.',
      availableMetals: ['10K', '14K', '18K', 'Platinum 950'],
      defaultMetal: metal,
      availableTones: ['Yellow Gold', 'White Gold', 'Rose Gold'],
      defaultTone: tone,
      baseGoldWeightGrams: 4.8,
      baseCaratWeight: carat,
      availableCarats: [1.5, 2.0, 2.5, 3.0, 4.0],
      stoneDetails: {
        type: 'VVS1 D-Color / Vivid Pink Lab Moissanite',
        caratWeight: carat,
        shape: 'Royal Crown Cushion',
        dimensions: '9.0 x 9.0 mm',
        colorGrade: 'D',
        clarityGrade: 'VVS1',
        cutGrade: 'Ideal Hearts & Arrows',
        refractiveIndex: '2.65 – 2.69',
        dispersionFire: '0.104',
        mohsHardness: 9.25,
        polishSymmetry: 'Excellent / Excellent',
        graCertificateNumber: 'GRA-3D-98104',
        laserInscribed: true,
      },
      baseStoneCostInr: 22000,
      fixedMakingChargeInr: 8500,
      etsyFavoriteCount: 520,
      verifiedBuyerReviewsCount: 48,
      rating: 5.0,
      inStock: true,
      leadTimeDays: '12–15 Days Handcrafted',
      visualTag: 'cushion',
    };
    handleAddToInquiry(bespoke3dItem, metal, tone, carat, 'US 6.5 (UK M / India 13)');
    setIsInquiryDrawerOpen(true);
  };

  const scrollToCatalogue = () => {
    const el = document.getElementById('catalogue');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollTo3D = () => {
    const el = document.getElementById('3d-experience');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
      themeMode === 'light'
        ? 'bg-[#f4f1ea] text-[#1f1a16] selection:bg-[#ded7ca] selection:text-[#1f1a16]'
        : 'bg-[#151210] text-[#f2efe9] selection:bg-[#b3844d] selection:text-[#151210]'
    }`}>
      {/* 4.1 Top Utility Header & Navigation */}
      <Header
        currency={currency}
        onToggleCurrency={setCurrency}
        live18kGoldRateInr={live18kGoldRateInr}
        onUpdateGoldRate={setLive18kGoldRateInr}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalogue();
        }}
        inquiryCount={inquiryBag.length}
        onOpenInquiryDrawer={() => setIsInquiryDrawerOpen(true)}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistModalOpen(true)}
        onOpenVideoModal={() => handleOpenVideoModalFor('Mumbai Atelier Loose Moissanite Gems')}
        onOpenCadModal={() => handleOpenCadModalFor('Classic Oval')}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenGoldRateModal={() => setIsGoldRateModalOpen(true)}
        isPriceLocked={isPriceLocked}
        themeMode={themeMode}
        onToggleThemeMode={toggleThemeMode}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Interactive 3D Jewellery Experience (matching user's video!) */}
        <div id="3d-experience">
          <ThreeJewelryExperience
            onAddToInquiry={handleAdd3DItemToInquiry}
            onRequestCad={() => handleOpenCadModalFor('Royal Crown Cushion')}
            currency={currency}
            live18kGoldRateInr={live18kGoldRateInr}
            themeMode={themeMode}
            onToggleThemeMode={toggleThemeMode}
          />
        </div>

        {/* 4.2 Hero Section */}
        <HeroSection
          onExploreClick={scrollToCatalogue}
          onRequestCadClick={() => handleOpenCadModalFor('Classic Oval')}
          onOpenVideoClick={() => handleOpenVideoModalFor('The Royal Oval Solitaire')}
          onOpenGraClick={() => handleOpenGraModalFor('GRA-98241088')}
          live18kGoldRateInr={live18kGoldRateInr}
          themeMode={themeMode}
        />

        {/* Editorial Visual Lookbook - Real Photography */}
        <AtelierLookbook
          themeMode={themeMode}
          onSelectItemById={(id) => {
            const found = JEWELRY_CATALOGUE.find((item) => item.id === id);
            if (found) setSelectedProduct(found);
          }}
        />

        {/* Digital Product Catalogue & Lookbook */}
        <ProductCatalogue
          items={JEWELRY_CATALOGUE}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          currency={currency}
          live18kGoldRateInr={live18kGoldRateInr}
          activeBudget={activeBudget}
          onResetBudget={() => setActiveBudget('all')}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          onSelectItem={(item) => setSelectedProduct(item)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onOpenCadModal={() => handleOpenCadModalFor('Classic Oval')}
          themeMode={themeMode}
        />

        {/* 5. GEMOLOGICAL MASTERY: The Moissanite Standard */}
        <GemologicalMastery
          onOpenGraModal={handleOpenGraModalFor}
          onOpenCadModal={handleOpenCadModalFor}
          themeMode={themeMode}
        />

        {/* 7.2 Voices of One Soul — 406+ Global Love Stories */}
        <ReviewsSection themeMode={themeMode} />
      </main>

      {/* 7.3 Footer & About Us with 3x2 Experience Grid */}
      <Footer
        onOpenVideoModal={() => handleOpenVideoModalFor('Mumbai Atelier Inspection')}
        onOpenCadModal={() => handleOpenCadModalFor('Classic Oval')}
        onOpenGraModal={() => handleOpenGraModalFor('GRA-98241088')}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalogue();
        }}
        themeMode={themeMode}
        onToggleThemeMode={toggleThemeMode}
      />

      {/* Interactive Modals */}
      <ProductDetailModal
        item={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        currency={currency}
        live18kGoldRateInr={live18kGoldRateInr}
        onAddToInquiry={handleAddToInquiry}
        onOpenVideoModal={handleOpenVideoModalFor}
        onOpenGraModal={handleOpenGraModalFor}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <CustomCadModal
        isOpen={isCadModalOpen}
        onClose={() => setIsCadModalOpen(false)}
        defaultStoneShape={cadStoneCut}
      />

      <VideoConsultationModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        selectedItemTitle={videoItemTitle}
      />

      <GraVerificationModal
        isOpen={isGraModalOpen}
        onClose={() => setIsGraModalOpen(false)}
        initialCertNumber={graCertNumber}
      />

      <BudgetPickerModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        activeBudget={activeBudget}
        onSelectBudget={setActiveBudget}
        currency={currency}
      />

      <InquiryDrawer
        isOpen={isInquiryDrawerOpen}
        onClose={() => setIsInquiryDrawerOpen(false)}
        items={inquiryBag}
        onRemoveItem={handleRemoveInquiryItem}
        onClearBag={handleClearInquiryBag}
        currency={currency}
        live18kGoldRateInr={live18kGoldRateInr}
      />

      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        wishlistIds={wishlistIds}
        items={JEWELRY_CATALOGUE}
        onRemoveWishlist={handleToggleWishlist}
        onSelectItem={(item) => setSelectedProduct(item)}
        currency={currency}
        live18kGoldRateInr={live18kGoldRateInr}
      />

      <LiveGoldRateModal
        isOpen={isGoldRateModalOpen}
        onClose={() => setIsGoldRateModalOpen(false)}
        currency={currency}
        current18kRateInr={live18kGoldRateInr}
        onLockRate={setIsPriceLocked}
        isPriceLocked={isPriceLocked}
      />
    </div>
  );
}
