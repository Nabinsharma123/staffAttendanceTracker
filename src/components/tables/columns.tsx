"use client"

import { Cell, ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { StaffAttendanceTableType, StaffType } from "@/lib/types"


export const createStaffTableColumns=(actionClick?:(type:"edit"|"delete",data:StaffType)=>void):ColumnDef<StaffType>[]=>{
  return [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: (cell:any) => {
    const rowValue=cell?.row?.original as StaffType
        
      return (
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem  onClick={()=>actionClick?.("edit",rowValue)}>Edit</DropdownMenuItem>
            <DropdownMenuItem  onClick={()=>actionClick?.("delete",rowValue)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
}



export const staffAttendanceTableColumns: ColumnDef<StaffAttendanceTableType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "totalPresents",
    header: "Total Presents",
  },
  {
    accessorKey: "totalAbsents",
    header: "Total Absents",
  },
  {
     accessorKey: "totalLeaves",
    header: "Total Leaves",
  }
]