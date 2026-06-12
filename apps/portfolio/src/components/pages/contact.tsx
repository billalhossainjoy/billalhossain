import { getContact } from "@/lib/content";
import ContactClient from "./contact-client";

export default function Contact() {
    const data = getContact();
    return <ContactClient data={data} />;
}
