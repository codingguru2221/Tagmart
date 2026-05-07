import { Link } from "wouter";
import { ShoppingCart, Menu, Search, User, Truck } from "lucide-react";
import { useCart } from "@/lib/cart";
import { getAuthUser } from "@/lib/auth";

const LOGO_SRC = "/TG%20logo.png";

export default function Navbar() {
  const { totalItems } = useCart();
  const user = getAuthUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="hidden border-b bg-foreground text-background md:block">
        <div className="container mx-auto flex h-9 items-center justify-between px-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-accent" />
            Your everyday megamart for groceries, fashion, electronics, and home essentials
          </div>
          <div className="text-background/75">Fresh deals, trusted products, and fast doorstep delivery.</div>
        </div>
      </div>
      <div className="container mx-auto px-4 h-[68px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 -ml-2 text-foreground">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <img src={LOGO_SRC} alt="Tagmart logo" className="h-10 w-10 rounded-lg object-contain" />
            <div className="hidden sm:block">
              <span className="block text-xl font-black leading-none tracking-tight text-foreground">Tagmart</span>
              <span className="block text-[11px] font-semibold uppercase text-muted-foreground">Online Supermarket</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 max-w-xl hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search for groceries, clothing, electronics..." 
              className="w-full h-11 pl-10 pr-4 rounded-full border border-input bg-muted/50 shadow-inner focus:bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/shop" className="hidden rounded-full px-3 py-2 text-sm font-bold hover:bg-muted hover:text-primary transition-colors md:block">
            Shop All
          </Link>
          
          {user ? (
            <Link href={user.role === 'admin' ? '/admin/dashboard' : '/orders'} className="p-2 hover:bg-muted rounded-full transition-colors" aria-label="Account">
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <Link href="/login" className="hidden rounded-full px-3 py-2 text-sm font-bold hover:bg-muted hover:text-primary transition-colors sm:block">
              Sign In
            </Link>
          )}

          <Link href="/cart" className="p-2 hover:bg-muted rounded-full transition-colors relative" aria-label="Cart">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center -translate-y-1/4 translate-x-1/4 ring-2 ring-background">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
