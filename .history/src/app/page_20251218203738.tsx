import HeroCarousel from "./HeroCarousel/HeroCarousel";
import ProductTab from "@/components/products/productTab";
import Products from "@/app/products";
import About from "../components/About/page";
import ContactForm from "../components/ContactForm/page";
import WhyChooseUs from "../components/WhyChooseUs/page";
import JoinUsForm from "../components/JoinUsForm/page";

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />

     <ProductTab />

      <Products />

      <About />
      <ContactForm />
      <WhyChooseUs />
      <JoinUsForm />
    </main>
  );
}
