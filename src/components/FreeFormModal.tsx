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
            <DialogContent className={className} showCloseButton={false} >
                <DialogHeader>
                    <div className="flex justify-between">
                    <DialogTitle>{title}</DialogTitle>
                    <button onClick={close}>
                    <X />

                    </button>
                    </div>
                    <div>
                        {children}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
};

export default FreeFormModal;

