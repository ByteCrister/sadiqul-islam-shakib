//G:\Projects\sadiqul-islam-shakib\src\utils\parameter.about.ts
import { Award, BookOpen, Briefcase, Calendar, Code, GraduationCap, Star } from "lucide-react";
import { FaCube, FaDatabase } from "react-icons/fa";
import {
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiTailwindcss,
    SiMongodb,
    SiHtml5,
    SiCss3,
    SiJavascript,
    SiEjs,
    SiAxios,
    SiMysql,
} from "react-icons/si";

export const skills = [
    { name: 'HTML', Icon: SiHtml5 },
    { name: 'CSS', Icon: SiCss3 },
    { name: 'JavaScript', Icon: SiJavascript },
    { name: 'EJS', Icon: SiEjs },
    { name: 'Axios', Icon: SiAxios },
    { name: 'SQL', Icon: SiMysql },
    { name: 'React', Icon: SiReact },
    { name: 'Next.js', Icon: SiNextdotjs },
    { name: 'TypeScript', Icon: SiTypescript },
    { name: 'MongoDB', Icon: SiMongodb },
    { name: 'Mongoose', Icon: FaDatabase },
    { name: 'Tailwind CSS', Icon: SiTailwindcss },
    { name: 'shadcn/ui', Icon: FaCube }
]

export const experiences = [
    {
        role: "Senior Frontend Engineer",
        org: "Awesome Co",
        period: "2022 – Present",
        description:
            "Leading UI architecture for scalable React/Next.js applications.",
        points: [
            "Designed modular component library with shadcn/ui",
            "Optimized bundle size by 25%+ using dynamic imports",
            "Mentored 4 junior engineers in Next.js best practices",
        ],
        icon: Briefcase,
    },
    {
        role: "Software Engineer Intern",
        org: "Tech Startup",
        period: "Summer 2021",
        description: "Built interactive dashboards and real-time features.",
        points: [
            "Implemented live chat using Socket.IO",
            "Ensured WCAG 2.1 AA accessibility",
            "Integrated Auth0 for seamless authentication",
        ],
        icon: Code,
    },
    {
        role: "BSc in Computer Science",
        org: "State University",
        period: "2018 – 2022",
        description:
            "Graduated with honors; specialized in web technologies & algorithms.",
        points: [
            "Maintained 4.0 GPA; Dean’s List 2020–2022",
            "President of the Coding Club; organized hackathons",
            "Published paper on graph-based algorithms",
        ],
        icon: GraduationCap,
    },
    {
        role: "High School Diploma",
        org: "Brighton High School",
        period: "2016 – 2018",
        description: "STEM program graduate, top 5% of class.",
        points: [
            "Led robotics team to regional finals",
            "Captain of math olympiad squad",
        ],
        icon: BookOpen,
    },
];

export const counterData = [
    { label: "Years Experience", value: 3, Icon: Calendar },
    { label: "Projects Delivered", value: 12, Icon: Award },
    { label: "Open-Source Stars", value: 1500, Icon: Star },
];