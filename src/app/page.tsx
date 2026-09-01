import { About } from "@/components/About";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { VisitTracker } from "@/components/VisitTracker";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { getPortfolioData } from "@/lib/portfolio-data";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <>
      <VisitTracker />
      <AnimatedBackground />
      <Header />
      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <Experience items={data.experience} />
        <Projects items={data.projects} />
        <Skills groups={data.skillGroups} />
        <Contact profile={data.profile} />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
