import ContactForm from "@/components/ContactForm";
import { generatePageMetadata } from "@/utils/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact',
  description: `Make connections with sadiqul islam shakib. Let's talk!`,
  path: '/contact',
})

const ContactPage = () => {
  return (
    <ContactForm />
  )
}

export default ContactPage