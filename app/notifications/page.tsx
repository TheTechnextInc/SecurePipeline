"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell, AlertCircle, CheckCircle2, XCircle, GitBranch, Shield,
  Clock, Check, Trash2, Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

const typeConfig = {
  critical: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
  warning: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10" },
  success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  info: { icon: Bell, color: "text-primary", bg: "bg-primary/10" },
}

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useStore()
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [readFilter, setReadFilter] = useState<string>("all")

  const filtered = notifications
    .filter(n => typeFilter === "all" || n.type === typeFilter)
    .filter(n => readFilter === "all" || (readFilter === "unread" ? !n.read : n.read))

  return (
    <DashboardLayout title="Notifications" description="Security alerts, pipeline updates, and system notifications">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{unreadCount} unread</Badge>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 bg-transparent"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select value={readFilter} onValueChange={setReadFilter}>
            <SelectTrigger className="w-28 bg-transparent"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2 bg-transparent" disabled={unreadCount === 0}>
          <Check className="h-4 w-4" />Mark all as read
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardHeader><CardTitle className="text-foreground">All Notifications ({filtered.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No notifications match your filters.</div>
            ) : filtered.map(notification => {
              const config = typeConfig[notification.type]
              const Icon = config.icon
              return (
                <div key={notification.id} className={cn("flex items-start gap-4 p-4 transition-colors hover:bg-muted/50", !notification.read && "bg-muted/30")}>
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bg)}>
                    <Icon className={cn("h-5 w-5", config.color)} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("font-medium", !notification.read && "text-foreground")}>{notification.title}</span>
                      {!notification.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {notification.source === "SonarQube" && <Shield className="h-3 w-3" />}
                        {notification.source === "CI/CD" && <GitBranch className="h-3 w-3" />}
                        {notification.source === "Quality Gate" && <XCircle className="h-3 w-3" />}
                        {notification.source === "GitHub" && <GitBranch className="h-3 w-3" />}
                        {notification.source === "Reports" && <Bell className="h-3 w-3" />}
                        {notification.source === "Settings" && <Bell className="h-3 w-3" />}
                        {notification.source}
                      </span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{notification.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)} className="text-xs">Mark read</Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
