import {getJobListings} from "@/features/job-listings";
import {DeferredLoader} from "@/lib/rounterUtil.tsx";
export const myListingsLoader = DeferredLoader(() => {
    return {listings : getJobListings()}
})
