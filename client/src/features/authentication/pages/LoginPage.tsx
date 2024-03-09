import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Link} from "react-router-dom";
import {useAuth} from "@/features/authentication/hooks/useAuth.ts";
import {AxiosError} from "axios";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {LoadingSpinner} from "@/components/ui/LoadingSpinner.tsx";

type LoginFormValues = z.infer<typeof formSchema>


const formSchema = z.object({
    email: z.string().email(),
    password: z.string().nonempty(),
})

export function LoginForm() {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
    })

    const {login} = useAuth()


    const onSubmit = async (data: {
        email: string;
        password: string;
    }) => {
        await login(data.email, data.password).catch((error) => {
            if (
                error instanceof AxiosError &&
                error.response?.data?.message != null
            ) {
                form.setError("root", {message: error.response.data.message})
            }
        })

    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card className='w-[400px]'>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        {
                            form.formState.errors?.root ? (
                                <CardDescription className="text-red-500 dark:text-red-700">
                                    {form.formState.errors.root?.message}
                                </CardDescription>
                            ) : null
                        }
                    </CardHeader>
                    <CardContent className="flex flex-col w-full gap-4">
                        <div className="grid gap-4 grid-cols-1">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
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
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 justify-end">
                        <Button type="button" variant='ghost'>Cancel</Button>
                        <Button type="button" variant='outline' asChild>
                            <Link to="/signup">Sign up</Link>
                        </Button>
                        <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <LoadingSpinner/> : "Log in"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}


