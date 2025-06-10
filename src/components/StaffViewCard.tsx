import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FreeFormModal from "./FreeFormModal";
import { StaffType } from "@/lib/types";


type ComponentPropsType={
staff: StaffType;
close:()=>void
}

export default function StaffViewCard({ staff,close }: ComponentPropsType) {
  return (
    <FreeFormModal title="" close={close}>
    <Card className="w-full max-w-md shadow-md rounded-2xl border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{staff.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{staff.email}</p>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-muted-foreground">Role:</span>
          <Badge variant="outline">{staff.role}</Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium text-muted-foreground">ID:</span>
          <span className="truncate">{staff.id}</span>
        </div>

      </CardContent>
    </Card>

    </FreeFormModal>
  );
}
