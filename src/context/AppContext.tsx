import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product, Settings, WholesaleInquiry, ActiveOffer, Cart } from '../types';

interface AppContextType {
    products: Product[];
    setProducts: (products: Product[]) => void;
    fetchProducts: () => Promise<void>;
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

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProductsState(data);
                localStorage.setItem("salim_products", JSON.stringify(data));
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    // Load initial state from LocalStorage
    useEffect(() => {
        const storedProducts = localStorage.getItem("salim_products");
        if (storedProducts) {
            setProductsState(JSON.parse(storedProducts));
        }
        fetchProducts();

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
            products, setProducts, fetchProducts,
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
