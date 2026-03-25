import Image from "next/image";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal"

export default function Home() {
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-10 font-bold lg:text-7xl border-r border-slate-100 lg:pt-40 text-6xl">
          THINK <br /> SOMETIMES.
        </div>
        <div className="">
          <Terminal>
  <TypingAnimation>pnpm dlx shadcn@latest init</TypingAnimation>
  <AnimatedSpan>✔ Preflight checks.</AnimatedSpan>
  <AnimatedSpan>✔ Validating Tailwind CSS.</AnimatedSpan>
  <TypingAnimation>Success! Project initialization completed.</TypingAnimation>
</Terminal>
        </div>

        <div className="p-10 border border-slate-100 border-l-0">
          <Image src="/images/filsafat-hero.png" alt="Filsafat Hero" width={500} height={500} className="grayscale hover:grayscale-0 ease-in-out transition-all w-full h-auto" />
          <p className="text-xl mt-4">I'm Jonathan from Indonesia <br />—a <span className="font-bold">Software Engineer</span>, <br className="lg:hidden" />and a <span className="font-bold">truth seeker</span>.</p>
        </div>
        <div className="p-10 flex items-center gap-4 border border-slate-100 border-l-0 border-r-0">
          <div className="w-[160px]">
            <Image src="/images/socrates-hero.png" alt="Socrates Hero" width={500} height={500} className="grayscale hover:grayscale-0 ease-in-out transition-all w-full h-auto" />
          </div>
          <p className="text-xl mt-4">I know that I know nothing. <br />-Socrates</p>
        </div>
      </section>
      <p className="p-10 w-full text-center italic">There's nothing else here. Choose your next journey from the navigation above.</p>
    </>
  );
}
