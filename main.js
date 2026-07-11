// AACP Chicken Interactive Script - main.js

// CONFIGURATION: Set the WhatsApp phone number here (with country code, without + or spaces)
let WHATSAPP_PHONE = "919057291246"; 

// Default product catalog with dynamic multipliers and base pricing structures
const DEFAULT_PRODUCTS = [
    {
        id: "prod-whole",
        title: "Whole Chicken",
        desc: "Fresh raw whole chicken, properly cleaned and gutted. Ready for spit roasting, baking, or curry preparation.",
        image: "assets/images/whole_chicken.png",
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
        image: "assets/images/chicken_breast.png",
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
        image: "assets/images/chicken_legs.png",
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
        image: "assets/images/chicken_wings.png",
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
        image: "assets/images/boneless_chicken.png",
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
        image: "assets/images/chicken_mince.png",
        tag: "",
        weight: "500g packs",
        type: "Fine Ground",
        priceType: "dynamic",
        multiplier: 2.0,
        fixedPrice: 280
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const getAdminCoords = (mapsLink) => {
        const DEFAULT = { lat: 27.608609, lon: 75.141122 }; // Sikar, Rajasthan
        if (!mapsLink) return DEFAULT;

        // Strategy 1: @lat,lon (standard Google Maps place URL)
        // Strategy 2: ?q=lat,lon or =lat,lon (search/query URL)
        // Strategy 3: Raw "lat, lon" string (admin typed coordinates directly)
        const patterns = [
            /@([+-]?\d+\.\d+),([+-]?\d+\.\d+)/,
            /[?&]q=([+-]?\d+\.\d+),([+-]?\d+\.\d+)/,
            /^([+-]?\d+\.\d+)\s*,\s*([+-]?\d+\.\d+)$/,
            /([+-]?\d+\.\d{4,}),\s*([+-]?\d+\.\d{4,})/
        ];

        for (const pattern of patterns) {
            const match = mapsLink.match(pattern);
            if (match) {
                const lat = parseFloat(match[1]);
                const lon = parseFloat(match[2]);
                if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                    return { lat, lon };
                }
            }
        }
        return DEFAULT;
    };

    // Haversine formula to calculate distance in km between two coords
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Settings variable declared in DOMContentLoaded scope
    let settings = {};

    // Apply website configurations from settings
    const applyWebsiteSettings = () => {
        const defaultSettings = {
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

        settings = JSON.parse(localStorage.getItem("salim_website_settings")) || {};
        let settingsUpdated = false;
        for (const key in defaultSettings) {
            if (settings[key] === undefined || settings[key] === null) {
                settings[key] = defaultSettings[key];
                settingsUpdated = true;
            }
        }
        // Self-healing migration for old localStorage data
        for (const key in settings) {
            if (typeof settings[key] === "string") {
                if (settings[key].includes("Salim Traders")) {
                    settings[key] = settings[key].replace(/Salim Traders/g, "AACP Chicken");
                    settingsUpdated = true;
                }
                if (settings[key].includes("salimtraders.com")) {
                    settings[key] = settings[key].replace(/salimtraders.com/g, "aacpchicken.com");
                    settingsUpdated = true;
                }
            }
        }
        if (settings.mapsLink && settings.mapsLink.includes("Shop+12")) {
            settings.mapsLink = defaultSettings.mapsLink;
            settingsUpdated = true;
        }
        if (settings.address && settings.address.includes("Okhla")) {
            settings.address = defaultSettings.address;
            settingsUpdated = true;
        }
        // Force update wholesale phone if it's still the old placeholder
        if (settings.wholesalePhone && settings.wholesalePhone.includes("88888")) {
            settings.wholesalePhone = defaultSettings.wholesalePhone;
            settingsUpdated = true;
        }
        if (settingsUpdated) {
            localStorage.setItem("salim_website_settings", JSON.stringify(settings));
        }

        // 1. Update WHATSAPP_PHONE from settings
        const strippedPhone = settings.retailPhone.replace(/[^0-9]/g, "");
        if (strippedPhone) {
            WHATSAPP_PHONE = strippedPhone;
        }

        // 2. Update footer elements
        const footerAddress = document.getElementById("footer-address");
        if (footerAddress) footerAddress.textContent = settings.address;

        const footerRetailPhone = document.getElementById("footer-retail-phone");
        if (footerRetailPhone) {
            footerRetailPhone.textContent = settings.retailPhone;
            footerRetailPhone.href = "tel:" + settings.retailPhone.replace(/\s+/g, "");
        }

        const footerWholesalePhone = document.getElementById("footer-wholesale-phone");
        if (footerWholesalePhone) {
            footerWholesalePhone.textContent = settings.wholesalePhone;
            footerWholesalePhone.href = "tel:" + settings.wholesalePhone.replace(/\s+/g, "");
        }

        const footerRetailEmail = document.getElementById("footer-retail-email");
        if (footerRetailEmail) {
            footerRetailEmail.textContent = settings.retailEmail;
            footerRetailEmail.href = "mailto:" + settings.retailEmail.trim();
        }

        const footerWholesaleEmail = document.getElementById("footer-wholesale-email");
        if (footerWholesaleEmail) {
            footerWholesaleEmail.textContent = settings.wholesaleEmail;
            footerWholesaleEmail.href = "mailto:" + settings.wholesaleEmail.trim();
        }

        const footerHoursMonFri = document.getElementById("footer-hours-mon-fri");
        if (footerHoursMonFri) footerHoursMonFri.textContent = settings.hoursMonFri;

        const footerHoursSat = document.getElementById("footer-hours-sat");
        if (footerHoursSat) footerHoursSat.textContent = settings.hoursSat;

        const footerHoursSun = document.getElementById("footer-hours-sun");
        if (footerHoursSun) footerHoursSun.textContent = settings.hoursSun;

        // 3. Update floating WhatsApp button href & nav order button href
        const whatsappFloatingTrigger = document.getElementById("whatsapp-floating-trigger");
        if (whatsappFloatingTrigger) {
            whatsappFloatingTrigger.href = `https://wa.me/${WHATSAPP_PHONE}?text=Hello%20AACP%20Chicken,%20I%20would%20like%20to%20inquire%20about%20your%20chicken%20products.`;
        }

        const btnNavOrder = document.getElementById("btn-nav-order");
        if (btnNavOrder) {
            btnNavOrder.href = `https://wa.me/${WHATSAPP_PHONE}?text=Hello%20AACP%20Chicken,%20I%20want%20to%20place%20an%20order.`;
        }

        const footerSmsLink = document.getElementById("footer-sms-link");
        if (footerSmsLink) {
            const cleanPhoneForSms = settings.retailPhone.replace(/\s+/g, "");
            footerSmsLink.href = `sms:${cleanPhoneForSms}?body=Hello%20AACP%20Chicken,%20I%20would%20like%20to%20inquire%20about%20your%20chicken%20products.`;
        }

        // 4. Update hero maps/location button
        const btnHeroLocation = document.getElementById("btn-hero-location");
        if (btnHeroLocation) {
            btnHeroLocation.href = settings.mapsLink || defaultSettings.mapsLink;
        }
    };

    applyWebsiteSettings();

    // 1. Initialize Products and Base Rate in LocalStorage
    let products = JSON.parse(localStorage.getItem("salim_products"));
    if (!products || products.length === 0) {
        products = DEFAULT_PRODUCTS;
        localStorage.setItem("salim_products", JSON.stringify(products));
    }

    let baseRate = localStorage.getItem("salim_daily_base_rate");
    if (!baseRate) {
        baseRate = "180";
        localStorage.setItem("salim_daily_base_rate", baseRate);
    }
    baseRate = parseInt(baseRate) || 180;

    // Update live market ticker alert bar base rate
    const baseRateTickerVal = document.getElementById("ticker-base-rate");
    if (baseRateTickerVal) {
        baseRateTickerVal.textContent = "₹" + baseRate;
    }

    // 2. Initialize Cart State from LocalStorage
    let cart = JSON.parse(localStorage.getItem("salim_cart")) || {};

    // Load active offer from localStorage
    const activeOffer = JSON.parse(localStorage.getItem("salim_offer")) || { enabled: false, percent: 0, text: "" };

    // Show offer banner on homepage if active
    const offerBannerEl = document.getElementById("offer-banner");
    const offerBannerText = document.getElementById("offer-banner-text");
    if (activeOffer.enabled && activeOffer.percent > 0) {
        if (offerBannerEl) offerBannerEl.style.display = "flex";
        if (offerBannerText) offerBannerText.textContent = activeOffer.text || `🔥 ${activeOffer.percent}% OFF on all items!`;
    } else {
        if (offerBannerEl) offerBannerEl.style.display = "none";
    }

    const getOriginalPrice = (p, baseRate) => {
        if (p.priceType === "fixed") {
            return p.fixedPrice;
        } else {
            const mult = parseFloat(p.multiplier) || 1.0;
            return Math.round(baseRate * mult);
        }
    };

    const getProductPrice = (p, baseRate) => {
        const original = getOriginalPrice(p, baseRate);
        if (activeOffer.enabled && activeOffer.percent > 0) {
            return Math.round(original * (1 - activeOffer.percent / 100));
        }
        return original;
    };

    // 3. Dynamic Product Grid Rendering with Cart Support
    const productsGridContainer = document.getElementById("products-grid-container");
    const renderProducts = () => {
        if (!productsGridContainer) return;
        productsGridContainer.innerHTML = "";

        const currentBaseRate = parseInt(localStorage.getItem("salim_daily_base_rate")) || 180;

        products.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card card-hover";
            card.id = p.id;

            let tagHtml = "";
            if (p.tag) {
                tagHtml = `<span class="product-tag font-alt">${p.tag}</span>`;
            }

            const calculatedPrice = getProductPrice(p, currentBaseRate);
            const originalPrice = getOriginalPrice(p, currentBaseRate);
            const hasDiscount = activeOffer.enabled && activeOffer.percent > 0 && originalPrice !== calculatedPrice;
            const qty = cart[p.id] || 0;

            let actionHtml = "";
            if (qty > 0) {
                actionHtml = `
                    <div class="product-actions-qty">
                        <div class="qty-btn-container">
                            <button class="qty-btn dec-qty-btn" data-product-id="${p.id}" aria-label="Decrease quantity">-</button>
                            <span class="qty-count">${qty}</span>
                            <button class="qty-btn inc-qty-btn" data-product-id="${p.id}" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                `;
            } else {
                actionHtml = `
                    <div class="product-actions">
                        <button class="btn btn-outline btn-full add-to-cart-btn" data-product-id="${p.id}">
                            <i data-lucide="shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                `;
            }

            // Discount badge for product card
            let discountBadge = "";
            if (hasDiscount) {
                discountBadge = `<span style="position:absolute;top:8px;right:8px;background:linear-gradient(135deg,#ef4444,#f97316);color:#fff;font-family:var(--font-heading);font-size:0.7rem;font-weight:800;padding:3px 8px;border-radius:20px;z-index:2;">${activeOffer.percent}% OFF</span>`;
            }

            // Price display with strikethrough if discount active
            let priceHtml = `<span class="product-card-price">₹${calculatedPrice}</span>`;
            if (hasDiscount) {
                priceHtml = `<span class="product-card-price"><span style="text-decoration:line-through;color:var(--text-muted);font-size:0.8rem;margin-right:4px;">₹${originalPrice}</span> ₹${calculatedPrice}</span>`;
            }

            card.innerHTML = `
                <div class="product-img-container" style="position:relative;">
                    <img src="${p.image}" alt="${p.title}" class="product-img" loading="lazy">
                    ${tagHtml}
                    ${discountBadge}
                </div>
                <div class="product-info">
                    <div class="product-title-row">
                        <h3 class="product-title">${p.title}</h3>
                        ${priceHtml}
                    </div>
                    <p class="product-desc">${p.desc}</p>
                    <div class="product-meta">
                        <span class="meta-item"><i data-lucide="scale"></i> ${p.weight}</span>
                        <span class="meta-item"><i data-lucide="check-circle-2"></i> ${p.type}</span>
                    </div>
                    ${actionHtml}
                </div>
            `;
            productsGridContainer.appendChild(card);
        });

        // Initialize newly appended Lucide icons
        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
    };

    // 4. Cart UI Update Logic
    const updateCart = () => {
        localStorage.setItem("salim_cart", JSON.stringify(cart));
        renderProducts();

        let totalItems = 0;
        let totalPrice = 0;
        const currentBaseRate = parseInt(localStorage.getItem("salim_daily_base_rate")) || 180;

        products.forEach(p => {
            const qty = cart[p.id] || 0;
            if (qty > 0) {
                totalItems += qty;
                totalPrice += getProductPrice(p, currentBaseRate) * qty;
            }
        });

        const cartFloatBtn = document.getElementById("cart-floating-btn");
        const cartItemCount = document.getElementById("cart-item-count");
        const cartBtnSummary = document.getElementById("cart-btn-summary");

        if (cartFloatBtn && cartItemCount && cartBtnSummary) {
            if (totalItems > 0) {
                cartFloatBtn.classList.remove("hide-cart");
                cartItemCount.textContent = totalItems;
                cartBtnSummary.textContent = `₹${totalPrice} (${totalItems} item${totalItems > 1 ? 's' : ''})`;
            } else {
                cartFloatBtn.classList.add("hide-cart");
            }
        }

        renderCartModalItems(currentBaseRate, totalPrice);
    };

    const renderCartModalItems = (baseRate, totalPrice) => {
        const container = document.getElementById("cart-items-container");
        const totalAmountSpan = document.getElementById("cart-total-amount");

        if (!container) return;
        container.innerHTML = "";

        let hasItems = false;

        products.forEach(p => {
            const qty = cart[p.id] || 0;
            if (qty > 0) {
                hasItems = true;
                const price = getProductPrice(p, baseRate);
                const subtotal = price * qty;

                const itemRow = document.createElement("div");
                itemRow.className = "cart-item-row";
                itemRow.innerHTML = `
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${p.title}</h4>
                        <span class="cart-item-price-calc">${qty} x ₹${price} = <strong class="cart-item-subtotal">₹${subtotal}</strong></span>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-qty">
                            <button class="qty-btn dec-qty-btn" data-product-id="${p.id}" aria-label="Decrease quantity">-</button>
                            <span class="qty-count">${qty}</span>
                            <button class="qty-btn inc-qty-btn" data-product-id="${p.id}" aria-label="Increase quantity">+</button>
                        </div>
                        <button class="btn-remove-item" data-product-id="${p.id}" aria-label="Remove item">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                `;
                container.appendChild(itemRow);
            }
        });

        if (!hasItems) {
            container.innerHTML = `<p class="empty-cart-message">Your cart is empty. Add some fresh chicken from our products!</p>`;
        }

        // Calculate dynamic delivery fee if Home Delivery is selected
        const orderTypeChecked = document.querySelector('input[name="order-type"]:checked');
        const isDelivery = orderTypeChecked ? orderTypeChecked.value === "delivery" : true;
        const latInput = document.getElementById("cart-cust-lat");
        const lonInput = document.getElementById("cart-cust-lon");
        
        let deliveryCharge = 0;
        let isFreeDelivery = false;
        let freeDeliveryReason = "";

        const ratePerKm = parseFloat(settings.deliveryRatePerKm) || 10;
        const minOrderForFree = parseFloat(settings.freeDeliveryMinOrder) || 0;
        const maxDistanceForFree = parseFloat(settings.freeDeliveryMaxDistance) || 0;

        const deliveryChargeInfo = document.getElementById("delivery-charge-info");
        const deliveryDistance = document.getElementById("delivery-distance");
        const deliveryChargeAmount = document.getElementById("delivery-charge-amount");
        const promoBanner = document.getElementById("cart-promo-banner");
        const promoMessage = document.getElementById("cart-promo-message");

        // Check if qualified by Order Total threshold (only if there are items in the cart)
        if (totalPrice > 0 && minOrderForFree > 0 && totalPrice >= minOrderForFree) {
            isFreeDelivery = true;
            freeDeliveryReason = `Free Delivery (Order above ₹${minOrderForFree})`;
        }

        if (isDelivery && totalPrice > 0) {
            if (latInput && lonInput && latInput.value && lonInput.value) {
                const customerLat = parseFloat(latInput.value);
                const customerLon = parseFloat(lonInput.value);
                const shopCoords = getAdminCoords(settings.mapsLink);
                const distance = calculateDistance(shopCoords.lat, shopCoords.lon, customerLat, customerLon);
                
                // Check distance-based free delivery if order total threshold not already met
                if (!isFreeDelivery && maxDistanceForFree > 0 && distance <= maxDistanceForFree) {
                    isFreeDelivery = true;
                    freeDeliveryReason = `Free Delivery (Within ${maxDistanceForFree} km)`;
                }

                if (isFreeDelivery) {
                    deliveryCharge = 0;
                } else {
                    deliveryCharge = Math.max(ratePerKm, Math.ceil(distance) * ratePerKm);
                }
                
                if (deliveryChargeInfo && deliveryDistance && deliveryChargeAmount) {
                    deliveryChargeInfo.style.display = "flex";
                    deliveryDistance.textContent = `${distance.toFixed(1)} km`;
                    if (isFreeDelivery) {
                        deliveryChargeAmount.innerHTML = `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.8rem; margin-right: 4px;">₹${Math.max(ratePerKm, Math.ceil(distance) * ratePerKm)}</span> <span style="color: #10b981;">₹0</span>`;
                    } else {
                        deliveryChargeAmount.innerHTML = `₹${deliveryCharge}`;
                    }
                }
            } else {
                // If coordinates are not available (manual address)
                if (isFreeDelivery) {
                    deliveryCharge = 0;
                } else {
                    deliveryCharge = parseInt(settings.deliveryFlatRate) || 20;
                }
                
                if (deliveryChargeInfo && deliveryDistance && deliveryChargeAmount) {
                    deliveryChargeInfo.style.display = "flex";
                    deliveryDistance.textContent = "Manual Address";
                    if (isFreeDelivery) {
                        deliveryChargeAmount.innerHTML = `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.8rem; margin-right: 4px;">₹${parseInt(settings.deliveryFlatRate) || 20}</span> <span style="color: #10b981;">₹0</span>`;
                    } else {
                        deliveryChargeAmount.innerHTML = `₹${deliveryCharge}`;
                    }
                }
            }
            totalPrice += deliveryCharge;
        } else {
            if (deliveryChargeInfo) {
                deliveryChargeInfo.style.display = "none";
            }
        }

        // Render Promo Banner if active
        if (isDelivery && isFreeDelivery && promoBanner && promoMessage && totalPrice > 0) {
            promoBanner.style.display = "flex";
            promoMessage.textContent = freeDeliveryReason;
        } else {
            if (promoBanner) {
                promoBanner.style.display = "none";
            }
        }

        if (totalAmountSpan) {
            totalAmountSpan.textContent = `₹${totalPrice}`;
        }

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
    };

    // Event Delegation for Products Grid Cart Buttons
    if (productsGridContainer) {
        productsGridContainer.addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;

            const productId = btn.getAttribute("data-product-id");
            if (!productId) return;

            if (btn.classList.contains("add-to-cart-btn")) {
                cart[productId] = 1;
                updateCart();
            } else if (btn.classList.contains("inc-qty-btn")) {
                cart[productId] = (cart[productId] || 0) + 1;
                updateCart();
            } else if (btn.classList.contains("dec-qty-btn")) {
                if (cart[productId] > 1) {
                    cart[productId] -= 1;
                } else {
                    delete cart[productId];
                }
                updateCart();
            }
        });
    }

    // Event Delegation for Cart Modal Items List
    const cartItemsContainer = document.getElementById("cart-items-container");
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener("click", (e) => {
            const target = e.target.closest("button");
            if (!target) return;

            const productId = target.getAttribute("data-product-id");
            if (!productId) return;

            if (target.classList.contains("inc-qty-btn")) {
                cart[productId] = (cart[productId] || 0) + 1;
                updateCart();
            } else if (target.classList.contains("dec-qty-btn")) {
                if (cart[productId] > 1) {
                    cart[productId] -= 1;
                } else {
                    delete cart[productId];
                }
                updateCart();
            } else if (target.classList.contains("btn-remove-item")) {
                delete cart[productId];
                updateCart();
            }
        });
    }

    // Cart Modal Display Bindings
    const cartModal = document.getElementById("cart-modal");
    const cartFloatBtn = document.getElementById("cart-floating-btn");
    const cartCloseBtn = document.getElementById("cart-close-btn");

    if (cartFloatBtn && cartModal) {
        cartFloatBtn.addEventListener("click", () => {
            cartModal.classList.add("open");
        });
    }

    if (cartCloseBtn && cartModal) {
        cartCloseBtn.addEventListener("click", () => {
            cartModal.classList.remove("open");
        });
    }

    if (cartModal) {
        cartModal.addEventListener("click", (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove("open");
            }
        });
    }

    // WhatsApp Cart Checkout Order Submission
    const cartForm = document.getElementById("cart-checkout-form");
    if (cartForm) {
        cartForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const orderTypeChecked = document.querySelector('input[name="order-type"]:checked');
            const orderType = orderTypeChecked ? orderTypeChecked.value : "delivery";
            const name = document.getElementById("cart-cust-name").value.trim();
            const address = orderType === "delivery" ? document.getElementById("cart-cust-address").value.trim() : "";
            const notes = document.getElementById("cart-cust-notes").value.trim();

            const currentBaseRate = parseInt(localStorage.getItem("salim_daily_base_rate")) || 180;

            let text = `*New Order - AACP Chicken*\n\n`;
            text += `*Customer Details:*\n`;
            text += `• *Name:* ${name}\n`;
            text += `• *Order Type:* ${orderType === "pickup" ? "Self-Pickup (Take Away)" : "Home Delivery"}\n`;
            if (orderType === "delivery") {
                text += `• *Address:* ${address}\n`;
                const lat = document.getElementById("cart-cust-lat").value;
                const lon = document.getElementById("cart-cust-lon").value;
                if (lat && lon) {
                    text += `• *Delivery Location Pin:* https://www.google.com/maps?q=${lat},${lon}\n`;
                }
            }
            if (notes) {
                text += `• *${orderType === "pickup" ? "Special Notes" : "Delivery Notes"}:* ${notes}\n`;
            }
            text += `\n*Items Ordered:*\n`;
            text += `---------------------------------\n`;

            let grandTotal = 0;
            products.forEach(p => {
                const qty = cart[p.id] || 0;
                if (qty > 0) {
                    const price = getProductPrice(p, currentBaseRate);
                    const subtotal = price * qty;
                    grandTotal += subtotal;
                    text += `• ${qty} x ${p.title} (@ ₹${price}) = *₹${subtotal}*\n`;
                }
            });
            
            // Add delivery charge to WhatsApp message
            let deliveryFee = 0;
            let isFreeDelivery = false;
            let freeDeliveryReason = "";

            const ratePerKm = parseFloat(settings.deliveryRatePerKm) || 10;
            const minOrderForFree = parseFloat(settings.freeDeliveryMinOrder) || 0;
            const maxDistanceForFree = parseFloat(settings.freeDeliveryMaxDistance) || 0;

            // Check if qualified by Order Total threshold (grandTotal here represents items subtotal before delivery fee)
            if (minOrderForFree > 0 && grandTotal >= minOrderForFree) {
                isFreeDelivery = true;
                freeDeliveryReason = `Order above ₹${minOrderForFree}`;
            }

            if (orderType === "delivery") {
                const latInput = document.getElementById("cart-cust-lat");
                const lonInput = document.getElementById("cart-cust-lon");
                if (latInput && lonInput && latInput.value && lonInput.value) {
                    const customerLat = parseFloat(latInput.value);
                    const customerLon = parseFloat(lonInput.value);
                    const shopCoords = getAdminCoords(settings.mapsLink);
                    const distance = calculateDistance(shopCoords.lat, shopCoords.lon, customerLat, customerLon);
                    
                    // Check distance-based free delivery if not already free by order total
                    if (!isFreeDelivery && maxDistanceForFree > 0 && distance <= maxDistanceForFree) {
                        isFreeDelivery = true;
                        freeDeliveryReason = `Within ${maxDistanceForFree} km`;
                    }

                    if (isFreeDelivery) {
                        text += `• Delivery Charge = *FREE* (~${distance.toFixed(1)} km) [Offer: ${freeDeliveryReason}]\n`;
                    } else {
                        deliveryFee = Math.max(ratePerKm, Math.ceil(distance) * ratePerKm);
                        text += `• Delivery Charge = *₹${deliveryFee}* (~${distance.toFixed(1)} km)\n`;
                        grandTotal += deliveryFee;
                    }
                } else {
                    // Fallback to flat rate if coordinates are not available (manual address)
                    if (isFreeDelivery) {
                        text += `• Delivery Charge = *FREE* (Manual Address) [Offer: ${freeDeliveryReason}]\n`;
                    } else {
                        deliveryFee = parseInt(settings.deliveryFlatRate) || 20;
                        text += `• Delivery Charge = *₹${deliveryFee}* (Flat Rate / Manual Address)\n`;
                        grandTotal += deliveryFee;
                    }
                }
            }
            
            text += `---------------------------------\n`;
            text += `*Grand Total: ₹${grandTotal}*\n\n`;
            text += `Please confirm my order. Thank you!`;

            const encodedText = encodeURIComponent(text);
            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

            window.open(whatsappUrl, "_blank");

            // Empty Cart on Successful checkout redirect
            cart = {};
            updateCart();
            cartForm.reset();

            // Clear hidden lat/lon values
            const latInput = document.getElementById("cart-cust-lat");
            const lonInput = document.getElementById("cart-cust-lon");
            if (latInput) latInput.value = "";
            if (lonInput) lonInput.value = "";

            // Reset address group display & required state on form reset
            const deliveryAddressGroup = document.getElementById("delivery-address-group");
            const cartCustAddress = document.getElementById("cart-cust-address");
            const deliveryNotesLabel = document.getElementById("delivery-notes-label");
            if (deliveryAddressGroup && cartCustAddress) {
                deliveryAddressGroup.style.display = "block";
                cartCustAddress.setAttribute("required", "required");
                if (deliveryNotesLabel) deliveryNotesLabel.textContent = "Delivery Notes (Optional)";
            }

            if (cartModal) {
                cartModal.classList.remove("open");
            }
        });
    }

    // Initialize layout and state rendering
    updateCart();

    // 3. Set Current Year in Footer
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 4. Mobile Navigation Menu Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("open");
            menuToggle.classList.toggle("active", isOpen);
        });
    }

    // Close mobile menu when a nav link is clicked
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu && navMenu.classList.contains("open")) {
                navMenu.classList.remove("open");
                menuToggle.classList.remove("active");
            }
        });
    });

    // 5. Sticky Header & Scroll Active Link Updates
    const header = document.querySelector(".navbar-header");
    const sections = document.querySelectorAll("section[id]");

    const handleScroll = () => {
        const scrollY = window.pageYOffset;

        // Sticky header class
        if (header) {
            if (scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        // Section highlighting in navbar
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset for nav height
            const sectionId = current.getAttribute("id");
            const navActiveLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

            if (navActiveLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll(".nav-menu a").forEach(el => el.classList.remove("active"));
                    navActiveLink.classList.add("active");
                }
            }
        });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // 6. Wholesale Quote Form Submission (WhatsApp & LocalStorage Integration)
    const wholesaleForm = document.getElementById("wholesale-quote-form");
    if (wholesaleForm) {
        wholesaleForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("ws-name").value.trim();
            const phone = document.getElementById("ws-phone").value.trim();
            const product = document.getElementById("ws-product").value;
            const quantity = document.getElementById("ws-quantity").value;
            const message = document.getElementById("ws-message").value.trim();

            // Save to LocalStorage for Admin Panel
            const inquiries = JSON.parse(localStorage.getItem("salim_wholesale_inquiries")) || [];
            inquiries.push({
                id: "inq-" + Date.now(),
                name,
                phone,
                product,
                quantity,
                message,
                date: new Date().toLocaleString(),
                status: "Pending"
            });
            localStorage.setItem("salim_wholesale_inquiries", JSON.stringify(inquiries));

            // Constructing WhatsApp Text Message
            let text = `*New Wholesale Inquiry for AACP Chicken*\n\n`;
            text += `*Business Name:* ${name}\n`;
            text += `*Phone:* ${phone}\n`;
            text += `*Product:* ${product}\n`;
            text += `*Quantity:* ${quantity} kg\n`;
            if (message) {
                text += `*Notes:* ${message}\n`;
            }

            const encodedText = encodeURIComponent(text);
            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

            // Open WhatsApp in a new window/tab
            window.open(whatsappUrl, "_blank");
            
            // Clear form
            wholesaleForm.reset();
        });
    }

    // 7. Contact Us Form Submission (WhatsApp & LocalStorage Integration)
    const contactForm = document.getElementById("contact-general-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("contact-name").value.trim();
            const phone = document.getElementById("contact-phone").value.trim();
            const email = document.getElementById("contact-email").value.trim();
            const message = document.getElementById("contact-msg").value.trim();

            // Save to LocalStorage for Admin Panel
            const messages = JSON.parse(localStorage.getItem("salim_contact_messages")) || [];
            messages.push({
                id: "msg-" + Date.now(),
                name,
                phone,
                email,
                message,
                date: new Date().toLocaleString(),
                status: "Unread"
            });
            localStorage.setItem("salim_contact_messages", JSON.stringify(messages));

            // Constructing WhatsApp Text Message
            let text = `*New Contact Inquiry for AACP Chicken*\n\n`;
            text += `*Name:* ${name}\n`;
            text += `*Phone:* ${phone}\n`;
            if (email) {
                text += `*Email:* ${email}\n`;
            }
            text += `*Message:* ${message}\n`;

            const encodedText = encodeURIComponent(text);
            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

            // Open WhatsApp
            window.open(whatsappUrl, "_blank");

            // Clear form
            contactForm.reset();
        });
    }

    // 8. Toggle Delivery Address visibility based on Order Type Selection
    const orderTypeRadios = document.querySelectorAll('input[name="order-type"]');
    const deliveryAddressGroup = document.getElementById("delivery-address-group");
    const cartCustAddress = document.getElementById("cart-cust-address");
    const deliveryNotesLabel = document.getElementById("delivery-notes-label");
    const btnGetLocation = document.getElementById("btn-get-location");

    // Geolocation helper function to autofill the location field
    window.fillUserGeolocation = (force = false) => {
        if (!cartCustAddress) return;

        // Don't overwrite if the user already typed an address, unless they clicked the manual button (force = true)
        if (!force && cartCustAddress.value.trim() !== "") return;

        if (navigator.geolocation) {
            const originalPlaceholder = cartCustAddress.placeholder;
            cartCustAddress.placeholder = "Locating your position... Please allow location access.";

            let originalBtnHTML = "";
            if (btnGetLocation) {
                originalBtnHTML = btnGetLocation.innerHTML;
                btnGetLocation.innerHTML = `<i data-lucide="loader-2" class="spin" style="width: 12px; height: 12px;"></i> Locating...`;
                if (typeof lucide !== "undefined") lucide.createIcons();
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Save coordinates to hidden fields for WhatsApp order link
                    const latInput = document.getElementById("cart-cust-lat");
                    const lonInput = document.getElementById("cart-cust-lon");
                    if (latInput) latInput.value = lat;
                    if (lonInput) lonInput.value = lon;

                    // Recalculate distance and delivery fee in UI
                    updateCart();

                    // Fetch readable street address from OpenStreetMap's Nominatim reverse geocoding API
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
                        .then(res => {
                            if (!res.ok) throw new Error("Reverse geocoding API error");
                            return res.json();
                        })
                        .then(data => {
                            if (data && data.display_name) {
                                cartCustAddress.value = data.display_name;
                            } else {
                                // Fallback to Google Maps link
                                cartCustAddress.value = `https://www.google.com/maps?q=${lat},${lon}`;
                            }
                            cleanup();
                        })
                        .catch(err => {
                            console.error("Reverse geocoding error:", err);
                            // Fallback to Google Maps link
                            cartCustAddress.value = `https://www.google.com/maps?q=${lat},${lon}`;
                            cleanup();
                        });

                    function cleanup() {
                        cartCustAddress.placeholder = originalPlaceholder;
                        if (btnGetLocation) {
                            btnGetLocation.innerHTML = originalBtnHTML;
                            if (typeof lucide !== "undefined") lucide.createIcons();
                        }
                    }
                },
                (error) => {
                    console.warn("Geolocation error:", error);
                    cartCustAddress.placeholder = originalPlaceholder;
                    if (btnGetLocation) {
                        btnGetLocation.innerHTML = originalBtnHTML;
                        if (typeof lucide !== "undefined") lucide.createIcons();
                    }
                    if (force) {
                        alert("Unable to retrieve your location. Please check your browser location permissions and try again, or type your address manually.");
                    }
                },
                { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
            );
        } else {
            if (force) {
                alert("Your browser does not support geolocation. Please type your address manually.");
            }
        }
    };

    if (orderTypeRadios && deliveryAddressGroup && cartCustAddress) {
        orderTypeRadios.forEach(radio => {
            radio.addEventListener("change", (e) => {
                if (e.target.value === "pickup") {
                    deliveryAddressGroup.style.display = "none";
                    cartCustAddress.removeAttribute("required");
                    if (deliveryNotesLabel) deliveryNotesLabel.textContent = "Special Notes (Optional)";
                } else {
                    deliveryAddressGroup.style.display = "block";
                    cartCustAddress.setAttribute("required", "required");
                    if (deliveryNotesLabel) deliveryNotesLabel.textContent = "Delivery Notes (Optional)";
                }
                updateCart(); // Trigger recalculation of delivery charges & grand total
            });
        });
    }

    if (btnGetLocation) {
        btnGetLocation.addEventListener("click", () => {
            window.fillUserGeolocation(true); // force = true so it alerts on failure
        });
    }

    // Fetch live Mandi Rate from server-hosted JSON file (Real-time Sync)
    fetch("mandi_rate.json?t=" + Date.now())
        .then(response => {
            if (response.ok) return response.json();
            throw new Error("HTTP status: " + response.status);
        })
        .then(data => {
            if (data && data.mandi_rate) {
                const fetchedRate = parseInt(data.mandi_rate);
                const currentLocalRate = parseInt(localStorage.getItem("salim_daily_base_rate")) || 180;
                if (fetchedRate > 0 && fetchedRate !== currentLocalRate) {
                    localStorage.setItem("salim_daily_base_rate", fetchedRate.toString());
                    
                    // Re-render UI elements
                    const baseRateTickerVal = document.getElementById("ticker-base-rate");
                    if (baseRateTickerVal) {
                        baseRateTickerVal.textContent = "₹" + fetchedRate;
                    }
                    if (typeof renderProducts === "function") {
                        renderProducts();
                    }
                    if (typeof updateCart === "function") {
                        updateCart();
                    }
                }
            }
        })
        .catch(err => console.log("Rate file fetch failed, using local fallback:", err));

    // Ensure all Lucide icons are rendered on initial page load
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
});
