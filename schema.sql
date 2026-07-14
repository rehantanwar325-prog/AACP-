CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    desc TEXT NOT NULL,
    image TEXT,
    tag TEXT,
    weight TEXT,
    type TEXT,
    priceType TEXT,
    multiplier REAL,
    fixedPrice INTEGER
);

-- Seed data: We will migrate your DEFAULT_PRODUCTS here
INSERT INTO products (id, title, desc, image, tag, weight, type, priceType, multiplier, fixedPrice) VALUES
('prod-whole', 'Whole Chicken', 'Fresh raw whole chicken, properly cleaned and gutted. Ready for spit roasting, baking, or curry preparation.', '/assets/images/whole_chicken.png', 'Best Seller', '800g - 1.5kg', 'Skinless/With Skin', 'dynamic', 1.3, 180),
('prod-breast', 'Chicken Breast', 'Boneless, skinless tender breast fillets. Excellent for fitness enthusiasts, grilling, salads, and steaks.', '/assets/images/chicken_breast.png', 'High Protein', '500g / 1kg packs', 'Low Fat', 'dynamic', 1.8, 250),
('prod-legs', 'Chicken Legs / Drumsticks', 'Juicy and meaty bone-in drumsticks. Extremely flavorful and perfect for tandoori, curries, and deep frying.', '/assets/images/chicken_legs.png', '', '500g / 1kg packs', 'Bone-in', 'dynamic', 1.5, 200),
('prod-wings', 'Chicken Wings', 'Tender and clean chicken wings. Ideal for party snacks, smoky barbecue glazing, or crispy frying.', '/assets/images/chicken_wings.png', '', '500g packs', 'Fresh Cut', 'dynamic', 1.2, 160),
('prod-boneless', 'Boneless Chicken Cubes', 'Bite-sized cubes cut from tender breast and leg pieces. Super convenient for butter chicken, tikka, and stir-fries.', '/assets/images/boneless_chicken.png', 'Popular', '500g / 1kg packs', 'Zero Bone', 'dynamic', 2.2, 300),
('prod-mince', 'Chicken Mince / Qeema', 'Fine ground lean chicken meat. Perfect for making delicious meatballs, burgers, seekh kebabs, and parathas.', '/assets/images/chicken_mince.png', '', '500g packs', 'Fine Ground', 'dynamic', 2.0, 280);
