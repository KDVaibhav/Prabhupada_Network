import EventSection from "@/components/EventSection";
import QuotesSection from "@/components/QuotesSection";
import { BlogSection } from "@/components/BlogSection";
import DonationForm from "@/components/DonationForm";
import ContactUsSection from "@/components/ContactUsSection";
import PromotionSection from "@/components/PromotionSection";

export default function App() {
  return (
    <div className="flex flex-col mt-10 gap-componentSpacing">
      <PromotionSection />
      <QuotesSection />
      {/* <FlipCalendar/> */}
      <EventSection />
      <BlogSection />
      <DonationForm />
    </div>
  );
}
