import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { AudioWaveform, BookOpen, Bot, Command, Folder, Frame, GalleryVerticalEnd, LayoutGrid, LifeBuoy, PieChart, Send, Settings2, SquareTerminal, Map, Notebook, Layers, Server } from 'lucide-react';
import AppLogo from './app-logo';
import dash from '@/routes/dash';
import { NavProjects } from './nav-project';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dash.index(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];


const data = {
    navMain: [
        {
            title: "Server",
            url: dash.server.lists().url,
            icon: Server,
            isActive: false,
            items: [
                {
                    title: "List",
                    url: dash.server.lists().url,
                },
            ],
        },
        {
            title: "Creating",
            url: dash.create.sms().url,
            icon: Notebook,
            isActive: false,
            items: [
                {
                    title: "SMS",
                    url: dash.create.sms().url,
                },
                {
                    title: "OTP",
                    url:  dash.create.otp().url,
                },
            ],
        },
        {
            title: "Sending",
            url: dash.sending.sms().url,
            icon: Send,
            isActive: false,
            items: [
                {
                    title: "SMS",
                    url: dash.sending.sms().url,
                },
                {
                    title: "OTP",
                    url:  dash.sending.otp().url,
                },
            ],
        },
        {
            title: "Jobs",
            url: dash.jobs.sms().url,
            icon: Bot,
            isActive: false,
            items: [
                {
                    title: "SMS",
                    url: dash.jobs.sms().url,
                },
                {
                    title: "OTP",
                    url:  dash.jobs.otp().url,
                },
            ],
        },
        {
            title: "Reports",
            url: dash.report.sms().url,
            icon: Layers,
            isActive: false,
            items: [
                {
                    title: "SMS",
                    url: dash.report.sms().url,
                },
                {
                    title: "OTP",
                    url:  dash.report.otp().url,
                },
            ],
        },
    ],
}


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dash.index()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
