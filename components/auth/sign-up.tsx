"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema, type SignUpFormData } from "@/schemas/auth";

export default function SignUp() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "peizhenfei",
			email: "364950776@qq.com",
			password: "123456789",
			passwordConfirmation: "123456789",
		},
	});

	const onSubmit = async (data: SignUpFormData) => {
		try {
			await signUp.email(
				{
					email: data.email,
					password: data.password,
					name: data.name,
					callbackURL: "/dashboard",
				},
				{
					onRequest: () => {
						setIsLoading(true);
					},
					onResponse: () => {
						setIsLoading(false);
					},
					onError: (ctx) => {
						setIsLoading(false);
						toast.error(ctx.error?.message || "An error occurred");
					},
					onSuccess: async () => {
						setIsLoading(false);
						toast.success("Account created successfully!");
						router.push("/dashboard");
					},
				}
			);
		} catch (error) {
			setIsLoading(false);
			toast.error("Failed to create account. Please try again.");
			console.error("Sign up error:", error);
		}
	};

	return (
		<Card className="z-50 rounded-md rounded-t-none max-w-md w-full">
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					Enter your information to create an account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Max Robinson"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="m@example.com"
											{...field}
										/>
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
										<Input
											type="password"
											autoComplete="new-password"
											placeholder="Password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="passwordConfirmation"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											autoComplete="new-password"
											placeholder="Confirm Password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader2 size={16} className="animate-spin" />
							) : (
								"Create an account"
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}