import { Star } from "lucide-react";

export default function ListingRating({ rating }: { rating: number }) {
    // console.log(rating);
    if (!rating || rating === 0) {
        console.log("rating is 0 or undefined");
        return null;
    }

    // Ensure rating is between 1 and 5
    const normalizedRating = Math.max(1, Math.min(5, rating));
    
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((index) => {
                const decimal = normalizedRating - Math.floor(normalizedRating);
                const isHalfStar = index === Math.ceil(normalizedRating) && decimal >= 0.3 && decimal < 0.8;
                const isFullStar = index <= Math.floor(normalizedRating) || 
                    (index === Math.ceil(normalizedRating) && decimal >= 0.8);
                
                return (
                    <Star
                        key={index}
                        size={16}
                        className={`
                            ${isFullStar ? 'fill-yellow-400 text-yellow-400' : 
                              isHalfStar ? 'fill-[url(#halfStar)] text-yellow-400' : 
                              'fill-gray-200 text-gray-200'}
                        `}
                    >
                        {isHalfStar && (
                            <defs>
                                <linearGradient id="halfStar" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="50%" stopColor="#facc15" />
                                    <stop offset="50%" stopColor="#e5e7eb" />
                                </linearGradient>
                            </defs>
                        )}
                    </Star>
                );
            })}
            <span className="ml-1 text-sm text-gray-600">
                {normalizedRating.toFixed(1)}
            </span>
        </div>
    );
}