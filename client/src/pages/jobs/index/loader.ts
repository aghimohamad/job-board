import {getPublicJobListings} from "@/features/job-listings";
import {DeferredLoader} from "@/lib/rounterUtil.tsx";
export const publicListingsLoader = DeferredLoader(() => {
    return {listings : getPublicJobListings()}
})
