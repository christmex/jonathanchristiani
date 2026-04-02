import { TextAnimate } from "@/components/ui/text-animate";
import Image from "next/image";
import { ExternalLink, ReceiptText } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100dvh-10rem)]">
        <div className="p-10 pb-0 font-bold lg:text-7xl border-r border-slate-100 lg:pt-40 text-5xl flex items-end">
          <TextAnimate animation="blurIn" as="h1">
            THINK SOMETIMES.
          </TextAnimate>
        </div>
        <div className="relative">
          <div className="size-10 bg-black absolute bottom-0 left-0"></div>
        </div>

        <div className="p-10 border border-slate-100 border-l-0 relative">
          <div className="size-10 bg-black absolute top-0 right-0"></div>
          <Image src="/images/filsafat-hero.png" alt="Filsafat Hero" width={500} height={500} className="w-full h-auto" />
          <p className="text-xl mt-4">I'm Jonathan from Indonesia <br />—<span className="font-bold">Senior Full-Stack Developer</span>, <br className="lg:hidden" />partime as a <span className="font-bold">truth seeker</span>.</p>
        </div>
        <div className="p-10 flex items-center gap-4 border border-slate-100 border-l-0 border-r-0">
          <div className="w-[160px] h-full">
            <Image src="/images/socrates-hero.png" alt="Socrates Hero" width={500} height={500} className="grayscale hover:grayscale-0 ease-in-out transition-all w-full h-auto" />
          </div>
          <p className="text-xl mt-4">I know that I know nothing. <br />-Socrates</p>
        </div>
      </section>
      <p className="p-10 w-full text-center italic">Simplicity over complexity.</p>


      <section className="border-t border-slate-100 scroll-m-12" id="projects">
        <div className="p-10 font-bold lg:text-7xl text-6xl">
          <TextAnimate animation="blurIn" as="h1">
            SELECTED PROJECTS.
          </TextAnimate>
        </div>
        <div className="flex border-y lg:flex-row flex-col">
          
          <div className="lg:basis-2/8 w-full border-r border-slate-100 divide-y order-2 lg:order-1">

            <div className="p-10 gap-2 flex flex-col border-t lg:border-t-0">
              <h1 className="font-bold text-xl">Background & Problem.</h1>
              <p className="text-md text-slate-600">Nihonnomise was growing fast events, sponsors, community, but had no digital home. Everything ran on WhatsApp and word of mouth. There was no way to register attendees, showcase events, or attract sponsors professionally. They needed a platform that matched the energy of their brand.</p>
            </div>
            
            <div className="p-10 gap-2 flex flex-col">
              <h1 className="font-bold text-xl">My Role.</h1>
              <p className="text-md text-slate-600">End-to-end. I handled product planning, UI/UX design, frontend, backend API, and deployment. No handoffs, no back-and-forth. Just one developer responsible for the full picture.</p>
            </div>
            
            <div className="p-10 gap-2 flex flex-col">
              <h1 className="font-bold text-xl">Impact.</h1>
              <p className="text-md text-slate-600">Nihonnomise went from zero digital presence to a live, production-ready platform, capable of handling event registrations, managing galleries, and presenting sponsorship opportunities to potential brand partners. The team can now manage everything independently through a custom admin dashboard.</p>
            </div>
            
            {/* <div className="p-10 gap-2 flex flex-col">
              <h1 className="font-bold text-xl">What I Learned.</h1>
              <p className="text-md text-slate-600">Building solo end-to-end forces clarity. Every decision, architecture, UX, data modeling, lands on one person. This project sharpened how I scope features under real constraints, design for non-technical users (the admin side), and ship without over-engineering.</p>
            </div> */}

          </div>

          <div className="lg:basis-6/8 w-full order-1 lg:order-2">

            <div className="p-10 gap-2 flex flex-col border-b">
              <h1 className="font-bold text-xl">Project Overview - Nihonnomise</h1>
              <p className="text-md text-slate-600">A full-stack web platform for Nihonnomise — an anime festival & creative community based in Batam — built from zero to production, covering everything from UI design to deployment.</p>
            </div>

            <div className="bg-slate-100 h-[250px] lg:h-[500px] relative">

              <Image src="/images/projects/nihonnomise.id.png" alt="Nihonnomise.id" fill className="lg:object-cover object-contain" />

              <div className="absolute bottom-0 right-0 bg-black flex text-white divide-x cursor-pointer">
                {/* <span className="px-4 py-2 flex gap-2 text-sm">
                  <ReceiptText className="size-4" />
                  Read Details
                </span> */}
                <a href="https://nihonnomise.id" target="_blank" className="px-4 py-2 flex gap-2 text-sm">
                  <ExternalLink className="size-4" />
                  Visit Live
                </a>
              </div>

            </div>

            <div className="p-10 gap-2 flex flex-col border-b">
              <h1 className="font-bold text-xl">Tools & Stacks</h1>
              <p className="text-md text-slate-600">Built with Laravel Filament and Next.js for maximum speed-to-market. The primary goal was rapid deployment—delivering a robust, production-ready platform in record time to meet the client's immediate operational requirements.</p>
            </div>

            <div className="grid lg:grid-cols-4 grid-cols-2 divide-x divide-y lg:divide-y-0">

              <div className="p-10 gap-2 flex flex-col">
                <h1 className="font-bold text-xl">Laravel</h1>
                {/* <p className="text-md text-slate-600">Utility-first CSS framework for rapidly building custom user interfaces.</p> */}
              </div>

              <div className="p-10 gap-2 flex flex-col">
                <h1 className="font-bold text-xl">Next.js</h1>
                {/* <p className="text-md text-slate-600">A rugged, minimal framework for composing behavior directly in your markup.</p> */}
              </div>


              <div className="p-10 gap-2 flex flex-col">
                <h1 className="font-bold text-xl">Vercel</h1>
                {/* <p className="text-md text-slate-600">A full-stack framework for Laravel that makes building dynamic interfaces simple, fast, and enjoyable.</p> */}
              </div>

              <div className="p-10 gap-2 flex flex-col">
                <h1 className="font-bold text-xl">Figma</h1>
                {/* <p className="text-md text-slate-600">A robust PHP framework for building web applications with expressive syntax and powerful features.</p> */}
              </div>


            </div>

          </div>
        </div>

        {/* <p className="p-10 w-full text-center italic bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-foreground:var(--color-border)]/56">Give some space.</p> */}

        <div className="flex border-y lg:flex-row flex-col">
          
          <div className="lg:basis-2/8 w-full border-l border-slate-100 divide-y order-2">

            <div className="p-10 gap-2 flex flex-col border-t lg:border-t-0">
              <h1 className="font-bold text-xl">Background & Problem.</h1>
              <p className="text-md text-slate-600">The client didn’t have any online presence and needed a quick-to-launch solution to showcase their products and services to potential buyers.</p>
            </div>
            
            <div className="p-10 gap-2 flex flex-col">
              <h1 className="font-bold text-xl">My Role.</h1>
              <p className="text-md text-slate-600">Project Manager, UI/UX Designer, Fullstack Developer. I managed client communication, translated business needs into wireframes, ensured the design aligned with brand identity and goals, and coordinated with the WordPress developer to ensure smooth implementation.</p>
            </div>
            
            <div className="p-10 gap-2 flex flex-col">
              <h1 className="font-bold text-xl">Impact.</h1>
              <p className="text-md text-slate-600">Helped the client reach new customers online, increase trust, and drive sales by creating a visually appealing and SEO-optimized website.</p>
            </div>
          </div>

          <div className="lg:basis-6/8 w-full order-1">

            <div className="p-10 gap-2 flex flex-col border-b">
              <h1 className="font-bold text-xl">Project Overview - Elegant Gorden Website</h1>
              <p className="text-md text-slate-600">A simple, elegant website for a curtain store in Surabaya, designed for fast publishing and easy content management.</p>
            </div>

            <div className="bg-slate-100 h-[250px] lg:h-[500px] relative">

              <Image src="/images/projects/elegantgorden.com.png" alt="Elegant Gorden" fill className="lg:object-cover object-contain" />

              <div className="absolute bottom-0 right-0 bg-black flex text-white divide-x cursor-pointer">
                {/* <span className="px-4 py-2 flex gap-2 text-sm">
                  <ReceiptText className="size-4" />
                  Read Details
                </span> */}
                <a href="https://elegantgorden.com" target="_blank" className="px-4 py-2 flex gap-2 text-sm">
                  <ExternalLink className="size-4" />
                  Visit Live
                </a>
                <a href="https://elegantgorden.vercel.app/" target="_blank" className="px-4 py-2 flex gap-2 text-sm">
                  <ExternalLink className="size-4" />
                  Visit Ongoing Project
                </a>
              </div>

            </div>

            <div className="p-10 gap-2 flex flex-col">
              <h1 className="font-bold text-xl">What I Learned.</h1>
              <p className="text-md text-slate-600">I gained insight into search engine optimization (SEO) for small business websites and how to manage both design expectations and deadlines as a project lead.</p>
            </div>

            {/* <div className="px-10 py-4 gap-2 flex flex-col border-b">
              <h1 className="font-bold text-xl">Tools & Stacks</h1>
            </div>

            <div className="grid lg:grid-cols-4 grid-cols-1 divide-x divide-y lg:divide-y-0">

              <div className="p-10 gap-2 flex flex-col">
                <h1 className="font-bold text-xl">Laravel Filament</h1>
              </div>

              <div className="p-10 gap-2 flex flex-col">
                <h1 className="font-bold text-xl">Next.js</h1>
              </div>


              <div className="p-10 gap-2 flex flex-col">
                <h1 className="font-bold text-xl">Vercel</h1>
              </div>

              <div className="p-10 gap-2 flex flex-col">
                <h1 className="font-bold text-xl">Figma</h1>
              </div>
            </div> */}

          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 scroll-m-12" id="blog">
        <div className="p-10 font-bold lg:text-7xl border-r border-slate-100 text-6xl">
          <TextAnimate animation="blurIn" as="h1">
            BLOG.
          </TextAnimate>
        </div>

        <Image src="/images/blog-hero.png" loading="eager" alt="Blog Hero" width={500} height={100} className="w-full h-[200px] object-cover" />

        <div className="grid lg:grid-cols-4 mt-10">
          <div className="p-10 border border-slate-100 border-l-0">
            <h1 className="font-bold text-2xl">WHY.</h1>
            <span className="text-md text-slate-400">I Debug Reality</span>
            <Image src="/images/blog-why-hero.png" alt="Blog Hero" width={500} height={100} className="grayscale hover:grayscale-0 ease-in-out transition-all w-full h-[350px] mt-6 object-cover" />
          </div>
          <div className="p-10 border border-slate-100 border-l-0">
            <h1 className="font-bold text-2xl">LIFE'S.</h1>
            <span className="text-md text-slate-400">An Infinite Loop</span>
            <Image src="/images/blog-life-hero.png" alt="Blog Hero" width={500} height={100} className="grayscale hover:grayscale-0 ease-in-out transition-all w-full h-[350px] mt-6 object-cover" />
          </div>
          <div className="p-10 border border-slate-100 border-l-0">
            <h1 className="font-bold text-2xl">IMPORTANT.</h1>
            <span className="text-md text-slate-400">For Myself</span>
            <Image src="/images/blog-important-hero.png" alt="Blog Hero" width={500} height={100} className="grayscale hover:grayscale-0 ease-in-out transition-all w-full h-[350px] mt-6 object-cover" />
          </div>
          <div className="p-10 border border-slate-100 border-x-0">
            
          </div>
        </div>
      </section>

      <p className="p-10 w-full text-center italic bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-foreground:var(--color-border)]/56">Empty on purposes.</p>


      {/* <p className="p-10 w-full text-center italic bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-foreground:var(--color-border)]/56">Last breath.</p> */}

      <section className="border-t">
        <div className="p-10 gap-2 flex flex-col">
          <h1 className="font-bold text-xl">My Motivation and Approach.</h1>
          <p className="text-md text-slate-600">I’m passionate about using tech to solve real world problems, especially in underrepresented areas like education and small businesses. What sets me apart is my ability to combine hard skills like Laravel, Livewire, TailwindCSS, Linux, Git, and Web Security with soft skills like critical thinking, curiosity, and a strong sense of ownership. I don’t just build things, I ask why it matters, and I iterate with purpose. Whether I’m managing a team or coding solo, I strive for clarity, quality, and positive impact. I’m excited about the opportunity to join your company because I’m eager to grow not just technically, but also in how I think, collaborate, and create value.</p>
        </div>
      </section>

      <section className="border-b pt-50">
          <h1 className="font-bold text-[15vw] leading-none text-center uppercase tracking-tighter text-gray-100">
            THANK YOU
          </h1>
      </section>
    </>
  );
}
