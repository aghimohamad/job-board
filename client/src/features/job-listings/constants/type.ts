import {z} from "zod";
import {jobListingSchema} from "../constants/schemas"

export type JobListingValues = z.infer<typeof jobListingSchema>