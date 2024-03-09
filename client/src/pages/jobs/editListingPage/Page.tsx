import {PageHeader} from "@/components/ui/PageHeader.tsx";
import {editJobListing, JobListingForm} from "@/features/job-listings";
import {loader} from "@/pages/jobs/editListingPage/loader.ts";
import {Await, useDeferredLoaderData} from "@/lib/rounterUtil.tsx";
import {Suspense} from "react";
import {useNavigate} from "react-router-dom";

const EditListingPage = () => {
    const {jobListing, id} = useDeferredLoaderData<typeof loader>()
    const navigate = useNavigate()
    console.log(jobListing)
    return (
        <>
            <PageHeader>
                Edit Listing
            </PageHeader>
            <Suspense fallback={<div>Loading...</div>}>
                <Await resolve={jobListing}>

                    {(jobListing) => <JobListingForm
                        onSubmit={(jobListing) => editJobListing(id, jobListing).then(() => {
                            navigate('/jobs')

                        })}
                        initialJobListing={jobListing}/>}
                </Await>
            </Suspense>
        </>
    );
};

export default EditListingPage;