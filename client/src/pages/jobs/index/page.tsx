import { PageHeader } from "@/components/ui/PageHeader.tsx";
import {
  FullJobListingDialog,
  ListingSkeletonGrid,
  useFilterForm,
ListingsGrid,ListingCard,JobListingFilterForm} from "@/features/job-listings";
import { Suspense } from "react";
import { Await, useDeferredLoaderData } from "@/lib/rounterUtil.tsx";
import { publicListingsLoader } from "./loader";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { EyeOff, Heart } from "lucide-react";
import { cn } from "@/utils/shadcnUtils";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
function PublicListingsPage() {
  const { listings } = useDeferredLoaderData<typeof publicListingsLoader>();
  const [hiddenListings, setHiddenListings] = useLocalStorage<string[]>(
    "hiddenListings",
    []
  );
  const [favoriteListings, setFavoriteListings] = useLocalStorage<string[]>(
    "favoriteListings",
    []
  );

  function listingToggle<T extends string>(funct: (T: (prev: T[]) => T[]) => void, listingId: T, hideToast?: boolean) {
    funct((prev) => {
      if (prev.includes(listingId)) {
        return prev.filter((id) => id !== listingId);
      } else {
        return [...prev, listingId];
      }
    });

    if (hideToast && !hiddenListings.includes(listingId)
     ) {
      toast({
        title: 'Listing Hidden',
        action: <ToastAction altText="retry to delete" onClick={() => {
          funct((prev) => {
            if (prev.includes(listingId)) {
              return prev.filter((id) => id !== listingId);
            } else {
              return [...prev, listingId];
            }
          });
      }}>
          Undo
      </ToastAction>
   });
   }
  }

  const { form, getFilteredListings } = useFilterForm();



  return (
    <>
      <PageHeader>Job Listings</PageHeader>
      <JobListingFilterForm form={form} />
      <Suspense fallback={<ListingSkeletonGrid />}>
        <Await resolve={listings}>
          {(listings) => (
            <ListingsGrid>
              {getFilteredListings(listings, hiddenListings, favoriteListings).map((listing) => {
                const isHidden = hiddenListings.includes(listing.id);
                const isFavorite = favoriteListings.includes(listing.id);
                return (
                  <ListingCard
                    listing={listing}
                    className={cn(isHidden && "opacity-50")}
                    header={
                      <div className="flex items-center -mr-3 -mt-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => {
                            listingToggle(setHiddenListings, listing.id, true);
                          }}
                        >
                          <EyeOff className={cn("h-4 w-4"
                          )} />
                          <span className="sr-only">Hide</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => {
                            listingToggle(setFavoriteListings, listing.id);
                          }}
                        >
                          <Heart className={cn("h-4 w-4", 
                            isFavorite && ' text-red-500 fill-red-500'
                          )} />
                          <span className="sr-only">Favorite</span>
                        </Button>
                      </div>
                    }
                    key={listing.id}
                    footerBtns={<FullJobListingDialog {...listing} />}
                  />
                );
              })}
            </ListingsGrid>
          )}
        </Await>
      </Suspense>
    </>
  );
}

export default PublicListingsPage;
