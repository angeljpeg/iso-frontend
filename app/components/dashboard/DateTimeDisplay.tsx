import { Calendar, Clock } from "lucide-react";
import { Separator } from "~/components/ui/separator";

interface DateTimeDisplayProps {
  date: string;
  time: string;
}

export function DateTimeDisplay({ date, time }: DateTimeDisplayProps) {
  return (
    <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
      <Calendar className="h-4 w-4" />
      <span className="capitalize">{date}</span>
      <Separator orientation="vertical" className="h-4" />
      <Clock className="h-4 w-4" />
      <span>{time}</span>
    </div>
  );
}