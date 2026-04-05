import { SettingsDialog } from "@/components/settings-dialog"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"
import { House, ListTodo, Settings, SquareFunction } from "lucide-react"

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            className="glass [&>[data-sidebar=sidebar]]:bg-transparent backdrop-blur-sm transition-all duration-300"
        >
            <SidebarHeader >
                <SidebarMenuButton
                    size="lg"
                    className="hover:bg-transparent active:bg-transparent"
                >
                    <div className="flex aspect-square items-center justify-center p-1 rounded-sm bg-primary text-primary-foreground">
                        <SquareFunction className="size-6" />
                    </div>
                    <span className="text-base font-semibold">Focus Mate</span>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="hover-glass">
                                <House /> Home
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="hover-glass">
                                <ListTodo /> Tasks
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenuItem>
                    <SettingsDialog>
                        <SidebarMenuButton className="hover-glass">
                            <Settings />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </SettingsDialog>
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>
    )
}