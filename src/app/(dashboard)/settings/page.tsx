
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { llmProviderEnum } from "@/db/schema";

// Mock data, in a real app this would come from your database/API
const users = [
    { name: 'Admin User', email: 'admin@vyaparos.com', role: 'admin' },
    { name: 'Staff User', email: 'staff@vyaparos.com', role: 'staff' },
];

const llmProviders = llmProviderEnum.enumValues;

export default function SettingsPage() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
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
               <Select defaultValue="gemini">
                <SelectTrigger id="llmProvider">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {llmProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
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
                    {users.map((user) => (
                        <TableRow key={user.email}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm">Edit</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
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
