import { Dispatch, SetStateAction } from "react";

export interface ISubmenuItem {
    label: string;
    href: string;
    icon?: React.ElementType;
}

export interface INavItemProps {
    href: string;
    icon?: React.ElementType;
    label: string;
    submenu?: ISubmenuItem[];
    openSubmenu: string | null;
    handleSubmenuToggle: (label: string) => void;
    closeAllSubmenus: () => void;
    setNavOpened: Dispatch<SetStateAction<boolean>>;
}