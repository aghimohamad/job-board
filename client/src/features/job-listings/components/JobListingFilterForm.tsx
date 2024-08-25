import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  JOB_LISTING_EXPERIENCE_LEVELS,
  JOB_LISTING_TYPES,
} from "@backend/constants/types.ts";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterFormValues } from "../hooks/useFilterForm";




export const JobListingFilterForm = ({
  form 
}: {
  form : UseFormReturn<FilterFormValues>
  }) => {
  
  const handleReset = () => {
    form.reset()

  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 lg:grid-cols-3  sm:grid-cols-2 grid-cols-1 mb-8">
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>In USD</FormDescription>
              </FormItem>
            )}
          />
          <JobListingFormSelect
            name="type"
            label="Job Type"
            options={JOB_LISTING_TYPES}
            control={form.control}
          />
          <JobListingFormSelect
            name="experienceLevel"
            label="Experience Level"
            options={JOB_LISTING_EXPERIENCE_LEVELS}
            control={form.control}
          />

          <div className="flex justify-between items-end">
            <div className="flex flex-col justify-around gap-4">
              <FormField
                control={form.control}
                name="showHidden"
                render={({ field }) => (
                  <FormItem className="flex gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                            field.onChange(
                                checked === "indeterminate" ? false : checked
                            );
                        }}
                        />
                    </FormControl>
                        <FormLabel>Show Hidden</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="onlyFavorites"
                render={({ field }) => (
                  <FormItem className="flex gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                            field.onChange(
                                checked === "indeterminate" ? false : checked
                            );
                        }}
                        />
                    </FormControl>
                        <FormLabel>Only Favorites</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

type JobListingFormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: readonly PathValue<T, Path<T>>[];
  control: Control<T>;
};

const JobListingFormSelect = <T extends FieldValues>({
  options,
  control,
  name,
  label,
}: JobListingFormSelectProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value as PathValue<T, Path<T>>);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
              <SelectItem value={''}>
                    Any
                  </SelectItem>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
