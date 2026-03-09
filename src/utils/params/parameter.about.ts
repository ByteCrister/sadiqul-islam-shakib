import { Award, BookOpen, Briefcase, Calendar, Code, GraduationCap, Star } from "lucide-react";
import { FaBolt, FaCube, FaDatabase, FaJava } from "react-icons/fa";
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
    SiC,
    SiPython,
    SiPostman,
} from "react-icons/si";

export const skills = [
    { name: 'HTML', Icon: SiHtml5, category: 'Frontend' },
    { name: 'CSS', Icon: SiCss3, category: 'Frontend' },
    { name: 'JavaScript', Icon: SiJavascript, category: 'Frontend' },
    { name: 'React', Icon: SiReact, category: 'Frontend' },
    { name: 'Next.js', Icon: SiNextdotjs, category: 'Frontend' },
    { name: 'Tailwind CSS', Icon: SiTailwindcss, category: 'Frontend' },
    { name: 'shadcn/ui', Icon: FaCube, category: 'Frontend' },

    { name: 'EJS', Icon: SiEjs, category: 'Backend' },
    { name: 'Axios', Icon: SiAxios, category: 'Backend' },

    { name: 'MongoDB', Icon: SiMongodb, category: 'Database' },
    { name: 'Mongoose', Icon: FaDatabase, category: 'Database' },
    { name: 'SQL', Icon: SiMysql, category: 'Database' },

    { name: 'C', Icon: SiC, category: 'Programming' },
    { name: 'Java', Icon: FaJava, category: 'Programming' },
    { name: 'Python', Icon: SiPython, category: 'Programming' },
    { name: 'TypeScript', Icon: SiTypescript, category: 'Programming' },

    { name: 'Postman', Icon: SiPostman, category: 'Tools' },
    { name: 'Thunder Client', Icon: FaBolt, category: 'Tools' }
];

export const experiences = [
    {
        role: "Courses & Certifications",
        org: "Self-Learning & Online Platforms",
        period: "Ongoing",
        description:
            "Actively pursuing online courses and certifications to strengthen expertise in software development, web technologies, and computer science fundamentals.",
        points: [
            "Completed courses on Data Structures & Algorithms (DSA) with JavaScript/TypeScript",
            "Built projects while learning Full-Stack Web Development with Next.js, React, Node.js, and MongoDB",
            "Explored courses on Database Systems, focusing on relational & NoSQL models",
            "Currently learning about AI & Machine Learning fundamentals for practical integration in web apps",
            "Practicing problem-solving on platforms like LeetCode & HackerRank alongside coursework",
        ],
        icon: Briefcase,
    },
    {
        role: "Academic & Personal Projects",
        org: "North East University Bangladesh (Self-Initiated)",
        period: "2022 – Present",
        description:
            "Ongoing development of full-stack and AI-driven projects using JavaScript, TypeScript, Next.js, database and AI concepts.",
        points: [
            "Developed interactive AI-based games demonstrating fundamental algorithms using TypeScript (AI-Games-CSE-412) – explorative in decision-making techniques",
            "Built a full-stack e-commerce style site (Gadget-IT.com) using JavaScript – end-to-end project showcasing UI, backend, and integration",
            "Created an inventory management system (NEUB Database Project) using EJS and JavaScript – university database project demonstrating CRUD operations",
            "Designed a Todo-style application using Next.js and TypeScript (Note Task) – practicing reactive UI, state management, and TypeScript typing",
            "Built a classic Pong game in JavaScript – understand game mechanics, rendering, and user interaction"
        ],
        icon: Code
    },
    {
        role: "BSc in Computer Science",
        org: "North East University Bangladesh",
        period: "2022 – Present",
        description:
            "Currently pursuing undergraduate studies in Computer Science with a strong interest in software development and problem-solving.",
        points: [
            "Actively participate in university coding festivals and inter-university hackathons",
            "Member of the Coding Club, collaborating on projects and peer learning",
            "Focused on improving skills in web technologies, algorithms, and competitive programming",
        ],
        icon: GraduationCap,
    },
    {
        role: "Higher Secondary School Certificate",
        period: "2019 – 2021",
        org: "Universal College Sylhet",
        description: "Complete higher secondary education with valuable lessons beyond academics.",
        points: [
            "Actively participated in sports and cultural programs",
            "Learned teamwork and collaboration through group activities",
            "Built resilience by overcoming academic challenges",
        ],
        icon: BookOpen,
    }
];

export const counterData = [
    { label: "Years of Learning", value: 3, Icon: Calendar },
    { label: "Academic & Personal Projects", value: 10, Icon: Award },
    { label: "Technologies Explored", value: 15, Icon: Star },
];