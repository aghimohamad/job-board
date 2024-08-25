import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Link} from "react-router-dom";
import {signupSchema} from "@backend/constants/schemas/users.ts";
import {useAuth} from "@/features/authentication/hooks/useAuth.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {LoadingSpinner} from "@/components/ui/LoadingSpinner.tsx";

type SignupFormValues = z.infer<typeof formSchema>


const formSchema = signupSchema.merge(z.object({
confirm: z.string().nonempty(),
})).refine(data => data.password === data.confirm, {
message: "Passwords do not match",
path: ["confirm"],
})

export function SignupForm() {
    const form = useForm<SignupFormValues>({
        resolver: zodResolver(formSchema),
    })

    console.log(form.formState.isValid);


    const {signup} = useAuth()

    const onSubmit = (data : {
        email: string,
        password: string
    }) => {
        const { email, password } = data
        signup(email, password)
    }

    return (
        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Card className='w-[400px]'>
                        <CardHeader>
                            <CardTitle>Sign up</CardTitle>
                            {
                                form.formState.errors?.root ? (
                                    <CardDescription className="text-red-500 dark:text-red-700">
                                        {form.formState.errors.root?.message}
                                    </CardDescription>
                                ) : null
                            }
                        </CardHeader>
                        <CardContent className="flex flex-col w-full gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type='email' {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirm"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password Confirmation</FormLabel>
                                    <FormControl>
                                        <Input type='password' {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        </CardContent>
                        <CardDescription className="flex gap-2 justify-end">
                                <Button type="submit" variant='ghost'>Cancel</Button>
                                <Button type="submit" variant='outline' asChild>
                                    <Link to="/login">Log in</Link>
                                </Button>
                                <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? <LoadingSpinner/> : "Sign up"}
                                </Button>
                        </CardDescription>
                    </Card>
                </form>
        </Form>
    )
}


