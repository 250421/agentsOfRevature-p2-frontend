import type { NavItem } from "@/lib/nav";
import { Link } from "@tanstack/react-router";

export function NavLink({ label, href }: NavItem) {
    return (
        <Link to={href}>{label}</Link>
    )
}