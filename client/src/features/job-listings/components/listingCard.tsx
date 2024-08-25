import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {JobListingValues} from "@/features/job-listings/constants/type.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {Banknote, CalendarDays, GraduationCap} from "lucide-react";
import {formatCurrency} from "@/utils/formatters.ts";

type ListingCardProps = {
    listing: Pick<JobListingValues, "title" | "companyName" | "location" | "salary" | "type" | "experienceLevel" | "shortDescription" >
    header?: React.ReactNode
    footerBtns?: React.ReactNode
    className?: string
}


export const ListingCard = ({listing , header, footerBtns , className} : ListingCardProps) => {
    return (
        <Card className={className}>
            <style>{`
            .fadeOut {
                animation: fadeOut 0.3s ease-in-out;
            }
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            `}</style>
            <CardHeader>
                <div className='flex gap-4 justify-between'>
                    <div>
                        <CardTitle>{listing.title}</CardTitle>
                        <CardDescription className='flex flex-col'>
                            <span>{listing.companyName}</span>
                            <span>{listing.location}</span>
                        </CardDescription>
                    </div>
                    <div>
                        {/*badge here */}
                        {header}
                    </div>
                </div>
                <div className='flex justify-items-start gap-1'>
                    {/* badges here*/}
                    <Badge variant="secondary" className="flex gap-1 whitespace-nowrap">
                        <Banknote className="w-4 h-4" /> {formatCurrency(listing.salary)}
                    </Badge>
                    <Badge variant="secondary" className="flex gap-1 whitespace-nowrap">
                        <CalendarDays className="w-4 h-4" /> {listing.type}
                    </Badge>
                    <Badge variant="secondary" className="flex gap-1 whitespace-nowrap">
                        <GraduationCap className="w-4 h-4" /> {listing.experienceLevel}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {listing.shortDescription}
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
                {footerBtns}
            </CardFooter>
        </Card>
    );
};
