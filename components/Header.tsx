import React from "react";
import { Search, ShoppingCart, User, Menu, Cake } from "lucide-react";
import { NAV_LINKS } from "../constants";

interface HeaderProps {
  onAdminClick?: () => void;
  onCartClick?: () => void;
  cartCount?: number;
  onLogoClick?: () => void;
  onCakesNavClick?: () => void;
  onCupCakesNavClick?: () => void;
  onOrdersClick?: () => void;
  loggedIn?: boolean;
  onSpecialClick?: () => void;
  onOffersClick?: () => void;
  isAdminView?: boolean;
  onAdminViewOrdersClick?: () => void;
  onAdminManageOrdersClick?: () => void;
  onAdminSpecialClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onAdminClick,
  onCartClick,
  cartCount = 0,
  onLogoClick,
  onCakesNavClick,
  onCupCakesNavClick,
  onOrdersClick,
  loggedIn = false,
  onSpecialClick,
  onOffersClick,
  isAdminView = false,
  onAdminViewOrdersClick,
  onAdminManageOrdersClick,
  onAdminSpecialClick,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 bg-brand-light/90 backdrop-blur-sm animate-slide-down border-b border-brand-dark/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 group cursor-pointer select-none"
          onClick={onLogoClick}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-brand-green/20 rounded-full blur-sm group-hover:bg-brand-green/30 transition-all duration-300"></div>
            <div className="relative p-2 bg-brand-light rounded-full border border-brand-green/20 group-hover:scale-110 transition-transform duration-300">
              <Cake className="text-brand-green w-6 h-6" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-logo text-brand-dark tracking-wide hover:opacity-80 transition-opacity">
            rabelanis_cakery
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {isAdminView ? (
            <>
              <button
                onClick={onAdminViewOrdersClick}
                className="text-sm font-medium text-gray-600 hover:text-brand-green transition-colors"
              >
                View Orders
              </button>
              <button
                onClick={onAdminManageOrdersClick}
                className="text-sm font-medium text-gray-600 hover:text-brand-green transition-colors"
              >
                Manage Products
              </button>
              <button
                onClick={onAdminSpecialClick}
                className="text-sm font-medium text-gray-600 hover:text-brand-green transition-colors"
              >
                Special
              </button>
            </>
          ) : (
            NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.label === "Cakes" && onCakesNavClick) {
                    e.preventDefault();
                    onCakesNavClick();
                  } else if (link.label === "Cup Cakes" && onCupCakesNavClick) {
                    e.preventDefault();
                    onCupCakesNavClick();
                  } else if (
                    link.label === "Daily Specials" &&
                    onSpecialClick
                  ) {
                    e.preventDefault();
                    onSpecialClick();
                  }
                }}
                className="relative text-sm font-medium text-gray-600 hover:text-brand-green transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-green transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:bg-white hover:text-brand-green rounded-full transition-all duration-300 hover:shadow-md hover:scale-110">
            <Search size={20} />
          </button>

          {!isAdminView && (
            <div className="relative group">
              <button
                id="cart-button"
                onClick={onCartClick}
                className="p-2 text-gray-600 hover:bg-white hover:text-brand-green rounded-full transition-all duration-300 hover:shadow-md hover:scale-110"
              >
                <ShoppingCart size={20} />
              </button>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-brand-accent text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          )}

          {!isAdminView && (
            <button
              onClick={onOffersClick}
              className="hidden md:flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-full hover:bg-amber-600 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="text-sm font-medium">Offers</span>
              <span className="bg-white/20 rounded-full p-0.5">
                <User size={14} />
              </span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2">
            {!isAdminView && (
              <button
                onClick={onOrdersClick}
                className="items-center gap-2 border border-brand-dark/10 text-brand-dark px-4 py-2 rounded-full hover:bg-brand-dark hover:text-white transition-all duration-300"
              >
                <span className="text-sm font-medium">Orders</span>
              </button>
            )}
            <button
              onClick={onAdminClick}
              className="items-center gap-2 border border-brand-dark/10 text-brand-dark px-4 py-2 rounded-full hover:bg-brand-dark hover:text-white transition-all duration-300"
            >
              <span className="text-sm font-medium">
                {loggedIn ? "Logout" : "Login"}
              </span>
            </button>
          </div>

          <button className="md:hidden p-2 text-gray-600 hover:bg-white rounded-full transition-colors">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
