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
} from "lucide-react";
import { TbMatrix, TbBulb } from "react-icons/tb";
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


export const adminMenuData: MenuData = {
    linkData: [
        {
            menu: [
                {
                    label: "Dashboard",
                    href: "/dashboard/orbit-export",
                    icon: LayoutDashboard,
                },
                {
                    label: "My Products",
                    href: "/dashboard/orbit-export/my-products",
                    icon: MdDashboardCustomize,
                },
                {
                    label: "Inventory",
                    href: "/dashboard/orbit-export/inventory",
                    icon: TbCategory,
                },
                {
                    label: "Export Journey",
                    href: "/dashboard/orbit-export/export-journey",
                    icon: Ticket,
                },

                {
                    label: "Sales",
                    href: "/dashboard/orbit-export/sales",
                    icon: Users,
                },
                {
                    label: "Message",
                    href: "/dashboard/message",
                    icon: ShieldCheck,
                },
                {
                    label: "Notifications",
                    href: "/dashboard/notifications",
                    icon: Bell,
                },
                {
                    label: "Contract &Compliance",
                    href: "/dashboard/orbit-export/contract-compliance",
                    icon: MessageSquareWarning,
                },
                {
                    label: "My Account",
                    href: "/dashboard/orbit-export/my-account",
                    icon: UserRound,
                },
            ],
        },
    ],
};





export const navItems: IMenuItem[] = [
    {
        label: "Features",
        href: "/features",
        icon: CalendarDays,
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
        href: "/blog",
        icon: Bell,
    },
];