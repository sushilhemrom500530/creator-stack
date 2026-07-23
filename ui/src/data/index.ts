import {
    LayoutDashboard,
    Ticket,
    CalendarDays,
    Heart,
    CreditCard,
    Bell,
    User,
    Settings,
    UserRound,
    ShieldAlert,
    Info,
    CircleQuestionMark,
    Users,
    ShieldCheck,
    BarChart3,
    ClipboardList,
    MessageSquareWarning,
    LifeBuoy,
    Database,
    Activity,
    Bot,
    Flag,
    FileText,
    BadgeDollarSign,
} from "lucide-react";
import { TbMatrix, TbBulb, TbServer, TbAffiliate, TbWorld } from "react-icons/tb";
import { MdDashboardCustomize } from "react-icons/md";
import { TbCategory, TbReportAnalytics, TbDiscount } from "react-icons/tb";

export interface ISubmenuItem {
    label: string;
    href: string;
    icon?: React.ElementType;
}

export interface IMenuItem {
    label: string;
    href?: string;
    icon?: React.ElementType;
    submenu?: ISubmenuItem[];
}

export interface MenuGroup {
    menu: IMenuItem[];
}

export interface MenuData {
    linkData: MenuGroup[];
}


export const userMenuData: MenuData = {
    linkData: [
        {
            menu: [
                {
                    label: "Dashboard",
                    href: "/user/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    label: "Create Post",
                    href: "/user/create-post",
                    icon: MdDashboardCustomize,
                },
                {
                    label: "Posts",
                    href: "/user/posts",
                    icon: TbCategory,
                },
                {
                    label: "Calendar",
                    href: "/user/calendar",
                    icon: Ticket,
                },

                {
                    label: "Analytics",
                    href: "/user/analytics",
                    icon: Users,
                },
                {
                    label: "Media Library",
                    href: "/user/media-library",
                    icon: ShieldCheck,
                },
                {
                    label: "AI Assistant",
                    href: "/user/ai-assistant",
                    icon: TbBulb,
                },
                {
                    label: "Connected Accounts",
                    href: "/user/connected-accounts",
                    icon: TbBulb,
                },
                {
                    label: "Notifications",
                    href: "/user/notifications",
                    icon: Bell,
                }
            ],
        },
    ],
};


export const adminMenuData: MenuData = {
    linkData: [
        {
            menu: [
                {
                    label: "Dashboard",
                    href: "/admin/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    label: "Users",
                    href: "/admin/users",
                    icon: Users,
                },
                {
                    label: "Workspaces",
                    href: "/admin/workspaces",
                    icon: TbAffiliate,
                },
                {
                    label: "Connected Platforms",
                    href: "/admin/connected-platforms",
                    icon: TbWorld,
                },
                {
                    label: "Posts",
                    href: "/admin/posts",
                    icon: FileText,
                },
                {
                    label: "Analytics",
                    href: "/admin/analytics",
                    icon: BarChart3,
                },
                {
                    label: "AI Management",
                    href: "/admin/ai-management",
                    icon: Bot,
                },
                {
                    label: "Subscriptions",
                    href: "/admin/subscriptions",
                    icon: CreditCard,
                },
                {
                    label: "Transactions",
                    href: "/admin/transactions",
                    icon: BadgeDollarSign,
                },
                {
                    label: "Reports",
                    href: "/admin/reports",
                    icon: Flag,
                },
                {
                    label: "Notifications",
                    href: "/admin/notifications",
                    icon: Bell,
                },
                {
                    label: "System Health",
                    href: "/admin/system-health",
                    icon: Activity,
                },
                {
                    label: "Audit Logs",
                    href: "/admin/audit-logs",
                    icon: Database,
                },
                {
                    label: "Roles & Permissions",
                    href: "/admin/roles-permissions",
                    icon: ShieldCheck,
                },
                {
                    label: "Support",
                    href: "/admin/support",
                    icon: LifeBuoy,
                },
                {
                    label: "Settings",
                    href: "/admin/settings",
                    icon: Settings,
                },
            ],
        },
    ],
};





export const navItems: IMenuItem[] = [
    // {
    //     label: "Features",
    //     href: "/features",
    //     icon: CalendarDays,
    // },
    {
        label: "Home",
        href: "/",
        icon: Ticket,
    },
    {
        label: "Solutions",
        href: "/solutions",
        icon: Ticket,
    },
    {
        label: "Pricing",
        href: "/pricing",
        icon: Heart,
    },
    {
        label: "Resources",
        href: "/resources",
        icon: Bell,
    },
    {
        label: "Blog",
        href: "/blogs",
        icon: Bell,
    },
    // {
    //     label: "About Us",
    //     href: "/about-us",
    //     icon: User,
    // },
];