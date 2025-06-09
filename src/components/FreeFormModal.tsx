"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

type ComponentPropsType = {
    title: string,
    children: React.ReactNode
    className?:string
    close?:()=>void
}

const FreeFormModal = (props: ComponentPropsType) => {

    const { children, title, className, close } = props
    return (
        <Dialog open >
            <DialogContent aria-describedby={undefined} className={`flex flex-col max-h-[90vh] ${className}`} showCloseButton={false} >
                <DialogHeader className="flex-1">
                    <div className="flex justify-between">
                    <DialogTitle>{title}</DialogTitle>
                    <button onClick={close}>
                    <X />
                    </button>
                    </div>
                </DialogHeader>
                    <div className="h-full overflow-auto">
                        {children}
                    </div>
            </DialogContent>
        </Dialog>
    )
};

export default FreeFormModal;

