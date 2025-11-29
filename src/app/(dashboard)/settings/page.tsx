'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

// This is now the source of truth for the User Management table
function UserManagementTable() {
    const { data: users, isLoading, isError } = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers(),
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>
                            Invite and manage users in your tenant.
                        </CardDescription>
                    </div>
                    <Button>Invite User</Button>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        <p>Loading users...</p>
                                    </TableCell>
                            </TableRow>
                            )}
                            {isError && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-destructive">
                                        <p>Failed to load users.</p>
                                    </TableCell>
                            </TableRow>
                            )}
                            {!isLoading && !isError && users && users.map((user) => (
                                <TableRow key={user.email}>
                                    <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && !isError && (!users || users.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                 </div>
            </CardContent>
        </Card>
    );
}

export default function SettingsPage() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
        <TabsTrigger value="profile">Business Profile</TabsTrigger>
        <TabsTrigger value="api">API Keys</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>
              Update your business name and public information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" defaultValue="My Awesome Business" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <Input id="subdomain" defaultValue="my-awesome-business" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle>LLM API Keys</CardTitle>
            <CardDescription>
              Manage API keys for Large Language Model integrations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="llmProvider">LLM Provider</Label>
              <Input id="llmProvider" placeholder="e.g., gemini, openai" defaultValue="gemini" />
              <p className="text-xs text-muted-foreground">
                Enter the name of your LLM provider. Make sure the backend supports it.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="llmApiKey">API Key</Label>
              <Input id="llmApiKey" type="password" placeholder="Enter your API Key" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save API Key</Button>
          </CardFooter>
        </Card>
      </TabsContent>
       <TabsContent value="integrations">
        <Card>
          <CardHeader>
            <CardTitle>Meta Integration</CardTitle>
            <CardDescription>
              Connect your Facebook, Instagram, and WhatsApp accounts for unified messaging.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaAppId">Meta App ID</Label>
              <Input id="metaAppId" placeholder="Enter your Meta App ID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaAppSecret">Meta App Secret</Label>
              <Input id="metaAppSecret" type="password" placeholder="Enter your Meta App Secret" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaWebhookVerifyToken">Webhook Verify Token</Label>
              <Input id="metaWebhookVerifyToken" placeholder="Enter your Webhook Verify Token" />
              <p className="text-xs text-muted-foreground">
                A secure, random string you create. This will be used by Meta to verify your webhook endpoint.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Integration</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="users">
        <UserManagementTable />
      </TabsContent>
       <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of your application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Select your preferred color scheme.</p>
                {/* In a real app, this would be wired to a theme context */}
                <div className="flex gap-4 pt-2">
                    <Button variant="outline">Light</Button>
                    <Button variant="secondary">Dark</Button>
                </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
