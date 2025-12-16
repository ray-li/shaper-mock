// ProductGrid
import { Box, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { Product } from "~/data/shared_types";


/** Converts a price from a number to a well-formatted string, including the $ sign. */
function getPriceString(priceCents: number): string {
    return `$${(priceCents / 100).toFixed(2)}`;
}

// A product in the grid
function Product({ image_url, title, price_cents, shipping_fee, banner }: Product) {
    return (
        <Box>
            <Box>[Image Here]</Box>
            <Typography>{title}</Typography>
            <Typography>{getPriceString(price_cents)}</Typography>
        </Box>
    )
}

export default function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("/api/users")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setProducts(data);
            })
    })
    
    return (
        <Container maxWidth="lg">
            <Grid container>
                { products.map((product) => (
                    <Grid size={3}>
                        <Product {...product} />
                    </Grid>
                )) }
            </Grid>
        </Container>
    )
}