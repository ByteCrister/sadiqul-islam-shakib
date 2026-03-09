import { Linkedin, Facebook, Github, Instagram, Mail } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type ContactParams = {
    name: string;
    link: string;
    icon: LucideIcon; // icon field using Lucide
}

// Array of contacts with corresponding icons
export const contactParams: ContactParams[] = [
    {
        name: "LinkedIn",
        link: "https://www.linkedin.com/in/sadiqul-islam-shakib/",
        icon: Linkedin
    },
    {
        name: "Facebook",
        link: "https://www.facebook.com/sadiqulislam.shakib.33",
        icon: Facebook
    },
    {
        name: "GitHub",
        link: "https://github.com/ByteCrister",
        icon: Github
    },
    {
        name: "Instagram",
        link: "https://www.instagram.com/_sadiqul_islam_shakib_",
        icon: Instagram
    },
    {
        name: "Email",
        link: "sadiqul.islam.shakib21@gmail.com",
        icon: Mail
    }
];