import type { Product } from "~/data/shared_types"

const products: Product[] = [
    { 
        image_url: "/",
        title: "Shaper Origin",
        price_cents: 289900,
        shipping_fee: false
    }
]

export async function loader() {
    return Response.json(products)
}