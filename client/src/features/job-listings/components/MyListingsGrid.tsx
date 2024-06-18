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
import {createPublishPaymentIntent, deleteJobListing} from "@/features/job-listings";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast.ts";
import {ToastAction} from "@/components/ui/toast.tsx";
import {LoadingSpinner} from "@/components/ui/LoadingSpinner.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {JOB_LISTING_DURATIONS} from "@backend/constants/types.ts";
import {formatCurrency} from "@/utils/formatters.ts";
import {getJobListingPriceInCents} from "@backend/utils/getJobListingPriceInCents.ts";
import {Dialog, DialogContent, DialogDescription, DialogTitle} from "@/components/ui/dialog.tsx";
import {Elements, PaymentElement} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

export const MyListingsGrid = ({listings}: { listings: JobListingValues[] }) => {
    const [visbleListings, setVisibleListings] = useState(listings)
    const [deletingListings, setDeletingListings] = useState<string[]>([])
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
    const deleteListing = (id: string) => {
        // Show a "Deleting..." notification
        const deletingToast = toast({
            title: 'Deleting...',
            description: <div><LoadingSpinner/></div>
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
                action: <ToastAction altText="retry to delete" onClick={() => {
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
                <ListingCard className={deletingListings.includes(listing.id) ? 'fadeOut' : ''} key={listing.title}
                             listing={listing} footerBtns={
                    <>
                        <DeleteJobListingDialog deleteListing={() => deleteListing(listing.id)}/>
                        <Button type="button" variant='outline' asChild>
                            <Link to={`${listing.id}/edit`}>Edit</Link>
                        </Button>
                        <ExtendListing listingId={listing.id} selectedDuration={selectedDuration}
                                       setSelectedDuration={setSelectedDuration}/>
                    </>
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

function ExtendListing({setSelectedDuration, selectedDuration, listingId}) {
    const stripePromise = loadStripe('pk_test_51OsnGO16zZkKnil69VCOvHrBnxKc4jk0Kkryp67HqfQH37prQ7Q3uhyMufI0joMbKXlUTNAvmMC7IJgRbsUynBAU00f2ViKwmE');
    const [clientSecret, setClientSecret] = useState<string | undefined>(null)
    return (
        <>
            <Dialog open={!!selectedDuration} onOpenChange={
                (open) => {
                    if (!open) {
                        setSelectedDuration(null)
                    }
                }
            }>
                <DialogContent className="max-h-[calc(100vh-2rem)] flex flex-col max-w-3xl w-[calc(100vw-2rem)]">
                    <DialogTitle>
                        {/*{getPurchaseButtonText(status)} {jobListing.title} for{" "}*/}
                        {selectedDuration} days
                    </DialogTitle>
                    <DialogDescription>
                        This is a non-refundable purchase
                    </DialogDescription>
                    <Elements stripe={stripePromise}
                              options={{
                                  clientSecret: clientSecret
                              }}
                    >

                        <form>
                            {/*{errorMessage != null && (*/}
                            <p className="text-red-500 dark:text-red-900 text-sm mb-4">
                                {/*{errorMessage}*/}
                            </p>
                            {/*)}*/}
                            <PaymentElement/>
                            <Button
                                // disabled={isLoading || stripe == null || elements == null}
                                className="mt-4 w-full"
                            >
                                Pay
                            </Button>
                        </form>
                    </Elements>
                </DialogContent>
            </Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>
                        Extend
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {JOB_LISTING_DURATIONS.map((item) => <DropdownMenuItem
                        className={``} key={item}
                        onClick={async () => {
                            const {clientSecret} = await createPublishPaymentIntent(listingId, item)
                            setClientSecret(clientSecret)
                            setSelectedDuration(item)
                        }}
                    >
                        {item} Days -{" "}
                        {formatCurrency(getJobListingPriceInCents(item) / 100)}
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
