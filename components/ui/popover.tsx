"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"
import { BodyText } from "@/components/ui/typography"
import { AddTextIcon, ArchiveIcon, DeleteIcon } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  onDelete?: () => void;
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ className, align = "center", sideOffset = 0, onDelete, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      style={{ width: '140px' }}
      className={cn(
        "z-50 rounded-xl border bg-popover p-1 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center p-3">
        <div className="flex flex-col items-start space-y-2.5">
          <Button variant="ghost" className="w-full justify-start p-0 h-auto">
            <div className="flex space-x-2 items-center">
              <AddTextIcon className="text-popover-foreground" />
              <BodyText>Umbenennen</BodyText>
            </div>
          </Button>
          <Button variant="ghost" className="w-full justify-start p-0 h-auto">
            <div className="flex space-x-2 items-center">
              <ArchiveIcon className="text-popover-foreground" />
              <BodyText>Archivieren</BodyText>
            </div>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start p-0 h-auto"
            onClick={onDelete}
          >
            <div className="flex space-x-2 items-center">
              <DeleteIcon className="text-red-500" />
              <BodyText className="text-red-500">Löschen</BodyText>
            </div>
          </Button>
        </div>
      </div>
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
