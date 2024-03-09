import {PageHeader} from "@/components/ui/PageHeader.tsx";
import {JobListingForm,addJobListing} from "@/features/job-listings";

import {useNavigate} from "react-router-dom";

const NewListingPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <PageHeader >
                New Listing
            </PageHeader>
            <JobListingForm
            onSubmit={async (values) => {
                await  addJobListing(values);
                navigate("/jobs")
            }}
            />
        </>
    );
};

export default NewListingPage;