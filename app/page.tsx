"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { HeroSection } from "@/components/menu/hero-section";
import { OrderTypeSection } from "@/components/menu/order-type-section";
import { CategoryTabs } from "@/components/menu/category-tabs";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { CartBar } from "@/components/menu/cart-bar";
import { InfoSheet } from "@/components/menu/info-sheet";
import { EditTableModal } from "@/components/menu/edit-table-modal";
import { ItemDetailModal } from "@/components/menu/item-detail-modal";
import { FeaturedSection } from "@/components/menu/featured-section";
import { menuItems, categories, type MenuItem, type CartItem } from "@/lib/menu-data";

type OrderType = "dine-in" | "pickup";

export default function MenuPage() {
  // State
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [tableNumber, setTableNumber] = useState("5");
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([
    { id: "1", name: "Margherita", quantity: 1, price: 12.0 },
    { id: "2", name: "Pepperoni", quantity: 1, price: 14.0 },
  ]);

  const tabsSentinelRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Setup Intersection Observer for scroll detection
  useEffect(() => {
    const elements = Object.values(categoryRefs.current).filter(
      (el) => el !== null
    ) as HTMLDivElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find which section is currently in the top portion of the viewport
        let activeEntry = null;
        
        for (const entry of entries) {
          // Prioritize sections that are at the top of the viewport
          if (entry.isIntersecting && entry.boundingClientRect.top <= 150) {
            if (!activeEntry || entry.boundingClientRect.top > activeEntry.boundingClientRect.top) {
              activeEntry = entry;
            }
          }
        }

        // If no section is near the top, find the one most visible
        if (!activeEntry) {
          let mostVisible = entries[0];
          for (const entry of entries) {
            if (entry.intersectionRatio > mostVisible.intersectionRatio) {
              mostVisible = entry;
            }
          }
          activeEntry = mostVisible;
        }

        const categoryId = activeEntry.target.getAttribute("data-category-id");
        if (categoryId) {
          setActiveCategory(categoryId);
        }
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-center active tab in navbar
  useEffect(() => {
    if (!tabsContainerRef.current) return;
    
    const tabBtn = tabsContainerRef.current.querySelector(
      `[data-category-id="${activeCategory}"]`
    ) as HTMLElement;
    
    if (tabBtn) {
      const container = tabsContainerRef.current;
      const scrollLeft =
        tabBtn.offsetLeft - container.offsetWidth / 2 + tabBtn.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeCategory]);

  // Handle tab click to scroll to section
  const handleCategoryClick = useCallback((categoryId: string) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveCategory(categoryId);
    }
  }, []);

  // Handle adding item to cart
  const handleAddToCart = useCallback((item: MenuItem | CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // If item has customizations, it's an update to an existing cart item
        const isUpdatingCustomizations = 'selectedOptions' in item || 'sauceQuantities' in item || 'specialInstructions' in item;
        if (isUpdatingCustomizations) {
          return prevCart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...item, quantity: cartItem.quantity } as CartItem
              : cartItem
          );
        } else {
          // Otherwise, increment quantity
          return prevCart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
      }
      return [...prevCart, { ...item, quantity: 1 } as CartItem];
    });
  }, []);

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Filter menu items by category
  const filteredItems = menuItems.filter(
    (item) => item.categoryId === activeCategory
  );

  // Handle removing item from cart
  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter((cartItem) => cartItem.id !== itemId);
    });
  }, []);

  // Sticky tabs detection
  useEffect(() => {
    const sentinel = tabsSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTabsSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <HeroSection onInfoClick={() => setIsInfoOpen(true)} />

      {/* Order Type Section */}
      <OrderTypeSection
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        tableNumber={tableNumber}
        onEditTable={() => setIsTableModalOpen(true)}
      />

      {/* Sticky sentinel */}
      <div ref={tabsSentinelRef} className="h-0" />

      {/* Category Tabs - Sticky */}
      <div className="sticky top-0 z-30">
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryClick}
          isSticky={isTabsSticky}
          tabsContainerRef={tabsContainerRef}
        />
      </div>

      {/* Featured Section */}
      <FeaturedSection
        items={menuItems.filter((item) => item.featured)}
        cartItems={cart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onItemClick={setSelectedItem}
      />

      {/* Separator after featured section */}
      <div className="h-0.5 bg-gray-200 my-0" />

      {/* Menu Items - All Categories */}
      <div>
        {categories.map((category, categoryIndex) => (
          <div key={category.id}>
            <div
              ref={(el) => {
                categoryRefs.current[category.id] = el;
              }}
              data-category-id={category.id}
              className="px-4 py-4 mb-2"
            >
              {/* Category Header */}
              {menuItems.filter((item) => item.categoryId === category.id).length > 0 && (
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {category.emoji} {category.name}
                </h2>
              )}

              {menuItems
                .filter((item) => item.categoryId === category.id)
                .map((item, index) => {
                  const cartItem = cart.find((c) => c.id === item.id);
                  const itemsInCategory = menuItems.filter(
                    (i) => i.categoryId === category.id
                  );
                  return (
                    <div key={item.id}>
                      <MenuItemCard
                        item={item}
                        onAddToCart={handleAddToCart}
                        onRemoveFromCart={handleRemoveFromCart}
                        onItemClick={setSelectedItem}
                        quantity={cartItem?.quantity || 0}
                      />
                      {index < itemsInCategory.length - 1 && (
                        <div className="h-px bg-gray-200 my-3" />
                      )}
                    </div>
                  );
                })}

              {menuItems.filter((item) => item.categoryId === category.id)
                .length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No items available in this category
                  </p>
                </div>
              )}
            </div>

            {/* Separator between categories - Full width */}
            {categoryIndex < categories.length - 1 && (
              <div className="h-0.5 bg-gray-200 mt-3 mb-3 -mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Cart Bar */}
      <CartBar 
        items={cart} 
        total={cartTotal}
        menuItems={menuItems}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onItemClick={setSelectedItem}
      />

      {/* Info Sheet */}
      <InfoSheet open={isInfoOpen} onOpenChange={setIsInfoOpen} />

      {/* Edit Table Modal */}
      <EditTableModal
        open={isTableModalOpen}
        onOpenChange={setIsTableModalOpen}
        tableNumber={tableNumber}
        onConfirm={setTableNumber}
      />

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          open={!!selectedItem}
          onOpenChange={(open) => {
            if (!open) setSelectedItem(null);
          }}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
