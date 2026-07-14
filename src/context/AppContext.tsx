import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product, Settings, WholesaleInquiry, ActiveOffer, Cart } from '../types';

interface AppContextType {
    products: Product[];
    setProducts: (products: Product[]) => void;
    baseRate: number;
    setBaseRate: (rate: number) => void;
    cart: Cart;
    setCart: (cart: Cart) => void;
    settings: Settings;
    setSettings: (settings: Settings) => void;
    inquiries: WholesaleInquiry[];
    setInquiries: (inquiries: WholesaleInquiry[]) => void;
    activeOffer: ActiveOffer;
    setActiveOffer: (offer: ActiveOffer) => void;
    getProductPrice: (product: Product) => number;
    getOriginalPrice: (product: Product) => number;
}

const DEFAULT_PRODUCTS: Product[] = [
    {
        id: "prod-whole",
        title: "Whole Chicken",
        desc: "Fresh raw whole chicken, properly cleaned and gutted. Ready for spit roasting, baking, or curry preparation.",
        image: "/assets/images/whole_chicken.png",
        tag: "Best Seller",
        weight: "800g - 1.5kg",
        type: "Skinless/With Skin",
        priceType: "dynamic",
        multiplier: 1.3,
        fixedPrice: 180
    },
    {
        id: "prod-breast",
        title: "Chicken Breast",
        desc: "Boneless, skinless tender breast fillets. Excellent for fitness enthusiasts, grilling, salads, and steaks.",
        image: "/assets/images/chicken_breast.png",
        tag: "High Protein",
        weight: "500g / 1kg packs",
        type: "Low Fat",
        priceType: "dynamic",
        multiplier: 1.8,
        fixedPrice: 250
    },
    {
        id: "prod-legs",
        title: "Chicken Legs / Drumsticks",
        desc: "Juicy and meaty bone-in drumsticks. Extremely flavorful and perfect for tandoori, curries, and deep frying.",
        image: "/assets/images/chicken_legs.png",
        tag: "",
        weight: "500g / 1kg packs",
        type: "Bone-in",
        priceType: "dynamic",
        multiplier: 1.5,
        fixedPrice: 200
    },
    {
        id: "prod-wings",
        title: "Chicken Wings",
        desc: "Tender and clean chicken wings. Ideal for party snacks, smoky barbecue glazing, or crispy frying.",
        image: "/assets/images/chicken_wings.png",
        tag: "",
        weight: "500g packs",
        type: "Fresh Cut",
        priceType: "dynamic",
        multiplier: 1.2,
        fixedPrice: 160
    },
    {
        id: "prod-boneless",
        title: "Boneless Chicken Cubes",
        desc: "Bite-sized cubes cut from tender breast and leg pieces. Super convenient for butter chicken, tikka, and stir-fries.",
        image: "/assets/images/boneless_chicken.png",
        tag: "Popular",
        weight: "500g / 1kg packs",
        type: "Zero Bone",
        priceType: "dynamic",
        multiplier: 2.2,
        fixedPrice: 300
    },
    {
        id: "prod-mince",
        title: "Chicken Mince / Qeema",
        desc: "Fine ground lean chicken meat. Perfect for making delicious meatballs, burgers, seekh kebabs, and parathas.",
        image: "/assets/images/chicken_mince.png",
        tag: "",
        weight: "500g packs",
        type: "Fine Ground",
        priceType: "dynamic",
        multiplier: 2.0,
        fixedPrice: 280
    }
];

const DEFAULT_SETTINGS: Settings = {
    address: "AACP Chicken, Aayat Poultry, Sikar, Rajasthan - 332001",
    retailPhone: "+91 90572 91246",
    wholesalePhone: "+91 90572 91246",
    retailEmail: "info@aacpchicken.com",
    wholesaleEmail: "sales@aacpchicken.com",
    hoursMonFri: "6:00 AM - 9:00 PM",
    hoursSat: "6:00 AM - 9:00 PM",
    hoursSun: "6:00 AM - 8:00 PM",
    mapsLink: "https://www.google.com/maps?vet=10CAAQoqAOahcKEwig6d_Y5ciVAxUAAAAAHQAAAAAQCQ..i&rlz=1C1DJPT_en-GBIN1175IN1177&sca_esv=a742e9889a0b108d&pvq=Cg0vZy8xMWZ4OWd6dmZyIhMKDXNhbGltIHRyYWRlcnMQAhgD&lqi=ChNzYWxpbSB0cmFkZXJzIHNpa2FySLfTvZfxrYCACFofEAAQARgAGAEYAiITc2FsaW0gdHJhZGVycyBzaWthcpIBDHBvdWx0cnlfZmFybQ&fvr=1&cs=0&um=1&ie=UTF-8&fb=1&gl=in&sa=X&ftid=0x396ca4c78bec4285:0x3a620abe095ff5f1",
    deliveryFlatRate: "20",
    deliveryRatePerKm: "10",
    freeDeliveryMinOrder: "500",
    freeDeliveryMaxDistance: "2"
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProductsState] = useState<Product[]>([]);
    const [baseRate, setBaseRateState] = useState<number>(180);
    const [cart, setCartState] = useState<Cart>({});
    const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
    const [inquiries, setInquiriesState] = useState<WholesaleInquiry[]>([]);
    const [activeOffer, setActiveOfferState] = useState<ActiveOffer>({ enabled: false, percent: 0, text: "" });

    // Load initial state from LocalStorage
    useEffect(() => {
        const storedProducts = localStorage.getItem("salim_products");
        if (storedProducts) {
            setProductsState(JSON.parse(storedProducts));
        } else {
            setProductsState(DEFAULT_PRODUCTS);
            localStorage.setItem("salim_products", JSON.stringify(DEFAULT_PRODUCTS));
        }

        const storedBaseRate = localStorage.getItem("salim_daily_base_rate");
        if (storedBaseRate) {
            setBaseRateState(parseInt(storedBaseRate) || 180);
        }

        const storedCart = localStorage.getItem("salim_cart");
        if (storedCart) {
            setCartState(JSON.parse(storedCart));
        }

        const storedSettings = localStorage.getItem("salim_website_settings");
        if (storedSettings) {
            const parsed = JSON.parse(storedSettings);
            const merged = { ...DEFAULT_SETTINGS, ...parsed };
            setSettingsState(merged);
        } else {
            localStorage.setItem("salim_website_settings", JSON.stringify(DEFAULT_SETTINGS));
        }

        const storedInquiries = localStorage.getItem("salim_wholesale_inquiries");
        if (storedInquiries) {
            setInquiriesState(JSON.parse(storedInquiries));
        }

        const storedOffer = localStorage.getItem("salim_offer");
        if (storedOffer) {
            setActiveOfferState(JSON.parse(storedOffer));
        }
        
        // Fetch live Mandi Rate from server-hosted JSON file if possible
        fetch("/mandi_rate.json?t=" + Date.now())
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("HTTP status: " + response.status);
            })
            .then(data => {
                if (data && data.mandi_rate) {
                    const fetchedRate = parseInt(data.mandi_rate);
                    if (fetchedRate > 0) {
                        setBaseRate(fetchedRate);
                    }
                }
            })
            .catch(err => console.log("Rate file fetch failed:", err));
    }, []);

    // Setters with side-effects to sync to LocalStorage
    const setProducts = (newProducts: Product[]) => {
        setProductsState(newProducts);
        localStorage.setItem("salim_products", JSON.stringify(newProducts));
    };

    const setBaseRate = (rate: number) => {
        setBaseRateState(rate);
        localStorage.setItem("salim_daily_base_rate", rate.toString());
    };

    const setCart = (newCart: Cart) => {
        setCartState(newCart);
        localStorage.setItem("salim_cart", JSON.stringify(newCart));
    };

    const setSettings = (newSettings: Settings) => {
        setSettingsState(newSettings);
        localStorage.setItem("salim_website_settings", JSON.stringify(newSettings));
    };

    const setInquiries = (newInquiries: WholesaleInquiry[]) => {
        setInquiriesState(newInquiries);
        localStorage.setItem("salim_wholesale_inquiries", JSON.stringify(newInquiries));
    };

    const setActiveOffer = (newOffer: ActiveOffer) => {
        setActiveOfferState(newOffer);
        localStorage.setItem("salim_offer", JSON.stringify(newOffer));
    };

    // Derived helpers
    const getOriginalPrice = (p: Product) => {
        if (p.priceType === "fixed") {
            return p.fixedPrice || 0;
        } else {
            const mult = p.multiplier || 1.0;
            return Math.round(baseRate * mult);
        }
    };

    const getProductPrice = (p: Product) => {
        const original = getOriginalPrice(p);
        if (activeOffer.enabled && activeOffer.percent > 0) {
            return Math.round(original * (1 - activeOffer.percent / 100));
        }
        return original;
    };

    return (
        <AppContext.Provider value={{
            products, setProducts,
            baseRate, setBaseRate,
            cart, setCart,
            settings, setSettings,
            inquiries, setInquiries,
            activeOffer, setActiveOffer,
            getOriginalPrice, getProductPrice
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
