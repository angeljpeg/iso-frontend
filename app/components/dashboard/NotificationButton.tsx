import { Bell } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/badge";

interface NotificationButtonProps {
  count?: number;
}

export function NotificationButton({ count = 0 }: NotificationButtonProps) {
  return (
    <Button variant="ghost" size="sm" className="relative">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
          {count}
        </Badge>
      )}
    </Button>
  );
}