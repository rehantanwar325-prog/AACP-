export interface Product {
    id: string;
    title: string;
    desc: string;
    image: string;
    tag: string;
    weight: string;
    type: string;
    priceType: 'dynamic' | 'fixed';
    multiplier: number;
    fixedPrice: number;
}

export interface Settings {
    address: string;
    retailPhone: string;
    wholesalePhone: string;
    retailEmail: string;
    wholesaleEmail: string;
    hoursMonFri: string;
    hoursSat: string;
    hoursSun: string;
    mapsLink: string;
    deliveryFlatRate: string;
    deliveryRatePerKm: string;
    freeDeliveryMinOrder: string;
    freeDeliveryMaxDistance: string;
}

export interface WholesaleInquiry {
    id: string;
    date: string;
    name: string;
    phone: string;
    product: string;
    quantity: string;
    message: string;
    status: 'Pending' | 'Responded';
}

export interface ActiveOffer {
    enabled: boolean;
    percent: number;
    text: string;
}

export interface Cart {
    [productId: string]: number;
}
