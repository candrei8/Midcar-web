import { HeroSection } from '@/components/home/HeroSection'
import { SearchSection } from '@/components/home/SearchSection'
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles'
import { BenefitsSection } from '@/components/home/BenefitsSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { BrandsSection } from '@/components/home/BrandsSection'
import { CTASection } from '@/components/home/CTASection'
import { TrustBadges } from '@/components/home/TrustBadges'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <TrustBadges />
      <FeaturedVehicles />
      <BenefitsSection />
      <TestimonialsSection />
      <BrandsSection />
      <CTASection />
    </>
  )
}
