import baseApi from "@/services/baseApi.ts";
import {z} from "zod";
import {jobListingFormSchema} from "@backend/constants/schemas/jobListings.ts";
import {jobListingSchema} from "@/features/job-listings/constants/schemas.ts";

export const getJobListings = () => {
  return baseApi
      .get("/job-listings/my-listings")
      .then(res => z.array(jobListingSchema).parseAsync(res.data))
}
type AddJobListingValues = z.infer<typeof jobListingFormSchema>
export const addJobListing = (data: AddJobListingValues ) => {
  return baseApi
    .post("/job-listings", data)
    .then(res => jobListingSchema.parseAsync(res.data))
}

export const getJobListing = (
    id : string
) => {
  return baseApi
      .get(`/job-listings/${id}` )
      .then(res => res.data)
}

export const deleteJobListing = (
    id : string
) => {

  return baseApi
      .delete(`/job-listings/${id}` )
      .then(res => res.data)
}

export const editJobListing = (
    id : string,
    data: AddJobListingValues
) => {
  return baseApi
      .put(`/job-listings/${id}`, data )
      .then(res => jobListingSchema.parseAsync(res.data))
}