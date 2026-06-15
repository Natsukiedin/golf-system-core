"use client"

import { useState } from "react"
import { MoreVertical, CheckCircle2, Circle, Clock, PackageCheck } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TaskStatus = "ACCEPTED" | "IN_PROGRESS" | "INSPECTED" | "DELIVERED"

type Task = {
  id: string
  title: string
  customer: string
  dueDate: string
  status: TaskStatus
  priority: "High" | "Medium" | "Low"
}

const COLUMNS = [
  { id: "ACCEPTED", title: "受付済 (Accepted)", icon: Circle },
  { id: "IN_PROGRESS", title: "作業中 (In Progress)", icon: Clock },
  { id: "INSPECTED", title: "調整・検品完了 (Inspected)", icon: CheckCircle2 },
  { id: "DELIVERED", title: "お渡し済 (Delivered)", icon: PackageCheck },
] as const

const INITIAL_TASKS: Task[] = [
  { id: "T-1001", title: "Iron Set Re-shaft (#5-PW)", customer: "Tiger Woods", dueDate: "2024-06-20", status: "ACCEPTED", priority: "High" },
  { id: "T-1002", title: "Driver Grip Change", customer: "Rory McIlroy", dueDate: "2024-06-16", status: "IN_PROGRESS", priority: "Medium" },
  { id: "T-1003", title: "Wedge Loft Adjustment", customer: "Scottie Scheffler", dueDate: "2024-06-15", status: "INSPECTED", priority: "High" },
  { id: "T-1004", title: "Putter Length Cut", customer: "Nelly Korda", dueDate: "2024-06-10", status: "DELIVERED", priority: "Low" },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    // TODO: Connect to src/app/actions/tasks.ts (updateTaskStatus)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      default: return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Work Orders (Kanban)</h1>
        <Button>New Work Order</Button>
      </div>

      <div className="flex flex-1 gap-6 overflow-x-auto pb-4">
        {COLUMNS.map(column => {
          const columnTasks = tasks.filter(t => t.status === column.id)
          const Icon = column.icon

          return (
            <div key={column.id} className="flex min-w-[320px] flex-col gap-4 rounded-xl bg-muted/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-semibold">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  {column.title}
                </div>
                <Badge variant="secondary">{columnTasks.length}</Badge>
              </div>

              <div className="flex flex-col gap-3">
                {columnTasks.map(task => (
                  <Card key={task.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold leading-tight">{task.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Move to</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {COLUMNS.map(c => (
                              <DropdownMenuItem 
                                key={c.id} 
                                disabled={c.id === task.status}
                                onClick={() => moveTask(task.id, c.id as TaskStatus)}
                              >
                                {c.title}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>{task.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 py-2">
                      <div className="text-sm font-medium">{task.customer}</div>
                      <div className="text-xs text-muted-foreground mt-1">Due: {task.dueDate}</div>
                    </CardContent>
                    <CardFooter className="p-4 pt-2">
                      <Badge className={getPriorityColor(task.priority)} variant="outline">
                        {task.priority}
                      </Badge>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
