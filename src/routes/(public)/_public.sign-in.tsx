import { createFileRoute, Link } from '@tanstack/react-router'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { signinSchema, type SignInSchemaType } from '@/features/auth/schemas/sign-in-schema';
import { useSignIn } from '@/features/auth/hooks/use-sign-in';

export const Route = createFileRoute('/(public)/_public/sign-in')({
    component: SignInPage,
})

function SignInPage() {
    const { mutate: login } = useSignIn();
    const form = useForm<SignInSchemaType>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    function onSubmit(values: SignInSchemaType) {
        login(values);
    }

    return (
        <div className="container mx-auto max-w-xl">
            <Card className="width-[400px] bg-slate-800 text-slate-100">
                <CardHeader>
                    <CardTitle className="font-bold text-2xl">Sign In</CardTitle>
                    <CardDescription>Please fill in the details below:</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className='bg-blue-500' type="submit">Submit</Button>
                        </form>
                    </Form>

                    <div className="flex items-center gap-x-2 pt-4">
                        <p>Don&apos;t have an account?</p>
                        <Link to={"/sign-up"} className="text-blue-500 underline">
                            Sign Up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
