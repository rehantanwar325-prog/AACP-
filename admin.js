// Default product catalog copy for migration checks
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
    // 1. Initialize Lucide Icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // 2. Authentication Gate Control
    const loginOverlay = document.getElementById("login-overlay");
    const dashboardWrapper = document.getElementById("dashboard-wrapper");
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error-msg");
    const logoutBtn = document.getElementById("logout-trigger");

    const checkAuth = () => {
        const isLogged = sessionStorage.getItem("salim_admin_logged_in") === "true";
        if (isLogged) {
            loginOverlay.style.display = "none";
            dashboardWrapper.style.display = "grid";
            initializeDashboard();
        } else {
            loginOverlay.style.display = "flex";
            dashboardWrapper.style.display = "none";
        }
    };

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const user = document.getElementById("username").value.trim();
            const pass = document.getElementById("password").value;

            // Simple credentials verification
            if (user === "admin" && pass === "salim123") {
                sessionStorage.setItem("salim_admin_logged_in", "true");
                loginError.style.display = "none";
                loginForm.reset();
                checkAuth();
            } else {
                loginError.style.display = "block";
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("salim_admin_logged_in");
            checkAuth();
        });
    }

    // 3. Navigation Sidebar Tabs Switcher
    const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
    const tabContents = document.querySelectorAll(".tab-content");
    const tabHeading = document.getElementById("tab-heading");
    const tabSubheading = document.getElementById("tab-subheading");

    const tabMeta = {
        overview: {
            title: "Dashboard Overview",
            desc: "Welcome back, Admin. Here is the operational overview for today."
        },
        catalog: {
            title: "Manage Catalog",
            desc: "Add, modify, and delete products that appear on the website catalog."
        },
        wholesale: {
            title: "Wholesale Inquiries",
            desc: "Review and respond to bulk pricing inquiries and volume order requests."
        },
        settings: {
            title: "Manage Settings",
            desc: "Modify your wholesale/retail contact info and operational hours displayed in the website footer."
        }
    };

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetTab = item.getAttribute("data-tab");
            
            // Remove active status
            navItems.forEach(nav => nav.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));
            
            // Set active status
            item.classList.add("active");
            document.getElementById(`tab-${targetTab}`).classList.add("active");
            
            // Update Title texts
            if (tabMeta[targetTab]) {
                tabHeading.textContent = tabMeta[targetTab].title;
                tabSubheading.textContent = tabMeta[targetTab].desc;
            }

            // Reload relevant datasets
            refreshData();
        });
    });

    // 4. Data Loading and Tables Binding
    let products = [];
    let inquiries = [];

    const baseRateForm = document.getElementById("base-rate-form");
    const baseRateInput = document.getElementById("base-rate-input");

    if (baseRateForm) {
        baseRateForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newRate = baseRateInput.value;
            localStorage.setItem("salim_daily_base_rate", newRate);

            // Push updated rate to GitHub repo (auto-deploys via Cloudflare)
            const ghToken = localStorage.getItem("salim_github_token") || "";
            if (ghToken) {
                try {
                    // Get current file SHA
                    const getResp = await fetch("https://api.github.com/repos/rehantanwar325-prog/AACP-/contents/mandi_rate.json?ref=cloudflare/workers-autoconfig", {
                        headers: { 
                            "Authorization": "Bearer " + ghToken,
                            "Accept": "application/vnd.github+json"
                        }
                    });
                    const fileData = await getResp.json();
                    const sha = fileData.sha || "";

                    // Push new content
                    const content = btoa(JSON.stringify({ mandi_rate: parseInt(newRate) }) + "\n");
                    const putResp = await fetch("https://api.github.com/repos/rehantanwar325-prog/AACP-/contents/mandi_rate.json", {
                        method: "PUT",
                        headers: {
                            "Authorization": "Bearer " + ghToken,
                            "Content-Type": "application/json",
                            "Accept": "application/vnd.github+json"
                        },
                        body: JSON.stringify({
                            message: "Update mandi rate to " + newRate,
                            content: content,
                            sha: sha,
                            branch: "cloudflare/workers-autoconfig"
                        })
                    });
                    if (putResp.ok) {
                        console.log("Rate pushed to GitHub successfully!");
                        alert("Daily chicken base rate successfully updated to ₹" + newRate + "/Kg and synced online!");
                    } else {
                        console.error("GitHub push failed:", await putResp.text());
                        alert("Daily chicken base rate updated locally, but failed to sync online. (GitHub API error)");
                    }
                } catch (err) {
                    console.error("GitHub API error:", err);
                    alert("Daily chicken base rate updated locally, but failed to sync online.");
                }
            } else {
                alert("Daily chicken base rate updated locally (₹" + newRate + "/Kg). IMPORTANT: Please paste your GitHub Token in 'Live Rate Sync' settings to sync this change across all devices!");
            }

            refreshData();
        });
    }

    function initializeDashboard() {
        const rate = localStorage.getItem("salim_daily_base_rate") || "180";
        if (baseRateInput) {
            baseRateInput.value = rate;
        }

        // Fetch live Mandi Rate from server-hosted JSON file
        fetch("mandi_rate.json?t=" + Date.now())
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("HTTP status: " + response.status);
            })
            .then(data => {
                if (data && data.mandi_rate) {
                    const fetchedRate = parseInt(data.mandi_rate);
                    if (fetchedRate > 0) {
                        localStorage.setItem("salim_daily_base_rate", fetchedRate.toString());
                        if (baseRateInput) {
                            baseRateInput.value = fetchedRate.toString();
                        }
                        refreshData();
                    }
                }
            })
            .catch(err => console.log("Rate file fetch failed inside admin:", err));

        // GitHub Token setup
        const ghTokenInput = document.getElementById("github-token-input");
        const btnSaveToken = document.getElementById("btn-save-github-token");
        if (ghTokenInput) {
            const savedToken = localStorage.getItem("salim_github_token") || "";
            if (savedToken) ghTokenInput.value = savedToken;
        }
        if (btnSaveToken) {
            btnSaveToken.addEventListener("click", () => {
                const token = document.getElementById("github-token-input").value.trim();
                if (token) {
                    localStorage.setItem("salim_github_token", token);
                    alert("GitHub Token saved! Now when you update the rate, it will auto-sync to all devices.");
                } else {
                    localStorage.removeItem("salim_github_token");
                    alert("GitHub Token removed.");
                }
            });
        }

        initializeSettings();
        refreshData();
    }

    function initializeSettings() {
        const settingsForm = document.getElementById("settings-management-form");
        if (!settingsForm) return;

        // Default settings object
        const defaultSettings = {
            address: "AACP Chicken, Aayat Poultry, Sikar, Rajasthan - 332001",
            retailPhone: "+91 90572 91246",
            wholesalePhone: "+91 88888 88888",
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

        // Load existing settings or save defaults if empty
        let currentSettings = JSON.parse(localStorage.getItem("salim_website_settings")) || {};
        let settingsUpdated = false;
        for (const key in defaultSettings) {
            if (currentSettings[key] === undefined || currentSettings[key] === null) {
                currentSettings[key] = defaultSettings[key];
                settingsUpdated = true;
            }
        }
        // Self-healing migration for old localStorage data
        for (const key in currentSettings) {
            if (typeof currentSettings[key] === "string") {
                if (currentSettings[key].includes("Salim Traders")) {
                    currentSettings[key] = currentSettings[key].replace(/Salim Traders/g, "AACP Chicken");
                    settingsUpdated = true;
                }
                if (currentSettings[key].includes("salimtraders.com")) {
                    currentSettings[key] = currentSettings[key].replace(/salimtraders.com/g, "aacpchicken.com");
                    settingsUpdated = true;
                }
            }
        }
        if (currentSettings.mapsLink && currentSettings.mapsLink.includes("Shop+12")) {
            currentSettings.mapsLink = defaultSettings.mapsLink;
            settingsUpdated = true;
        }
        if (currentSettings.address && currentSettings.address.includes("Okhla")) {
            currentSettings.address = defaultSettings.address;
            settingsUpdated = true;
        }
        if (settingsUpdated) {
            localStorage.setItem("salim_website_settings", JSON.stringify(currentSettings));
        }

        // Fill form fields
        document.getElementById("set-address").value = currentSettings.address;
        document.getElementById("set-maps-link").value = currentSettings.mapsLink || defaultSettings.mapsLink;
        document.getElementById("set-delivery-flat-rate").value = currentSettings.deliveryFlatRate || defaultSettings.deliveryFlatRate;
        document.getElementById("set-delivery-rate-per-km").value = currentSettings.deliveryRatePerKm || defaultSettings.deliveryRatePerKm;
        document.getElementById("set-free-delivery-min-order").value = currentSettings.freeDeliveryMinOrder || defaultSettings.freeDeliveryMinOrder;
        document.getElementById("set-free-delivery-max-distance").value = currentSettings.freeDeliveryMaxDistance || defaultSettings.freeDeliveryMaxDistance;
        document.getElementById("set-retail-phone").value = currentSettings.retailPhone;
        document.getElementById("set-wholesale-phone").value = currentSettings.wholesalePhone;
        document.getElementById("set-retail-email").value = currentSettings.retailEmail;
        document.getElementById("set-wholesale-email").value = currentSettings.wholesaleEmail;
        document.getElementById("set-hours-mon-fri").value = currentSettings.hoursMonFri;
        document.getElementById("set-hours-sat").value = currentSettings.hoursSat;
        document.getElementById("set-hours-sun").value = currentSettings.hoursSun;

        // Add submit event listener (avoiding duplicates)
        if (!settingsForm.dataset.listenerAttached) {
            settingsForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const updatedSettings = {
                    address: document.getElementById("set-address").value.trim(),
                    mapsLink: document.getElementById("set-maps-link").value.trim(),
                    deliveryFlatRate: document.getElementById("set-delivery-flat-rate").value.trim(),
                    deliveryRatePerKm: document.getElementById("set-delivery-rate-per-km").value.trim(),
                    freeDeliveryMinOrder: document.getElementById("set-free-delivery-min-order").value.trim(),
                    freeDeliveryMaxDistance: document.getElementById("set-free-delivery-max-distance").value.trim(),
                    retailPhone: document.getElementById("set-retail-phone").value.trim(),
                    wholesalePhone: document.getElementById("set-wholesale-phone").value.trim(),
                    retailEmail: document.getElementById("set-retail-email").value.trim(),
                    wholesaleEmail: document.getElementById("set-wholesale-email").value.trim(),
                    hoursMonFri: document.getElementById("set-hours-mon-fri").value.trim(),
                    hoursSat: document.getElementById("set-hours-sat").value.trim(),
                    hoursSun: document.getElementById("set-hours-sun").value.trim()
                };

                localStorage.setItem("salim_website_settings", JSON.stringify(updatedSettings));
                alert("Operational hours and contact settings successfully updated! Refresh the main website to see updates.");
            });
            settingsForm.dataset.listenerAttached = "true";
        }
    }

    function refreshData() {
        // Load data from LocalStorage
        products = JSON.parse(localStorage.getItem("salim_products")) || [];
        
        // Migration Check: If old data structure doesn't have multipliers, reset to bind base rates
        if (products.length === 0 || !products[0].priceType) {
            products = DEFAULT_PRODUCTS;
            localStorage.setItem("salim_products", JSON.stringify(products));
        }

        inquiries = JSON.parse(localStorage.getItem("salim_wholesale_inquiries")) || [];

        // Bind data to tables and update stats
        updateOverviewStats();
        renderRecentOverviewTables();
        renderCatalogTable();
        renderWholesaleInquiriesTable();
    }

    // 5. Update Stat Counts
    function updateOverviewStats() {
        const prodCountEl = document.getElementById("metric-products-count");
        const wholesaleCountEl = document.getElementById("metric-wholesale-count");
        const messagesCountEl = document.getElementById("metric-messages-count");

        if (prodCountEl) prodCountEl.textContent = products.length;
        
        if (wholesaleCountEl) {
            const pendingInq = inquiries.filter(i => i.status === "Pending").length;
            wholesaleCountEl.textContent = pendingInq;
        }
    }

    // 6. Render Recent Lists inside Dashboard Tab
    function renderRecentOverviewTables() {
        const recentWholesaleContainer = document.getElementById("recent-wholesale-list");

        // Bind Wholesale
        if (recentWholesaleContainer) {
            recentWholesaleContainer.innerHTML = "";
            const recentInquiries = [...inquiries].reverse().slice(0, 5);
            
            if (recentInquiries.length === 0) {
                recentWholesaleContainer.innerHTML = `<tr><td colspan="5" class="text-center" style="color:var(--text-muted)">No wholesale queries received yet.</td></tr>`;
            } else {
                recentInquiries.forEach(inq => {
                    const row = document.createElement("tr");
                    const dateClean = inq.date.split(",")[0];
                    const statusClass = inq.status === "Pending" ? "pending" : "responded";
                    
                    row.innerHTML = `
                        <td>${dateClean}</td>
                        <td><strong>${inq.name}</strong></td>
                        <td>${inq.product}</td>
                        <td>${inq.quantity} kg</td>
                        <td><span class="badge-status ${statusClass}">${inq.status}</span></td>
                    `;
                    recentWholesaleContainer.appendChild(row);
                });
            }
        }
    }

    // 7. Render Product Catalog Table
    function renderCatalogTable() {
        const catalogTable = document.getElementById("catalog-products-table");
        if (!catalogTable) return;
        catalogTable.innerHTML = "";

        if (products.length === 0) {
            catalogTable.innerHTML = `<tr><td colspan="6" class="text-center" style="color:var(--text-muted); padding:30px">Catalog is empty. Add a product to get started.</td></tr>`;
            return;
        }

        const baseRate = parseInt(localStorage.getItem("salim_daily_base_rate")) || 180;

        products.forEach(p => {
            const row = document.createElement("tr");
            
            let pricingModelHtml = "";
            let calculatedPrice = 0;
            if (p.priceType === "fixed") {
                pricingModelHtml = `Fixed Price`;
                calculatedPrice = p.fixedPrice || 0;
            } else {
                const mult = parseFloat(p.multiplier) || 1.0;
                pricingModelHtml = `Dynamic (${mult}x Base)`;
                calculatedPrice = Math.round(baseRate * mult);
            }
            
            row.innerHTML = `
                <td><img src="${p.image}" class="table-img" alt="${p.title}"></td>
                <td><strong>${p.title}</strong><br><small style="color:var(--text-muted); display:inline-block; max-width: 250px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap">${p.desc}</small></td>
                <td><span style="font-size:0.85rem">${pricingModelHtml}</span></td>
                <td><strong>₹${calculatedPrice}</strong></td>
                <td>${p.weight}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="btn-icon edit" data-id="${p.id}" title="Edit details"><i data-lucide="pen"></i></button>
                        <button type="button" class="btn-icon delete" data-id="${p.id}" title="Delete product"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            `;
            catalogTable.appendChild(row);
        });

        // Add Listeners to buttons inside list
        document.querySelectorAll("#catalog-products-table .btn-icon.edit").forEach(btn => {
            btn.addEventListener("click", () => openEditProductModal(btn.getAttribute("data-id")));
        });

        document.querySelectorAll("#catalog-products-table .btn-icon.delete").forEach(btn => {
            btn.addEventListener("click", () => deleteProduct(btn.getAttribute("data-id")));
        });

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
    }

    // 8. Render Wholesale Inquiries List Table
    function renderWholesaleInquiriesTable() {
        const tableBody = document.getElementById("wholesale-inquiries-table");
        if (!tableBody) return;
        tableBody.innerHTML = "";

        if (inquiries.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" class="text-center" style="color:var(--text-muted); padding:30px">No wholesale quote requests received yet.</td></tr>`;
            return;
        }

        // Render sorted by most recent first
        [...inquiries].reverse().forEach(inq => {
            const row = document.createElement("tr");
            const statusClass = inq.status === "Pending" ? "pending" : "responded";
            
            row.innerHTML = `
                <td>${inq.date}</td>
                <td><strong>${inq.name}</strong></td>
                <td><a href="tel:${inq.phone}">${inq.phone}</a></td>
                <td>${inq.product}</td>
                <td><strong>${inq.quantity} kg</strong></td>
                <td style="max-width:240px; font-size:0.85rem">${inq.message || '<em style="color:var(--text-muted)">None</em>'}</td>
                <td><span class="badge-status ${statusClass}">${inq.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="btn-icon whatsapp" data-phone="${inq.phone}" data-name="${inq.name}" data-prod="${inq.product}" data-qty="${inq.quantity}" title="Reply via WhatsApp"><i data-lucide="message-circle"></i></button>
                        ${inq.status === "Pending" ? `<button type="button" class="btn-icon resolve" data-id="${inq.id}" title="Mark Responded"><i data-lucide="check"></i></button>` : ""}
                        <button type="button" class="btn-icon delete" data-id="${inq.id}" title="Remove entry"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add Listeners
        document.querySelectorAll("#wholesale-inquiries-table .btn-icon.resolve").forEach(btn => {
            btn.addEventListener("click", () => resolveInquiry(btn.getAttribute("data-id")));
        });

        document.querySelectorAll("#wholesale-inquiries-table .btn-icon.delete").forEach(btn => {
            btn.addEventListener("click", () => deleteInquiry(btn.getAttribute("data-id")));
        });

        document.querySelectorAll("#wholesale-inquiries-table .btn-icon.whatsapp").forEach(btn => {
            btn.addEventListener("click", () => {
                const phone = btn.getAttribute("data-phone");
                const name = btn.getAttribute("data-name");
                const prod = btn.getAttribute("data-prod");
                const qty = btn.getAttribute("data-qty");
                replyWholesaleWhatsApp(phone, name, prod, qty);
            });
        });

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
    }



    // 10. CRUD Logic: Catalog Add/Edit Product Modal triggers
    const modal = document.getElementById("product-modal");
    const modalCloseBtn = document.getElementById("modal-close-trigger");
    const productForm = document.getElementById("product-form");
    const btnAddProduct = document.getElementById("btn-add-product");
    const modalTitle = document.getElementById("modal-title");

    // Modal pricing field toggle logic helpers
    const priceTypeSelect = document.getElementById("prod-price-type");
    const dynamicGroup = document.getElementById("pricing-input-dynamic-group");
    const fixedGroup = document.getElementById("pricing-input-fixed-group");
    const multiplierInput = document.getElementById("prod-multiplier");
    const fixedPriceInput = document.getElementById("prod-fixed-price");

    const togglePricingFields = () => {
        if (!priceTypeSelect) return;
        if (priceTypeSelect.value === "fixed") {
            if (dynamicGroup) dynamicGroup.style.display = "none";
            if (fixedGroup) fixedGroup.style.display = "block";
            if (multiplierInput) multiplierInput.removeAttribute("required");
            if (fixedPriceInput) fixedPriceInput.setAttribute("required", "true");
        } else {
            if (dynamicGroup) dynamicGroup.style.display = "block";
            if (fixedGroup) fixedGroup.style.display = "none";
            if (multiplierInput) multiplierInput.setAttribute("required", "true");
            if (fixedPriceInput) fixedPriceInput.removeAttribute("required");
        }
    };

    if (priceTypeSelect) {
        priceTypeSelect.addEventListener("change", togglePricingFields);
    }

    // === IMAGE UPLOAD SYSTEM ===
    const imageDropzone = document.getElementById("image-dropzone");
    const imageFileInput = document.getElementById("prod-image-file");
    const imagePreview = document.getElementById("prod-image-preview");
    const uploadPlaceholder = document.getElementById("upload-placeholder");
    const usePresetToggle = document.getElementById("use-preset-toggle");
    const presetSelect = document.getElementById("prod-image-preset");
    const hiddenImageInput = document.getElementById("prod-image");

    // Click to open file picker
    if (imageDropzone) {
        imageDropzone.addEventListener("click", () => {
            if (usePresetToggle && usePresetToggle.checked) return;
            if (imageFileInput) imageFileInput.click();
        });
    }

    // Drag & Drop
    if (imageDropzone) {
        imageDropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            imageDropzone.classList.add("drag-over");
        });
        imageDropzone.addEventListener("dragleave", () => {
            imageDropzone.classList.remove("drag-over");
        });
        imageDropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            imageDropzone.classList.remove("drag-over");
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleImageFile(e.dataTransfer.files[0]);
            }
        });
    }

    // File input change
    if (imageFileInput) {
        imageFileInput.addEventListener("change", () => {
            if (imageFileInput.files && imageFileInput.files[0]) {
                handleImageFile(imageFileInput.files[0]);
            }
        });
    }

    // Convert file to Base64 and show preview
    function handleImageFile(file) {
        if (file.size > 2 * 1024 * 1024) {
            alert("Image file is too large! Maximum size is 2MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            if (hiddenImageInput) hiddenImageInput.value = base64;
            showImagePreview(base64);
        };
        reader.readAsDataURL(file);
    }

    function showImagePreview(src) {
        if (imagePreview) {
            imagePreview.src = src;
            imagePreview.style.display = "block";
        }
        if (uploadPlaceholder) uploadPlaceholder.style.display = "none";
    }

    function resetImageUpload() {
        if (imagePreview) {
            imagePreview.src = "";
            imagePreview.style.display = "none";
        }
        if (uploadPlaceholder) uploadPlaceholder.style.display = "flex";
        if (imageFileInput) imageFileInput.value = "";
        if (hiddenImageInput) hiddenImageInput.value = "assets/images/whole_chicken.png";
        if (usePresetToggle) usePresetToggle.checked = false;
        if (presetSelect) presetSelect.style.display = "none";
        if (imageDropzone) imageDropzone.style.display = "flex";
    }

    // Preset toggle switch
    if (usePresetToggle) {
        usePresetToggle.addEventListener("change", () => {
            if (usePresetToggle.checked) {
                if (presetSelect) presetSelect.style.display = "block";
                if (imageDropzone) imageDropzone.style.display = "none";
                if (hiddenImageInput) hiddenImageInput.value = presetSelect.value;
            } else {
                if (presetSelect) presetSelect.style.display = "none";
                if (imageDropzone) imageDropzone.style.display = "flex";
                // Restore from preview if present, else default
                if (imagePreview && imagePreview.src && imagePreview.style.display !== "none") {
                    if (hiddenImageInput) hiddenImageInput.value = imagePreview.src;
                } else {
                    if (hiddenImageInput) hiddenImageInput.value = "assets/images/whole_chicken.png";
                }
            }
        });
    }

    if (presetSelect) {
        presetSelect.addEventListener("change", () => {
            if (hiddenImageInput) hiddenImageInput.value = presetSelect.value;
        });
    }

    // === MODAL OPEN / CLOSE ===
    const openAddProductModal = () => {
        if (productForm && modal) {
            productForm.reset();
            document.getElementById("prod-edit-id").value = "";
            if (priceTypeSelect) priceTypeSelect.value = "dynamic";
            togglePricingFields();
            resetImageUpload();
            modalTitle.textContent = "Add New Catalog Product";
            modal.style.display = "flex";
            if (typeof lucide !== "undefined") lucide.createIcons();
        }
    };

    const openEditProductModal = (id) => {
        const p = products.find(prod => prod.id === id);
        if (p && productForm && modal) {
            document.getElementById("prod-edit-id").value = p.id;
            document.getElementById("prod-title").value = p.title;
            document.getElementById("prod-desc").value = p.desc;
            document.getElementById("prod-tag").value = p.tag || "";
            document.getElementById("prod-weight").value = p.weight;
            document.getElementById("prod-type").value = p.type;
            
            // Set image - always show dropzone with current image preview
            if (hiddenImageInput) hiddenImageInput.value = p.image;
            showImagePreview(p.image);
            if (usePresetToggle) usePresetToggle.checked = false;
            if (presetSelect) presetSelect.style.display = "none";
            if (imageDropzone) imageDropzone.style.display = "flex";

            if (priceTypeSelect) priceTypeSelect.value = p.priceType || "dynamic";
            if (multiplierInput) multiplierInput.value = p.multiplier || "1.0";
            if (fixedPriceInput) fixedPriceInput.value = p.fixedPrice || "";
            togglePricingFields();
            
            modalTitle.textContent = "Edit Product Details";
            modal.style.display = "flex";
            if (typeof lucide !== "undefined") lucide.createIcons();
        }
    };

    const closeModal = () => {
        if (modal) modal.style.display = "none";
    };

    if (btnAddProduct) btnAddProduct.addEventListener("click", openAddProductModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);

    // Form submit for Add / Edit
    if (productForm) {
        productForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const id = document.getElementById("prod-edit-id").value;
            const title = document.getElementById("prod-title").value.trim();
            const desc = document.getElementById("prod-desc").value.trim();
            const image = document.getElementById("prod-image").value || "assets/images/whole_chicken.png";
            const tag = document.getElementById("prod-tag").value.trim();
            const weight = document.getElementById("prod-weight").value.trim();
            const type = document.getElementById("prod-type").value.trim();
            
            const priceType = document.getElementById("prod-price-type").value;
            const multiplier = document.getElementById("prod-multiplier").value;
            const fixedPrice = document.getElementById("prod-fixed-price").value;

            const productData = { 
                id, 
                title, 
                desc, 
                image, 
                tag, 
                weight, 
                type, 
                priceType, 
                multiplier: parseFloat(multiplier) || 1.0, 
                fixedPrice: parseInt(fixedPrice) || 0 
            };

            if (id) {
                // Edit existing
                const index = products.findIndex(p => p.id === id);
                if (index !== -1) {
                    products[index] = productData;
                }
            } else {
                // Add new
                productData.id = "prod-" + Date.now();
                products.push(productData);
            }

            // Save and reload
            localStorage.setItem("salim_products", JSON.stringify(products));
            closeModal();
            refreshData();
        });
    }

    // Delete Product
    function deleteProduct(id) {
        if (confirm("Are you sure you want to delete this product from the website catalog?")) {
            products = products.filter(p => p.id !== id);
            localStorage.setItem("salim_products", JSON.stringify(products));
            refreshData();
        }
    }

    // 11. Actions: Inquiries & Message updates
    function resolveInquiry(id) {
        const index = inquiries.findIndex(inq => inq.id === id);
        if (index !== -1) {
            inquiries[index].status = "Responded";
            localStorage.setItem("salim_wholesale_inquiries", JSON.stringify(inquiries));
            refreshData();
        }
    }

    function deleteInquiry(id) {
        if (confirm("Delete this inquiry entry?")) {
            inquiries = inquiries.filter(inq => inq.id !== id);
            localStorage.setItem("salim_wholesale_inquiries", JSON.stringify(inquiries));
            refreshData();
        }
    }



    // 12. WhatsApp Replies Automation
    function replyWholesaleWhatsApp(phone, name, product, quantity) {
        // Clean phone number (remove +, spaces, leading zeros if user typed incorrectly)
        let cleanPhone = phone.replace(/[^0-9]/g, "");
        if (cleanPhone.length === 10) {
            cleanPhone = "91" + cleanPhone; // Fallback prefix for Indian mobile numbers
        }

        let text = `Hello ${name},\n\nThis is the Sales Department of AACP Chicken. We received your bulk wholesale inquiry for:\n\n`;
        text += `- *Product:* ${product}\n`;
        text += `- *Volume:* ${quantity} kg\n\n`;
        text += `We would love to discuss custom discounted pricing and shipping timelines. Please let us know if this is a good time to call.`;

        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, "_blank");
    }



    // ==========================================
    // Offers & Promotions Management
    // ==========================================
    const offerToggle = document.getElementById("offer-toggle");
    const offerFieldsContainer = document.getElementById("offer-fields-container");
    const btnSaveOffer = document.getElementById("btn-save-offer");
    const offerPercentInput = document.getElementById("set-offer-percent");
    const offerTextInput = document.getElementById("set-offer-text");

    // Load existing offer from localStorage
    function loadOfferSettings() {
        const offer = JSON.parse(localStorage.getItem("salim_offer")) || { enabled: false, percent: 10, text: "🔥 Today's Special: 10% OFF on all items!" };
        
        if (offerToggle) offerToggle.checked = offer.enabled;
        if (offerPercentInput) offerPercentInput.value = offer.percent;
        if (offerTextInput) offerTextInput.value = offer.text;
        
        if (offerFieldsContainer) {
            offerFieldsContainer.style.display = offer.enabled ? "block" : "none";
        }
    }

    // Toggle show/hide offer fields
    if (offerToggle) {
        offerToggle.addEventListener("change", () => {
            if (offerFieldsContainer) {
                offerFieldsContainer.style.display = offerToggle.checked ? "block" : "none";
            }
            // If toggling OFF, immediately save as disabled
            if (!offerToggle.checked) {
                const offer = JSON.parse(localStorage.getItem("salim_offer")) || {};
                offer.enabled = false;
                localStorage.setItem("salim_offer", JSON.stringify(offer));
                alert("Offer has been turned OFF! Refresh the main website to see the change.");
            }
        });
    }

    // Save offer
    if (btnSaveOffer) {
        btnSaveOffer.addEventListener("click", () => {
            const percent = parseInt(offerPercentInput.value) || 10;
            const text = offerTextInput.value.trim() || `🔥 Today's Special: ${percent}% OFF on all items!`;
            
            if (percent < 1 || percent > 90) {
                alert("Discount percentage must be between 1% and 90%.");
                return;
            }

            const offer = {
                enabled: true,
                percent: percent,
                text: text
            };

            localStorage.setItem("salim_offer", JSON.stringify(offer));
            alert(`✅ Offer Activated!\n\n${text}\n\nDiscount: ${percent}% OFF on all items.\nRefresh the main website to see the change.`);
        });
    }

    loadOfferSettings();

    // Run Auth check on load (after all DOM variables and helper methods are declared)
    checkAuth();
});
