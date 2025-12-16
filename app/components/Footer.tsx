import { Box, Button, Container, Grid, Input, Link, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import { off } from "process";
import AnimatedButton from "./AnimatedButton";

const offWhite = "#fdfdfe"

type FooterColumnProps = {
    title: string;
    links: { label: string, to: string }[];
}

// Shared between FooterColumn and Newsletter
function ColumnTitle(props: { title: string }) {
    return <Typography color="#8e929f" fontSize="16px" fontWeight={600}>{props.title.toUpperCase()}</Typography>
}

function FooterColumn({ title, links }: FooterColumnProps) {
    return (
        <>
            <ColumnTitle title={title} />
            <List sx={{ py: 0.25}} >
            { links.map((link) => (
                <ListItem
                    sx={{
                        px: 0,
                        py: 0.5
                    }}
                >
                    <Link
                        href={link.to}
                        key={link.label}
                        sx={{
                            color: offWhite,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: "pointer",
                            textDecoration: "none",
                            "&:hover": {
                                textDecoration: "underline"
                            }
                        }}
                    >
                        {link.label}
                    </Link>
                </ListItem>
            )) }
            </List>
        </>
    )
}

function NewsletterSignUp() {
    return (
        <>
            <ColumnTitle title="Newsletter" />
            <Typography fontSize="small" color={offWhite}>Email*</Typography>
            <TextField size="small" sx={{ bgcolor: "white", borderRadius: 2 }} />
            <Typography fontSize="0.75rem" color={offWhite} marginTop={1}>We may occasionally contact you about news and promotions from Shaper. You can unsubscribe from these emails at any time by clicking the link at the bottom of these emails.</Typography>
            <AnimatedButton text="Submit" />
        </>
    )
}

//#region: Data
const columns: FooterColumnProps[] = [
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
//#endregion

function Footer() {
    return (
        // Grids use a 12-column flexbox layout system
        <Box sx={{ bgcolor: "#2A2B2D", py: 3 }}>
            <Container maxWidth="lg">
                <Grid
                    container
                    columnSpacing={2}
                    direction="row"
                >
                    { columns.map((column) => (
                        <Grid key={column.title} size={{ xs: 4, md: 3}}>
                            <FooterColumn title={column.title} links={column.links} />
                        </Grid>
                    ))}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <NewsletterSignUp />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default Footer;