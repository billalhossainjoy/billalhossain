import { getContact, getHero } from "@/lib/content";
import HeaderClient from "./header-client";

function initials(name: string): string {
    return name.split(" ").map((w) => w[0] ?? "").join("").toUpperCase();
}

export default function Header() {
    const hero    = getHero();
    const contact = getContact();
    return (
        <HeaderClient
            name={hero.name}
            initials={initials(hero.name)}
            email={contact.email}
        />
    );
}
