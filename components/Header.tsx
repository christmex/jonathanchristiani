import Link from "next/link";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "Connect", href: "/connect" },
];    
export default function Header() {
    return (
        <header className="flex border-b border-slate-100 justify-between p-4">
            <h1 className="font-bold">
                JONATHAN CHRISTIANI.
            </h1>
            <nav className="hidden lg:block">
                <ul className="flex flex-row gap-10 uppercase text-sm">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href} className="text-slate-400">{item.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}