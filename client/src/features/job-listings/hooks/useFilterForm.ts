import { useForm } from "react-hook-form";
import { JobListingValues } from "../constants/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobListingFormSchema } from "@backend/constants/schemas/jobListings";
import { z } from "zod";
import { JOB_LISTING_TYPES } from "@backend/constants/types";
import { JOB_LISTING_EXPERIENCE_LEVELS } from '../../../../../api/src/constants/types';
export const FilterFormSchema = z.object({
        title: z.string(),
        location: z.string(),
        salary: z.number(),
        type: z.enum(JOB_LISTING_TYPES).or(z.literal('')),
        experienceLevel: z.enum(JOB_LISTING_EXPERIENCE_LEVELS).or(z.literal('')),
        showHidden: z.boolean(),
        onlyFavorites: z.boolean(),
})

export type FilterFormValues = z.infer<typeof FilterFormSchema>
  
  const DEFAULT_VALUES: FilterFormValues = {
    experienceLevel: "",
    location: "",
    salary: NaN,
    title: "",
    type: "",
    showHidden: false,
    onlyFavorites: false,
  };
  
export const useFilterForm = () => {

    const form = useForm<FilterFormValues>({
        resolver: zodResolver(jobListingFormSchema),
        mode: "onChange",
        defaultValues: DEFAULT_VALUES,
    });

    const values = form.watch();

    const getFilteredListings = (listings: JobListingValues[], hiddenListings:string[] , favoriteListings:string[]) => {
        return listings.filter((listing) => {
            if (!listing.title.toLowerCase().match(values.title.toLowerCase())) {
                return false;
            }
            if (!listing.location.toLowerCase().match(values.location.toLowerCase())) {
                return false;
            }
            if (values.salary && listing.salary < values.salary){
                return false;
            }
            if (values.type && listing.type !== values.type){
                return false;
            }
            if (values.experienceLevel && listing.experienceLevel !== values.experienceLevel){
                return false;
            }
            if (!values.showHidden && hiddenListings.includes(listing.id)) {
                return false
            }
            if (values.onlyFavorites && !favoriteListings.includes(listing.id)) {
                return false
            }
          return true;
        });
      }

    
    return { 
        form,
        getFilteredListings
    }
}