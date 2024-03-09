import {PageHeader} from "@/components/ui/PageHeader.tsx";
import {Button} from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import {ListingSkeletonGrid, MyListingsGrid} from "@/features/job-listings";
import {Suspense} from "react";
import {Await, useDeferredLoaderData} from "@/lib/rounterUtil.tsx";
import {myListingsLoader} from "@/pages/jobs/my-listings/loader.ts";

function MyListingsPage() {
    const {listings} = useDeferredLoaderData<typeof myListingsLoader>()
    console.log(listings)
    return (
        <>
          <PageHeader
              btnSection={
                  <Button variant="outline" asChild>
                      <Link to="/jobs/new">Create Listing</Link>
                  </Button>
              }

          >
            My Job Listings
          </PageHeader>
            <Suspense fallback={
                <ListingSkeletonGrid />
            }>
                <Await resolve={listings} >
                    {(listings) => <MyListingsGrid listings={listings}/>}
                </Await>
            </Suspense>
            {/*<MyListingsGrid listings={listings} />*/}
        </>
    );
}

export default MyListingsPage;