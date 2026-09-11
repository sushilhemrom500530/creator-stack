import ResourceDetails from "@/components/resource/view";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resource Guide Details | Creator Stack",
    description: "Comprehensive step-by-step guide and workflow blueprint for Creator Stack omni-channel publishing and AI scheduling.",
};

export default async function ResourceViewPage({
    params,
}: {
    params: Promise<{ id: string }> | { id: string };
}) {
    const resolvedParams = await params;
    return (
        <main>
            <ResourceDetails resourceId={resolvedParams.id} />
        </main>
    );
}
