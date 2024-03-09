import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Banknote, CalendarDays, GraduationCap} from "lucide-react";
import {formatCurrency} from "@/utils/formatters.ts";
import {JobListingValues} from "@/features/job-listings/constants/type.ts";
import {MarkdownRenderer} from "@/components/ui/MarkdownRenderer.tsx";
import {Button} from "@/components/ui/button.tsx";

type FullJobListingDialogProps = Pick<JobListingValues, "title" | "title" | "companyName" | "location" | "salary" | "type" | "experienceLevel" | "description">;

export  const FullJobListingDialog = ({
    title ,
    companyName,
    location,
    salary,
    type,
    experienceLevel,
    description
                                      } :
FullJobListingDialogProps
) => {
    return (
        <Dialog >
            <DialogTrigger>
                <Button type='button'>View More</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100vh-2rem)] flex flex-col max-w-3xl w-[calc(100vw-2rem)]">
                <DialogHeader>
                    <div className='flex gap-4 justify-between'>
                        <div>
                            <DialogTitle>{title}</DialogTitle>
                            <div className='flex flex-col'>
                                <span>{companyName}</span>
                                <span>{location}</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-items-start gap-1'>
                        {/* badges here*/}
                        <Badge variant="secondary" className="flex gap-1 whitespace-nowrap">
                            <Banknote className="w-4 h-4"/> {formatCurrency(salary)}
                        </Badge>
                        <Badge variant="secondary" className="flex gap-1 whitespace-nowrap">
                            <CalendarDays className="w-4 h-4"/> {type}
                        </Badge>
                        <Badge variant="secondary" className="flex gap-1 whitespace-nowrap">
                            <GraduationCap className="w-4 h-4"/> {experienceLevel}
                        </Badge>
                    </div>
                </DialogHeader>
                <MarkdownRenderer>
                    {description}
                </MarkdownRenderer>
            </DialogContent>
        </Dialog>
    );
};
