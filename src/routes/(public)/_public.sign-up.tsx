import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signupSchema, type SignupSchemaType } from '@/features/auth/schemas/sign-up-schema';
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
import { useSignUp } from '@/features/auth/hooks/use-sign-up';


export const Route = createFileRoute('/(public)/_public/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
  const { mutate: createUser } = useSignUp();
  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: SignupSchemaType) {
    console.log(values);
    createUser(values);
  }

  return (
    <div className="container mx-auto w-1/3">
      <Card className="bg-slate-800 text-slate-100">
        <CardHeader className = "text-center">
          <CardTitle className="font-bold text-2xl">Sign Up</CardTitle>
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
            <Button type="submit" className = "w-max mx-auto bg-blue-500">Submit</Button>
          </form>
        </Form>

        <div className="flex items-center gap-x-2 pt-4 flex justify-center">
          <p>Already have an account?</p>
          <Link to={"/sign-in"} className="text-blue-500 underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
