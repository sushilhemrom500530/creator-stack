"use client";

import React from "react";
import { ConfigProvider, App, ThemeConfig } from "antd";

// Centralized Ant Design Theme Configuration
export const antdThemeConfig: ThemeConfig = {
    token: {
        // Core Palette Tokens
        colorPrimary: "#7C3AED", // Primary Purple (#7C3AED)
        colorInfo: "#7C3AED",
        colorSuccess: "#10B981", // Success Green
        colorWarning: "#F59E0B", // Warning Amber
        colorError: "#EF4444",   // Error Red
        colorLink: "inherit",    // Prevents AntD from turning all <a> links purple

        // Typography & Geometry
        fontFamily: "'DM Sans', var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 14,
        borderRadius: 12,        // Modern rounded corners
        borderRadiusLG: 16,
        borderRadiusSM: 8,
        borderRadiusXS: 6,
        controlHeight: 40,       // Default 40px height for buttons and form fields (h-10)

        // Default Background & Text Colors
        colorBgContainer: "#ffffff",
        colorBgElevated: "#ffffff",
        colorBgLayout: "#F4F5F8",
        colorText: "#09090B",
        colorTextSecondary: "#64748B",
        colorTextTertiary: "#94A3B8",
        colorBorder: "#E2E8F0",
        colorBorderSecondary: "#F1F5F9",
    },
    components: {
        // Button Customization
        Button: {
            colorPrimary: "#7C3AED",
            colorPrimaryHover: "#6D28D9",
            colorPrimaryActive: "#5B21B6",
            colorTextSecondary: "#14B8A6",
            controlHeight: 40,
            controlHeightSM: 32,
            controlHeightLG: 46,
            borderRadius: 12,
            borderRadiusSM: 8,
            borderRadiusLG: 14,
            fontWeight: 600,
            paddingInline: 18,
            primaryShadow: "0 4px 14px 0 rgba(124, 58, 237, 0.25)",
        },

        // Input & Form Field Customization
        Input: {
            controlHeight: 40,
            controlHeightSM: 32,
            controlHeightLG: 46,
            borderRadius: 12,
            activeBorderColor: "#7C3AED",
            hoverBorderColor: "#8B5CF6",
            colorBorder: "#E2E8F0",
            colorBgContainer: "#FFFFFF",
            colorTextPlaceholder: "#94A3B8",
            activeShadow: "0 0 0 3px rgba(124, 58, 237, 0.12)",
        },
        InputNumber: {
            controlHeight: 40,
            borderRadius: 12,
            activeBorderColor: "#7C3AED",
            hoverBorderColor: "#8B5CF6",
            colorBorder: "#E2E8F0",
            activeShadow: "0 0 0 3px rgba(124, 58, 237, 0.12)",
        },
        Select: {
            controlHeight: 40,
            controlHeightSM: 32,
            controlHeightLG: 46,
            borderRadius: 12,
            colorBorder: "#E2E8F0",
            colorPrimary: "#7C3AED",
            colorPrimaryHover: "#8B5CF6",
            optionSelectedBg: "#FAF5FF",
            optionSelectedColor: "#7C3AED",
            optionActiveBg: "#F8FAFC",
        },
        DatePicker: {
            controlHeight: 40,
            borderRadius: 12,
            colorPrimary: "#7C3AED",
            colorBorder: "#E2E8F0",
            activeBorderColor: "#7C3AED",
        },
        Cascader: {
            controlHeight: 40,
            borderRadius: 12,
            colorPrimary: "#7C3AED",
        },
        TreeSelect: {
            controlHeight: 40,
            borderRadius: 12,
            colorPrimary: "#7C3AED",
        },

        // Form Labels & Layout
        Form: {
            labelFontSize: 13,
            labelColor: "#1E293B",
            labelRequiredMarkColor: "#EF4444",
            itemMarginBottom: 18,
        },

        // Switch, Checkbox & Radio
        Switch: {
            colorPrimary: "#7C3AED",
            colorPrimaryHover: "#6D28D9",
        },
        Checkbox: {
            colorPrimary: "#7C3AED",
            colorPrimaryHover: "#6D28D9",
            borderRadiusSM: 6,
        },
        Radio: {
            colorPrimary: "#7C3AED",
            colorPrimaryHover: "#6D28D9",
        },

        // Data Display & Navigation
        Table: {
            headerBg: "#F8FAFC",
            headerColor: "#475569",
            headerSplitColor: "transparent",
            rowHoverBg: "#FAF5FF",
            borderColor: "#F1F5F9",
            borderRadius: 16,
        },
        Tabs: {
            colorPrimary: "#7C3AED",
            colorPrimaryHover: "#6D28D9",
            itemSelectedColor: "#7C3AED",
            itemHoverColor: "#6D28D9",
            cardBg: "#F8FAFC",
        },
        Pagination: {
            colorPrimary: "#7C3AED",
            borderRadius: 10,
        },
        Badge: {
            colorPrimary: "#7C3AED",
        },
        Tag: {
            borderRadiusSM: 8,
        },

        // Overlays & Containers
        Modal: {
            borderRadiusLG: 20,
            contentBg: "#FFFFFF",
            headerBg: "transparent",
        },
        Drawer: {
            borderRadiusLG: 20,
            colorBgContainer: "#FFFFFF",
        },
        Dropdown: {
            borderRadiusLG: 12,
            controlItemBgHover: "#FAF5FF",
        },
        Card: {
            borderRadiusLG: 20,
            colorBorderSecondary: "#F1F5F9",
        },
        Tooltip: {
            colorBgSpotlight: "#09090B",
            borderRadius: 8,
        },
    },
};

export interface AntdThemeProviderProps {
    children: React.ReactNode;
}

export default function AntdThemeProvider({ children }: AntdThemeProviderProps) {
    return (
        <ConfigProvider theme={antdThemeConfig}>
            <App>{children}</App>
        </ConfigProvider>
    );
}
