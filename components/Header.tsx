import Link from "next/link";

const navItems = [
    { label: "Home", href: "" },
    { label: "Blog", href: "blog" },
    { label: "Projects", href: "projects" },
    // { label: "Connect", href: "/connect" },
];    
export default function Header() {
    return (
        <header className="flex border-b border-slate-100 justify-between p-4 sticky top-0 z-10 bg-white">
            <h1 className="font-bold">
                JONATHAN CHRISTIANI.
            </h1>
            <nav className="hidden lg:block">
                <ul className="flex flex-row gap-10 uppercase text-sm">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            {/* <Link href={item.href} className="text-slate-400 hover:text-slate-900">{item.label}</Link> */}
                            <a href={`#${item.href}`} className="text-slate-400 hover:text-slate-900">{item.label}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}