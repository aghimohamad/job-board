import { Await, useDeferredLoaderData } from "@/lib/rounterUtil";
import orderCompleteLoader from "./loader";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Suspense } from "react";

export function OrderCompletePage ()  {  

    const {message} = useDeferredLoaderData<typeof orderCompleteLoader>()
    return (
        <div className="flex flex-col items-center">
        <PageHeader
          subtitle={
           <Suspense fallback="Loading...">
                        <Await resolve={message} >
                            {message => message}
                        </Await>
                    </Suspense>
                    
          }
        >
          Order Complete
        </PageHeader>
        <Button asChild>
          <Link to="/">View Your Job Listings</Link>
        </Button>
      </div>
    );
};
    