import { Box, Grid, Stack, Typography } from "@mui/material";
import type { LinkItem } from "~/types";


type FooterColumn = {
    title: string;
    links: { label: string, to: string }[];
}

const columns: FooterColumn[] = [
    {
        title: "Company",
        links: [
            { label: "Find a Dealer", to: "/" },
            { label: "Reconditioned Tools", to: "/" },
            { label: "Origin Trade-In Program", to: "/" },
            { label: "Blog", to: "/" },
            { label: "Careers", to: "/" },
            { label: "Press", to: "/" },
            { label: "Software Releases", to: "/" },
            { label: "Contact Us", to: "/" },
        ]
    },
    {
        title: "Social",
        links: [
            { label: "Instagram", to: "/" },
            { label: "YouTube", to: "/" },
            { label: "TikTok", to: "/" },
            { label: "Facebook", to: "/" },
            { label: "X (Twitter)", to: "/" },
        ]
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", to: "/" },
            { label: "Terms & Conditions", to: "/" },
            { label: "Intellectual Property", to: "/" },
            { label: "Cookie Policy", to: "/" },
            { label: "Environmental Responsibility", to: "/" },
        ]
    }
]

function ColumnTitle(props: { title: string }) {
    return <Typography variant="h4">{props.title}</Typography>
}

function Footer() {
    return (
        // Grid's use a 12-column flexbox layout system
        <Grid
            container
            columnSpacing={2}
            direction="row"
        >
            { columns.map((column) => (
                <Grid size={3}>
                    <ColumnTitle title={column.title}></ColumnTitle>
                    { column.links.map((link) => ((
                        <Typography>{link.label}</Typography>
                    ))) }
                </Grid>
            )) }
            <Grid>
                <ColumnTitle title="Newsletter"></ColumnTitle>
            </Grid>
        </Grid>
    )
}

export default Footer;