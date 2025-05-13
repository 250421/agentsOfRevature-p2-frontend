import { navItems, type NavItem } from "@/lib/nav";
import { NavLink } from "./NavLink";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";

const ConfirmLogoutDialogProps = {
  title: 'Are you sure you want to log out?',
  description: 'You may lose your progress if you started a game.',
  confirmLabel: 'Log Out',
}

export function NavBar() {
  const [confirmLogout, ConfirmLogoutDialog] = useConfirm();
  const logout = useSignOut();

  const handleLogoutClick = async () => {
    const confirmed = await confirmLogout();

    if (confirmed) {
      logout.mutate();
    }
  }

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
          <Button variant='ghost' onClick={handleLogoutClick}>Logout</Button>
          <ConfirmLogoutDialog {...ConfirmLogoutDialogProps}/>
        </div>
      </div>
    </header>
  );
}
