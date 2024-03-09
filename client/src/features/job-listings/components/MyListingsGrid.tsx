import ListingsGrid from "@/features/job-listings/components/listingsGrid.tsx";
import ListingCard from "@/features/job-listings/components/listingCard.tsx";
import {JobListingValues} from "@/features/job-listings/constants/type.ts";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {deleteJobListing} from "@/features/job-listings";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast.ts";
import {ToastAction} from "@/components/ui/toast.tsx";
import {LoadingSpinner} from "@/components/ui/LoadingSpinner.tsx";
export const MyListingsGrid = ({listings} : {listings: JobListingValues[] }) => {
    const [visbleListings , setVisibleListings] = useState(listings)
    const [deletingListings, setDeletingListings] = useState<string[]>([])

    const deleteListing = (id: string) => {
        // Show a "Deleting..." notification
        const deletingToast = toast({
            title: 'Deleting...',
            description: <div><LoadingSpinner /></div>
        });

        deleteJobListing(id).then(() => {
            setDeletingListings((prev) => [...prev, id])

            setTimeout(() => {
                setVisibleListings((prev) => prev.filter((listing) => listing.id !== id))
                setDeletingListings((prev) => prev.filter((listingId) => listingId !== id))

                // Update the "Deleting..." notification to "Successfully deleted"
                deletingToast.update({
                    title: 'Successfully deleted',
                    description: null,
                });
            }, 300) // adjust this to match the duration of your CSS transition

        }).catch((e) => {
            console.error(e)

            // Update the "Deleting..." notification to "Failed to delete"
            deletingToast.update({
                title: 'Failed to delete job listing',
                action : <ToastAction altText="retry to delete" onClick={() => {
                    deleteListing(id)
                }}>
                    Retry
                </ToastAction>
            })
        })
    }

    return (
        <ListingsGrid
        >
            {visbleListings.map(listing => (
                <ListingCard className={deletingListings.includes(listing.id) ? 'fadeOut' : ''}  key={listing.title} listing={listing} footerBtns={
                    <>
                        <DeleteJobListingDialog deleteListing={() => deleteListing(listing.id)} />
                        <Button type="button" variant='outline' asChild>
                            <Link to={`${listing.id}/edit`}>Edit</Link>
                        </Button>
                        <Button type="submit">
                            Extend
                        </Button></>
                }
                />
            ))}
        </ListingsGrid>
    );
};

type DeleteJobListingDialogProps = {
    deleteListing: () => void

}


function DeleteJobListingDialog({
                                    deleteListing,
                                }: DeleteJobListingDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this job listing?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your job
                        listing and any remaining time will not be refunded.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteListing}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}