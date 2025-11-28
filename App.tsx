import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import CategoryGrid from "./components/CategoryGrid";
import Features from "./components/Features";
import FeaturedItem from "./components/FeaturedItem";
import Testimonials from "./components/Testimonials";
import CustomOrder from "./components/CustomOrder";
import Footer from "./components/Footer";
import CakeGallery from "./components/CakeGallery";
import CupCakeGallery from "./components/CupCakeGallery";
import ProductGallery from "./components/ProductGallery";
import Admin from "./components/Admin";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import { CartItem, Cake, CheckoutDetails } from "./types";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  serverTimestamp,
  get,
} from "firebase/database";
import { getStorage } from "firebase/storage";

const App: React.FC = () => {
  const [view, setView] = React.useState<
    "home" | "cakes" | "cupcakes" | "category" | "admin" | "cart" | "orders"
  >("home");
  const [currentCategory, setCurrentCategory] = React.useState<string>("");
  const slugForCategory = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-");
  const [cart, setCart] = React.useState<CartItem[]>(() => {
    const raw = localStorage.getItem("cart");
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  });
  const categoryRef = React.useRef<HTMLDivElement | null>(null);
  const featuredRef = React.useRef<HTMLDivElement | null>(null);
  const customOrderRef = React.useRef<HTMLDivElement | null>(null);

  const firebaseConfig = {
    apiKey: "AIzaSyAW4t5w7z4mJU2vZtmPu3oVj8DbnvX0gUk",
    authDomain: "rabelani-cakes.firebaseapp.com",
    projectId: "rabelani-cakes",
    storageBucket: "rabelani-cakes.firebasestorage.app",
    messagingSenderId: "88618307532",
    appId: "1:88618307532:web:d75ec8403519f834f31769",
  };
  const app = React.useMemo(() => initializeApp(firebaseConfig), []);
  const auth = React.useMemo(() => getAuth(app), [app]);
  const db = React.useMemo(
    () =>
      getDatabase(app, "https://rabelani-cakes-default-rtdb.firebaseio.com"),
    [app]
  );
  const storage = React.useMemo(() => getStorage(app), [app]);
  const [user, setUser] = React.useState<User | null>(null);
  const [cartSyncing, setCartSyncing] = React.useState(false);
  const [userRole, setUserRole] = React.useState<string>("guest");
  const [adminMode, setAdminMode] = React.useState<
    "products" | "orders" | "special"
  >(() => (localStorage.getItem("adminMode") as any) || "products");
  const [categoryCovers, setCategoryCovers] = React.useState<
    Record<string, string>
  >(() => {
    const raw = localStorage.getItem("categoryCoverOverrides");
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  });

  const saveCart = (next: CartItem[]) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    if (user && !cartSyncing) {
      const cartRef = ref(db, `carts/${user.uid}`);
      set(cartRef, next);
    }
  };

  const addToCart = (cake: Cake) => {
    const existing = cart.find((c) => c.id === cake.id);
    if (existing) {
      saveCart(
        cart.map((c) =>
          c.id === cake.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      const item: CartItem = {
        id: cake.id,
        name: cake.name,
        image: cake.image,
        price: Number(cake.price || 0),
        quantity: 1,
        category: cake.category,
      };
      saveCart([item, ...cart]);
    }
  };

  const inc = (id: number) =>
    saveCart(
      cart.map((c) => (c.id === id ? { ...c, quantity: c.quantity + 1 } : c))
    );
  const dec = (id: number) =>
    saveCart(
      cart.map((c) =>
        c.id === id ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c
      )
    );
  const remove = (id: number) => saveCart(cart.filter((c) => c.id !== id));
  const clear = () => saveCart([]);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const cartRef = ref(db, `carts/${u.uid}`);
        onValue(cartRef, (snap) => {
          const remote = snap.val() as CartItem[] | null;
          if (remote && Array.isArray(remote)) {
            setCartSyncing(true);
            setCart(remote);
            localStorage.setItem("cart", JSON.stringify(remote));
            setCartSyncing(false);
          } else if (!remote && cart.length > 0) {
            set(cartRef, cart);
          }
        });
        const userRef = ref(db, `users/${u.uid}`);
        onValue(userRef, (snap) => {
          const profile = snap.val() as any;
          if (!profile) {
            set(userRef, {
              uid: u.uid,
              displayName: u.displayName || "",
              email: u.email || "",
              role: "user",
            });
            setUserRole("user");
          } else {
            const role = profile.role || "user";
            setUserRole(role);
            if (role === "admin") {
              setView("admin");
            }
          }
        });
      }
    });
    return () => unsub();
  }, [auth, db]);

  React.useEffect(() => {
    const coversRef = ref(db, "categoryCovers");
    onValue(coversRef, (snap) => {
      const val = snap.val() as Record<string, string> | null;
      if (val) setCategoryCovers(val);
    });
  }, [db]);

  const signInGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };
  const signInApple = async () => {
    const provider = new OAuthProvider("apple.com");
    await signInWithPopup(auth, provider);
  };
  const ensureSignedIn = async () => {
    if (auth.currentUser) return auth.currentUser;
    try {
      await signInGoogle();
      return auth.currentUser;
    } catch (e) {
      await signInApple();
      return auth.currentUser;
    }
  };
  const loginAndRoute = async () => {
    const u = await ensureSignedIn();
    if (!u) return;
    const userRef = ref(db, `users/${u.uid}`);
    const snap = await get(userRef);
    let role = "user";
    if (!snap.exists()) {
      await set(userRef, {
        uid: u.uid,
        displayName: u.displayName || "",
        email: u.email || "",
        role: "user",
      });
    } else {
      const val = snap.val() as any;
      role = val.role || "user";
    }
    if (role === "admin") setView("admin");
    else setView("home");
  };
  const checkout = async (details: CheckoutDetails) => {
    const u = await ensureSignedIn();
    if (!u) return;
    const orderRef = ref(db, `orders/${u.uid}`);
    const idRef = push(orderRef);
    const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const orderNumber = `ORD-${now.getFullYear()}${pad(
      now.getMonth() + 1
    )}${pad(now.getDate())}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
    await set(idRef, {
      id: idRef.key,
      orderNumber,
      items: cart,
      total,
      status: "placed",
      createdAt: serverTimestamp(),
      customer: details,
    });
    saveCart([]);
    setView("orders");
  };

  return (
    <div className="min-h-screen bg-texture">
      <Header
        onAdminClick={() => {
          if (user) {
            signOut(auth);
            setView("home");
          } else {
            loginAndRoute();
          }
        }}
        onCartClick={() => setView("cart")}
        onOrdersClick={() => setView("orders")}
        cartCount={cart.reduce((s, it) => s + it.quantity, 0)}
        onLogoClick={() => setView("home")}
        onCakesNavClick={() => setView("cakes")}
        onCupCakesNavClick={() => setView("cupcakes")}
        loggedIn={!!user}
        isAdminView={view === "admin"}
        onAdminViewOrdersClick={() => {
          localStorage.setItem("adminMode", "orders");
          setAdminMode("orders");
          setView("admin");
        }}
        onAdminManageOrdersClick={() => {
          localStorage.setItem("adminMode", "products");
          setAdminMode("products");
          setView("admin");
        }}
        onAdminSpecialClick={() => {
          localStorage.setItem("adminMode", "special");
          setAdminMode("special");
          setView("admin");
        }}
        onSpecialClick={() => {
          setView("home");
          setTimeout(
            () =>
              featuredRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              }),
            0
          );
        }}
        onOffersClick={() => {
          setView("home");
          setTimeout(
            () =>
              customOrderRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              }),
            0
          );
        }}
      />
      <main>
        {view === "cakes" && (
          <CakeGallery onBack={() => setView("home")} onAddToCart={addToCart} />
        )}
        {view === "cupcakes" && (
          <CupCakeGallery
            onBack={() => setView("home")}
            onAddToCart={addToCart}
          />
        )}
        {view === "category" && currentCategory && (
          <ProductGallery
            category={currentCategory}
            folderSlug={slugForCategory(currentCategory)}
            onBack={() => setView("home")}
            onAddToCart={addToCart}
          />
        )}
        {view === "cart" && (
          <Cart
            items={cart}
            onBack={() => setView("home")}
            onInc={inc}
            onDec={dec}
            onRemove={remove}
            onClear={clear}
            onCheckout={checkout}
          />
        )}
        {view === "orders" && user && (
          <Orders userId={user.uid} db={db} onBack={() => setView("home")} />
        )}
        {view === "admin" && (
          <Admin db={db} storage={storage} adminMode={adminMode} />
        )}
        {view === "home" && (
          <>
            <Hero
              onStartOrder={() => {
                setView("home");
                setTimeout(
                  () =>
                    categoryRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    }),
                  0
                );
              }}
              onViewMenu={() => {
                setView("home");
                setTimeout(
                  () =>
                    featuredRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    }),
                  0
                );
              }}
            />
            <Marquee />
            <div ref={categoryRef}>
              <CategoryGrid
                coverOverrides={categoryCovers}
                onCategoryClick={(name) => {
                  if (name === "Cakes") setView("cakes");
                  else if (name === "Cup Cakes") setView("cupcakes");
                  else {
                    setCurrentCategory(name);
                    setView("category");
                  }
                }}
              />
            </div>
            <Features />
            <div ref={featuredRef}>
              <FeaturedItem db={db} />
            </div>
            <Testimonials />
            <div ref={customOrderRef}>
              <CustomOrder />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
