import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xl">
              T
            </div>
            <span className="text-xl font-bold tracking-tight">Tagmart</span>
          </div>
          <p className="text-muted text-sm max-w-xs">
            Your one-stop megamart for everyday needs. The energy of a bustling bazaar distilled into a clean, trustworthy online store.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
            <li><Link href="/shop?category=groceries" className="hover:text-primary transition-colors">Groceries</Link></li>
            <li><Link href="/shop?category=electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
            <li><Link href="/shop?category=clothing" className="hover:text-primary transition-colors">Clothing</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/orders" className="hover:text-primary transition-colors">Track Order</Link></li>
            <li><Link href="/login" className="hover:text-primary transition-colors">My Account</Link></li>
            <li><a href="#" className="hover:text-primary transition-colors">Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Newsletter</h4>
          <p className="text-sm text-muted mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 h-10 px-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button className="h-10 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-sm text-muted text-center flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Tagmart Super Market. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/admin" className="hover:text-primary transition-colors">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}
