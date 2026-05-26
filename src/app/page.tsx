import { getFeaturedProjects } from "@/lib/data/projects";
import { getSkillsByCategory } from "@/lib/data/skills";
import { getActiveCertifications } from "@/lib/data/certifications";
import { getPageContent, getContentField } from "@/lib/data/content";
import { getFeatureFlag, getSiteSettingsMap } from "@/lib/data/settings";
import { getAllBudgets } from "@/lib/data/finances";
import { convertToINR } from "@/lib/utils/currency";
import { getInitiativeStats } from "@/lib/data/initiatives";

import HomeClientRouter from "@/components/home/HomeClientRouter";

export const revalidate = 60;

export default async function HomePage() {
  const [
    projects,
    skillsByCategory,
    certifications,
    pageContent,
    aboutContent,
    featureParticleBg,
    budgets,
    settingsMap,
    availableForOpportunities,
    initiativeStats
  ] = await Promise.all([
    getFeaturedProjects(3),
    getSkillsByCategory(),
    getActiveCertifications(),
    getPageContent("home"),
    getPageContent("about"),
    getFeatureFlag("feature_particle_bg"),
    getAllBudgets(),
    getSiteSettingsMap(),
    getFeatureFlag("feature_available_for_opportunities"),
    getInitiativeStats()
  ]);

  // Calculate generic total spend
  const totalSpend = budgets.reduce((sum, b) => {
      const rate = (b.exchange_rate_to_inr && b.exchange_rate_to_inr > 0 && b.currency !== 'INR') 
          ? b.exchange_rate_to_inr 
          : undefined;
      return sum + (rate ? b.expense_amount * rate : convertToINR(b.expense_amount, b.currency || 'INR'));
  }, 0);

  let formattedSpend = "0";
  if (totalSpend >= 10000000) formattedSpend = `₹${(totalSpend / 10000000).toFixed(1)}Cr+`;
  else if (totalSpend >= 100000) formattedSpend = `₹${(totalSpend / 100000).toFixed(0)}L+`;
  else formattedSpend = `₹${totalSpend.toLocaleString()}`;

  const heroTitle = getContentField(pageContent?.content, "hero_title") || "Jyotirmoy Bhowmik";
  const heroSubtitle = getContentField(pageContent?.content, "hero_subtitle") || "IT Infrastructure & Cloud Specialist";
  const heroDescription = getContentField(pageContent?.content, "hero_description") || "IT Infrastructure & Project Management leader with 15+ years of experience delivering secure, resilient enterprise infrastructure and technology programs across India and Nepal with multi-country coordination exposure.";

  const template = ((settingsMap["site_template"] as string) || "classic").replace(/"/g, "");

  const dbLocation = getContentField(aboutContent?.content, "location") || "Kathmandu, Nepal";
  const rawExperience = (settingsMap["years_of_experience"] as string) || "15+";
  const experienceYears = rawExperience.toLowerCase().includes("year") ? rawExperience : `${rawExperience} Years`;
  const initiativesCount = initiativeStats.total || 88;

  const props = {
      projects,
      skillsByCategory,
      certifications,
      featureParticleBg,
      budgets,
      formattedSpend,
      heroTitle,
      heroSubtitle,
      heroDescription,
      availableForOpportunities,
      location: dbLocation,
      experienceYears,
      initiativesCount,
  };

  return <HomeClientRouter template={template} {...props} />;
}
