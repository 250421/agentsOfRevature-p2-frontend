import { navItems, type NavItem } from "@/lib/nav";
import { NavLink } from "./NavLink";
import { Button } from "../ui/button";

export function NavBar() {
  return (
    <header className="p-3 border-b">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold w-[500px]">AGENTS OF REVATURE</div>
        <nav className="flex gap-5">
          {navItems.map((item: NavItem) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <div className="flex justify-end items-center w-[500px]">
          <nav>
            <NavLink href={"/profile"} label={"Agent {username}"} />
          </nav>
          <span className="ml-4">|</span>
          <Button variant='ghost'>Logout</Button>
        </div>
      </div>
    </header>
  );
}
