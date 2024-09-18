import React from 'react'
import { Home, MessageSquare, PlusCircle, Folder, Settings, User, Trash2, Paperclip, X, PenSquare, Plus } from 'lucide-react'

interface IconProps {
  className?: string
}

const iconStyle = "h-5 w-5"  // default style

export const HomeIcon: React.FC<IconProps> = ({ className = "" }) => (
  <Home className={`${iconStyle} ${className}`} />
)

export const MessageIcon: React.FC<IconProps> = ({ className = "" }) => (
  <MessageSquare className={`${iconStyle} ${className}`} />
)

export const AddIcon: React.FC<IconProps> = ({ className = "" }) => (
  <PlusCircle className={`${iconStyle} ${className}`} />
)

export const FolderIcon: React.FC<IconProps> = ({ className = "" }) => (
  <Folder className={`${iconStyle} ${className}`} />
)

export const SettingsIcon: React.FC<IconProps> = ({ className = "" }) => (
  <Settings className={`${iconStyle} ${className}`} />
)

export const UserIcon: React.FC<IconProps> = ({ className = "" }) => (
  <User className={`${iconStyle} ${className}`} />
)

export const DeleteIcon: React.FC<IconProps> = ({ className = "" }) => (
  <Trash2 className={`${iconStyle} ${className}`} />
)

export const PaperclipIcon: React.FC<IconProps> = ({ className = "" }) => (
  <Paperclip className={`${iconStyle} ${className}`} />
)

export const DiscardIcon: React.FC<IconProps> = ({ className = "" }) => (
  <X className={`${iconStyle} ${className}`} />
)

export const AddTextIcon: React.FC<IconProps> = ({ className = "" }) => (
  <PenSquare className={`${iconStyle} ${className}`} />
)

export const NewChatIcon: React.FC<IconProps> = ({ className = "" }) => (
  <PenSquare className={`${iconStyle} ${className}`} />
)
