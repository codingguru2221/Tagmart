import { Link } from "wouter";
import { ShoppingCart, Menu, Search, User } from "lucide-react";
import { useCart } from "@/lib/cart";
import { getAuthUser } from "@/lib/auth";

export default function Navbar() {
  const { totalItems } = useCart();
  const user = getAuthUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 -ml-2 text-foreground">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xl">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline-block">Tagmart</span>
          </Link>
        </div>

        <div className="flex-1 max-w-xl hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search for groceries, clothing, electronics..." 
              className="w-full h-10 pl-10 pr-4 rounded-full border border-input bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
            Shop All
          </Link>
          
          {user ? (
            <Link href={user.role === 'admin' ? '/admin/dashboard' : '/orders'} className="p-2 hover:bg-muted rounded-full transition-colors">
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              Sign In
            </Link>
          )}

          <Link href="/cart" className="p-2 hover:bg-muted rounded-full transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center -translate-y-1/4 translate-x-1/4">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
