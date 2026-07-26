import DashboardLayout from "@/layout/dashboard";
import AntdThemeProvider from "@/providers/antd-theme";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <AntdThemeProvider>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </AntdThemeProvider>
    );
}