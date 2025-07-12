import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User } from "lucide-react";

export default function EventDetailsModal({ open, onClose, event }) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md sm:right-0 sm:left-auto sm:ml-auto">
        <DialogHeader>
          <DialogTitle className="text-sm text-gray-500">
            University Name
          </DialogTitle>
          <DialogTitle className="text-lg font-semibold">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Attendee */}
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Attendees:</span>
            <span className="flex items-center space-x-1">
              <img
                src="https://api.dicebear.com/7.x/lorelei/svg?seed=bailey"
                className="w-5 h-5 rounded-full"
                alt="avatar"
              />
              <span>{event.attendee}</span>
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Date:</span>
            <span>{event.date}</span>
          </div>

          {/* Time */}
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Time:</span>
            <span>{event.time}</span>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2">
            <span className="font-medium">Location:</span>
            <span>{event.location}</span>
          </div>

          <div>
            <Textarea
              id="details"
              placeholder="Job Details"
              defaultValue={event.details || ""}
              readOnly
            />
          </div>

          {/* Join Link */}
          {event.joinLink && (
            <div>
              <Label>Join Link</Label>
              <a
                href={event.joinLink}
                className="text-blue-600 underline block text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.joinLink}
              </a>
            </div>
          )}

          {/* Meeting ID */}
          {event.meetingId && (
            <div>
              <Label>Meeting ID</Label>
              <Input readOnly value={event.meetingId} />
            </div>
          )}

          {/* Password */}
          {event.password && (
            <div>
              <Label>Password</Label>
              <Input readOnly value={event.password} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
