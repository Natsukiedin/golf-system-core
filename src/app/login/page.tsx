import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const message = params?.message as string | undefined

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?q=80&w=2942&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div className="z-10 w-full max-w-md p-4">
        <Card className="border-white/10 bg-black/40 text-white shadow-2xl backdrop-blur-md">
          <CardHeader className="space-y-1 pb-8 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Golfer's Workshop</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <form action={login}>
            <CardContent className="space-y-6">
              {message && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 text-center">
                  {message}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200 text-base">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="admin@example.com" 
                  required 
                  className="h-12 border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus-visible:ring-white/30"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-200 text-base">Password</Label>
                </div>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  required 
                  className="h-12 border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus-visible:ring-white/30"
                />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button type="submit" className="w-full h-12 text-base font-semibold bg-white text-black hover:bg-gray-200">
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
