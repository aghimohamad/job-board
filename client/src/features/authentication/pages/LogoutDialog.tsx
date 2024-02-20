import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {LoadingSpinner} from "@/components/ui/LoadingSpinner.tsx";

function LogoutDialog({isOpen } : {isOpen: boolean }) {
    return (
        <Dialog open={isOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Logging Out</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                <LoadingSpinner className="w-12 h-12" />
            </DialogDescription>
        </DialogContent>
    </Dialog>
    )
}

export default LogoutDialog;
