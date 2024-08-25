import {ListingsGrid,ListingCard,createPublishPaymentIntent, deleteJobListing} from "@/features/job-listings";
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
import {FormEvent, useState} from "react";
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
import {Elements, PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {formatDistanceStrict, isAfter} from "date-fns";
import { Badge } from "@/components/ui/badge";

export const MyListingsGrid = ({listings}: { listings: JobListingValues[] }) => {
    const [visbleListings, setVisibleListings] = useState(listings)
    const [deletingListings, setDeletingListings] = useState<string[]>([])
    const [selectedDuration, setSelectedDuration] = useState< (typeof JOB_LISTING_DURATIONS)[number]>()
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
                            <Link to={`/jobs/${listing.id}/edit`}>Edit</Link>
                        </Button>
                        <ExtendListing listing={listing} selectedDuration={selectedDuration}
                                       setSelectedDuration={setSelectedDuration}/>
                    </>
                }
                    header={
                        <Badge className={`flex gap-1 whitespace-nowrap rounded-[4px] `} variant={getHeaderBadgeVariant(getJobListingStatus(listing.expiresAt))}>
                            {getJobListingStatus(listing.expiresAt)}
                    </Badge>
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

function ExtendListing({ setSelectedDuration, selectedDuration, listing }: {
    setSelectedDuration: (duration:  (typeof JOB_LISTING_DURATIONS)[number] | undefined ) => void
    selectedDuration:  (typeof JOB_LISTING_DURATIONS)[number] | undefined
    listing: JobListingValues
}) {
    const stripePromise = loadStripe('pk_test_51OsnGO16zZkKnil69VCOvHrBnxKc4jk0Kkryp67HqfQH37prQ7Q3uhyMufI0joMbKXlUTNAvmMC7IJgRbsUynBAU00f2ViKwmE');
    const [clientSecret, setClientSecret] = useState<string | undefined>(undefined)
    return (
        <>
            <Dialog open={!!selectedDuration} onOpenChange={
                (open) => {
                    if (!open) {
                        setSelectedDuration(undefined)
                        setClientSecret(undefined)
                    }
                }
            }>
                <DialogContent className="max-h-[calc(100vh-2rem)] flex flex-col max-w-3xl w-[calc(100vw-2rem)]">
                    <DialogTitle>
                        {/*{getPurchaseButtonText(status)} {jobListing.title} for{" "}*/}
                        {getButtonText(getJobListingStatus(listing.expiresAt))} {listing.title} for {selectedDuration} days
                    </DialogTitle>
                    <DialogDescription>
                        This is a non-refundable purchase
                    </DialogDescription>
                    {selectedDuration && <Elements stripe={stripePromise}
                        
                              options={{
                                  clientSecret: clientSecret,
                                  appearance: {theme: "night"}
                              }}
                    >
                        <CheckOutForm amount={getJobListingPriceInCents(selectedDuration) / 100}/>
                    </Elements>}
                </DialogContent>
            </Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>
                        {getButtonText(getJobListingStatus(listing.expiresAt))}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {JOB_LISTING_DURATIONS.map((item) => <DropdownMenuItem
                        className={``} key={item}
                        onClick={async () => {
                            const {clientSecret} = await createPublishPaymentIntent(listing.id, item)
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


function getJobListingStatus(expiresAt: Date | null) {
    if (expiresAt === null) {
        return "Draft"
    } else if (isAfter(expiresAt, new Date())) {
        return`Active - ${formatDistanceStrict(expiresAt, new Date() , {unit: 'day'})}`
    } else {
        return `Expired`
    } 
}

function getButtonText(status: ReturnType<typeof getJobListingStatus>) {
    if (status === "Draft") {
        return "Publish"
    } else if (status === "Expired") {
        return "Republish"
    } else {
        return "Extend"
    }
}


const getHeaderBadgeVariant = (status: string) => {
    if (status === "Draft") {
        return "secondary"
    } else if (status === "Expired") {
        return "destructive"
    } else {
        return "default"
    }
} 

const CheckOutForm = ({ amount }: { amount: number }) => {
    
    const stripe = useStripe();
    const elements = useElements();
    const [loading , setLoading] = useState(false)

    const handleSubmit = async (event: FormEvent) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
    
        if (!stripe || !elements) {
          // Stripe.js hasn't yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.
          return;
        }

        setLoading(true)
    
        const result = await stripe.confirmPayment({
          //`Elements` instance that was used to create the Payment Element
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/jobs/order-complete`,
          },
        });
    
        if (result.error) {
          // Show error to your customer (for example, payment details incomplete)
          console.log(result.error.message);
        } else {
          // Your customer will be redirected to your `return_url`. For some payment
          // methods like iDEAL, your customer will be redirected to an intermediate
          // site first to authorize the payment, then redirected to the `return_url`.
        }
         setLoading(false)
      };
    return (
        <form onSubmit={handleSubmit}>
                            {/*{errorMessage != null && (*/}
                            <p className="text-red-500 dark:text-red-900 text-sm mb-4">
                                {/*{errorMessage}*/}
                            </p>
                            {/*)}*/}
                            <PaymentElement/>
                            <Button
                                disabled={loading || stripe == null || elements == null}
                                className="mt-4 w-full"
                            >
                                Pay {formatCurrency(amount)}
                            </Button>
                        </form>
    )
}