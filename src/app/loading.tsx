export default function Loading() {
    return (
        <main className="min-h-[70vh] pt-24 pb-16 px-4 max-w-6xl mx-auto w-full animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col items-center justify-center space-y-4 mb-16">
                <div className="h-10 w-48 md:w-64 bg-surface rounded-lg"></div>
                <div className="h-4 w-64 md:w-96 bg-surface rounded-lg"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="glass rounded-2xl h-64 p-5 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="h-32 w-full bg-surface/50 rounded-xl"></div>
                            <div className="h-5 w-3/4 bg-surface rounded-md"></div>
                            <div className="h-4 w-1/2 bg-surface rounded-md"></div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
