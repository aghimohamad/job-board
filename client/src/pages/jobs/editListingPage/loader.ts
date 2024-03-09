import {getJobListing} from "@/features/job-listings";
import {DeferredLoader} from "@/lib/rounterUtil.tsx";

export const loader = DeferredLoader(({params}) => {
    const id = params.id as string
    return {jobListing:  getJobListing(id), id: id}
})