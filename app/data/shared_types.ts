export type Product = {
    image_url: string;
    title: string;
    price_cents: number;
    shipping_fee: boolean; // Is the shipping free?
    banner?: string; // Is there a special promotion we want to display as a banner? Should be max a few words.
}