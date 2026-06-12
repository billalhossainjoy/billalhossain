import { getFooter, getHero } from "@/lib/content";
import FooterClient from "./footer-client";

export default function Footer() {
    const { name } = getHero();
    const footer   = getFooter();
    return <FooterClient name={name} footer={footer} />;
}
