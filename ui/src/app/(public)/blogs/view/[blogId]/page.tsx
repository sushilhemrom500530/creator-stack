import BlogDetails from "@/components/blog/details";

export default async function BlogViewPage({ params }: { params: Promise<{ blogId: string }> | { blogId: string } }) {
    const resolvedParams = await params;
    return (
        <main>
            <BlogDetails blogId={resolvedParams.blogId} />
        </main>
    );
}