import Subscribers from "@/components/dashboard/admin/subscribers";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Subscribers Management | Admin Dashboard",
    description: "Manage subscriber accounts, subscription plans, MRR analytics, member billing, and resource quotas.",
};

export default function SubscribersPage() {
    return (
        <div className="w-full min-h-screen">
            <Subscribers />
        </div>
    );
}
