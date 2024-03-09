import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {jobListingFormSchema} from "@backend/constants/schemas/jobListings.ts";
import {Control, FieldValues, Path, PathValue, useForm} from "react-hook-form";
import {z} from "zod";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {JOB_LISTING_EXPERIENCE_LEVELS, JOB_LISTING_TYPES} from "@backend/constants/types.ts";
import {Button} from "@/components/ui/button.tsx";
import * as React from "react";
import ListingsGrid from "@/features/job-listings/components/listingsGrid.tsx";
import ListingCard from "@/features/job-listings/components/listingCard.tsx";
import {FullJobListingDialog} from "@/features/job-listings";
import {LoadingSpinner} from "@/components/ui/LoadingSpinner.tsx";

type JobListingValues = z.infer<typeof jobListingFormSchema>

const DEFAULT_VALUES: JobListingValues = {
    applyUrl: "",
    companyName: "",
    description: "",
    experienceLevel: "Mid-Level",
    location: "",
    salary: NaN,
    shortDescription: "",
    title: "",
    type: "Full Time",
}

interface JobListingFormProps {
    initialJobListing?: JobListingValues
    onSubmit: (jobListing: JobListingValues) => void

}

export const JobListingForm = ({
                                   initialJobListing = DEFAULT_VALUES,
                                   onSubmit
                               }: JobListingFormProps) => {

    const form = useForm<JobListingValues>({
        resolver: zodResolver(jobListingFormSchema),
        defaultValues: initialJobListing,
    });

    const [showPreview, setShowPreview] = React.useState(false);


    console.log(form.getValues());
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-3  sm:grid-cols-2 grid-cols-1">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="applyUrl"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Application URL</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <JobListingFormSelect name='type' label='Job Type' options={JOB_LISTING_TYPES}
                                          control={form.control}/>
                    <JobListingFormSelect name='experienceLevel' label='Experience Level'
                                          options={JOB_LISTING_EXPERIENCE_LEVELS}
                                          control={form.control}/>
                    <FormField
                        control={form.control}
                        name="salary"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Salary</FormLabel>
                                <FormControl>
                                    <Input type='number' {...field}
                                           onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                           value={field.value || ""}
                                    />
                                </FormControl>
                                <FormDescription>
                                    In USD
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="shortDescription"

                        render={({field}) => (
                            <FormItem className="sm:col-span-2">
                                <FormLabel>Short Description</FormLabel>
                                <FormControl>
                                    <Textarea rows={2} {...field} />
                                </FormControl>
                                <FormDescription>
                                    Max 150 characters
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    /><FormField
                    control={form.control}
                    name="description"

                    render={({field}) => (
                        <FormItem className="col-span-full">
                            <FormLabel>Full Description</FormLabel>
                            <FormControl>
                                <Textarea rows={2} {...field} />
                            </FormControl>
                            <FormDescription>
                                Supports full Markdown
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                </div>
                <div className="flex gap-2 justify-end">
                    <Button type="button" variant='outline'
                            onClick={() => setShowPreview(!showPreview)}
                    >
                        {showPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                    <Button type="submit"
                            disabled={!form.formState.isValid || form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? <LoadingSpinner/> : "Save"}
                    </Button>
                </div>
                <div>
                    {showPreview && (
                        <ListingsGrid>
                            <ListingCard listing={form.getValues()} footerBtns={
                                <FullJobListingDialog {...form.getValues()}/>
                            }/>
                        </ListingsGrid>
                    )}
                </div>
            </form>
        </Form>
    );
};


type  JobListingFormSelectProps<T extends FieldValues> = {
    name: Path<T>,
    label: string,
    options: readonly PathValue<T, Path<T>>[],
    control: Control<T>
}

const JobListingFormSelect = <T extends FieldValues>({
                                                         options,
                                                         control,
                                                         name,
                                                         label
                                                     }: JobListingFormSelectProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({field}) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select
                        onValueChange={(value) => {
                            field.onChange(value as PathValue<T, Path<T>>)
                        }}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue/>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectGroup>
                                {options.map(option => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};