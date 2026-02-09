/**
 * UI Component Type Declarations
 * Centralized type definitions for all shadcn/ui components
 */

import { ReactNode, ComponentType, ForwardRefExoticComponent, RefAttributes, InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, LabelHTMLAttributes, DivAttributes } from 'react';

// Button Component
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export const Button: ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>>;

// Input Component
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: ForwardRefExoticComponent<InputProps & RefAttributes<HTMLInputElement>>;

// Label Component
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export const Label: ForwardRefExoticComponent<LabelProps & RefAttributes<HTMLLabelElement>>;

// Textarea Component
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea: ForwardRefExoticComponent<TextareaProps & RefAttributes<HTMLTextAreaElement>>;

// Select Components
export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
  disabled?: boolean;
  defaultValue?: string;
  required?: boolean;
}

export interface SelectTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
}

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

export interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children?: ReactNode;
  disabled?: boolean;
}

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export const Select: ComponentType<SelectProps>;
export const SelectTrigger: ForwardRefExoticComponent<SelectTriggerProps & RefAttributes<HTMLButtonElement>>;
export const SelectContent: ComponentType<SelectContentProps>;
export const SelectItem: ComponentType<SelectItemProps>;
export const SelectValue: ComponentType<SelectValueProps>;

// Card Components
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

export const Card: ComponentType<CardProps>;
export const CardHeader: ComponentType<CardProps>;
export const CardFooter: ComponentType<CardProps>;
export const CardTitle: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLHeadingElement>>;
export const CardDescription: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLParagraphElement>>;
export const CardContent: ComponentType<CardProps>;

// Dialog Components
export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export const Dialog: ComponentType<DialogProps>;
export const DialogTrigger: ComponentType<{ asChild?: boolean; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const DialogContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const DialogHeader: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const DialogFooter: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const DialogTitle: ComponentType<{ className?: string; children?: ReactNode }>;
export const DialogDescription: ComponentType<{ className?: string; children?: ReactNode }>;

// Alert Dialog Components
export const AlertDialog: ComponentType<DialogProps>;
export const AlertDialogTrigger: ComponentType<{ asChild?: boolean; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const AlertDialogContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const AlertDialogHeader: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const AlertDialogFooter: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const AlertDialogTitle: ComponentType<{ className?: string; children?: ReactNode }>;
export const AlertDialogDescription: ComponentType<{ className?: string; children?: ReactNode }>;
export const AlertDialogAction: ComponentType<ButtonProps>;
export const AlertDialogCancel: ComponentType<ButtonProps>;

// Alert Component
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
  className?: string;
  children?: ReactNode;
}

export const Alert: ComponentType<AlertProps>;
export const AlertTitle: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLHeadingElement>>;
export const AlertDescription: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLParagraphElement>>;

// Tabs Components
export interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children?: ReactNode;
  className?: string;
}

export const Tabs: ComponentType<TabsProps>;
export const TabsList: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const TabsTrigger: ComponentType<{ value: string; className?: string; children?: ReactNode; disabled?: boolean } & HTMLAttributes<HTMLButtonElement>>;
export const TabsContent: ComponentType<{ value: string; className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;

// Accordion Components
export interface AccordionProps {
  type?: 'single' | 'multiple';
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
  children?: ReactNode;
  className?: string;
  collapsible?: boolean;
}

export const Accordion: ComponentType<AccordionProps>;
export const AccordionItem: ComponentType<{ value: string; className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const AccordionTrigger: ComponentType<{ className?: string; children?: ReactNode; asChild?: boolean } & HTMLAttributes<HTMLButtonElement>>;
export const AccordionContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;

// Checkbox Component
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox: ForwardRefExoticComponent<CheckboxProps & RefAttributes<HTMLInputElement>>;

// Radio Group Components
export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const RadioGroup: ComponentType<RadioGroupProps>;
export const RadioGroupItem: ComponentType<{ value: string; className?: string; disabled?: boolean; id?: string } & HTMLAttributes<HTMLDivElement>>;

// Switch Component
export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Switch: ComponentType<SwitchProps>;

// Dropdown Menu Components
export const DropdownMenu: ComponentType<{ children?: ReactNode }>;
export const DropdownMenuTrigger: ComponentType<{ asChild?: boolean; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const DropdownMenuContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const DropdownMenuItem: ComponentType<{ className?: string; children?: ReactNode; disabled?: boolean; inset?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const DropdownMenuLabel: ComponentType<{ className?: string; children?: ReactNode; inset?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const DropdownMenuSeparator: ComponentType<{ className?: string } & HTMLAttributes<HTMLHRElement>>;
export const DropdownMenuCheckboxItem: ComponentType<{ className?: string; children?: ReactNode; checked?: boolean; onCheckedChange?: (checked: boolean) => void; disabled?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const DropdownMenuRadioGroup: ComponentType<{ value?: string; onValueChange?: (value: string) => void; children?: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>>;
export const DropdownMenuRadioItem: ComponentType<{ value: string; className?: string; children?: ReactNode; disabled?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const DropdownMenuShortcut: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLSpanElement>>;
export const DropdownMenuGroup: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const DropdownMenuSub: ComponentType<{ children?: ReactNode }>;
export const DropdownMenuSubContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const DropdownMenuSubTrigger: ComponentType<{ className?: string; children?: ReactNode; inset?: boolean } & HTMLAttributes<HTMLDivElement>>;

// Sheet Components
export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export const Sheet: ComponentType<SheetProps>;
export const SheetTrigger: ComponentType<{ asChild?: boolean; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const SheetContent: ComponentType<{ className?: string; children?: ReactNode; side?: 'left' | 'right' | 'top' | 'bottom' } & HTMLAttributes<HTMLDivElement>>;
export const SheetHeader: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const SheetFooter: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const SheetTitle: ComponentType<{ className?: string; children?: ReactNode }>;
export const SheetDescription: ComponentType<{ className?: string; children?: ReactNode }>;
export const SheetClose: ComponentType<{ asChild?: boolean; className?: string; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;

// Popover Components
export interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export const Popover: ComponentType<PopoverProps>;
export const PopoverTrigger: ComponentType<{ asChild?: boolean; className?: string; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const PopoverContent: ComponentType<{ className?: string; children?: ReactNode; side?: 'left' | 'right' | 'top' | 'bottom'; align?: 'start' | 'center' | 'end' } & HTMLAttributes<HTMLDivElement>>;

// Tooltip Components
export interface TooltipProps {
  children?: ReactNode;
  delayDuration?: number;
}

export const Tooltip: ComponentType<TooltipProps>;
export const TooltipTrigger: ComponentType<{ asChild?: boolean; className?: string; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const TooltipContent: ComponentType<{ className?: string; children?: ReactNode; side?: 'left' | 'right' | 'top' | 'bottom'; align?: 'start' | 'center' | 'end' } & HTMLAttributes<HTMLDivElement>>;
export const TooltipProvider: ComponentType<{ children?: ReactNode; delayDuration?: number }>;

// Badge Component
export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  children?: ReactNode;
}

export const Badge: ComponentType<BadgeProps>;

// Breadcrumb Components
export const Breadcrumb: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLNavElement>>;
export const BreadcrumbList: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLOListElement>>;
export const BreadcrumbItem: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLLIElement>>;
export const BreadcrumbLink: ComponentType<{ href: string; className?: string; children?: ReactNode; asChild?: boolean } & HTMLAttributes<HTMLAnchorElement>>;
export const BreadcrumbSeparator: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLLIElement>>;
export const BreadcrumbPage: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLSpanElement>>;

// Avatar Component
export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

export const Avatar: ComponentType<AvatarProps>;
export const AvatarImage: ForwardRefExoticComponent<{ src?: string; alt?: string; className?: string } & RefAttributes<HTMLImageElement>>;
export const AvatarFallback: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;

// Table Components
export const Table: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLTableElement>>;
export const TableHeader: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLTableSectionElement>>;
export const TableBody: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLTableSectionElement>>;
export const TableRow: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLTableRowElement>>;
export const TableHead: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLTableCellElement>>;
export const TableCell: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLTableCellElement>>;
export const TableCaption: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLTableCaptionElement>>;
export const TableFooter: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLTableSectionElement>>;

// Slider Component
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  onValueChange?: (value: number[]) => void;
  className?: string;
}

export const Slider: ForwardRefExoticComponent<SliderProps & RefAttributes<HTMLDivElement>>;

// Progress Component
export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  className?: string;
}

export const Progress: ForwardRefExoticComponent<ProgressProps & RefAttributes<HTMLDivElement>>;

// Skeleton Component
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: ComponentType<SkeletonProps>;

// Separator Component
export interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  className?: string;
}

export const Separator: ForwardRefExoticComponent<SeparatorProps & RefAttributes<HTMLHRElement>>;

// Toggle Component
export interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  asChild?: boolean;
}

export const Toggle: ForwardRefExoticComponent<ToggleProps & RefAttributes<HTMLButtonElement>>;

// Toggle Group Component
export interface ToggleGroupProps {
  type: 'single' | 'multiple';
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline';
}

export const ToggleGroup: ComponentType<ToggleGroupProps>;
export const ToggleGroupItem: ComponentType<{ value: string; className?: string; children?: ReactNode; disabled?: boolean; asChild?: boolean } & HTMLAttributes<HTMLButtonElement>>;

// Drawer Components
export interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  children?: ReactNode;
}

export const Drawer: ComponentType<DrawerProps>;
export const DrawerTrigger: ComponentType<{ asChild?: boolean; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const DrawerContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const DrawerHeader: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const DrawerFooter: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const DrawerTitle: ComponentType<{ className?: string; children?: ReactNode }>;
export const DrawerDescription: ComponentType<{ className?: string; children?: ReactNode }>;
export const DrawerClose: ComponentType<{ asChild?: boolean; className?: string; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;

// Collapsible Component
export interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children?: ReactNode;
  className?: string;
}

export const Collapsible: ComponentType<CollapsibleProps>;
export const CollapsibleTrigger: ComponentType<{ asChild?: boolean; className?: string; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const CollapsibleContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;

// Command Components (Cmdk)
export interface CommandProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

export const Command: ComponentType<CommandProps>;
export const CommandDialog: ComponentType<{ open?: boolean; onOpenChange?: (open: boolean) => void; children?: ReactNode }>;
export const CommandInput: ComponentType<{ placeholder?: string; className?: string } & InputHTMLAttributes<HTMLInputElement>>;
export const CommandList: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const CommandEmpty: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const CommandGroup: ComponentType<{ heading?: string; className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const CommandItem: ComponentType<{ value?: string; onSelect?: (value: string) => void; className?: string; children?: ReactNode; disabled?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const CommandSeparator: ComponentType<{ className?: string } & HTMLAttributes<HTMLHRElement>>;
export const CommandShortcut: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLSpanElement>>;

// Context Menu Components
export const ContextMenu: ComponentType<{ children?: ReactNode }>;
export const ContextMenuTrigger: ComponentType<{ asChild?: boolean; className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const ContextMenuContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const ContextMenuItem: ComponentType<{ className?: string; children?: ReactNode; disabled?: boolean; inset?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const ContextMenuLabel: ComponentType<{ className?: string; children?: ReactNode; inset?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const ContextMenuSeparator: ComponentType<{ className?: string } & HTMLAttributes<HTMLHRElement>>;
export const ContextMenuCheckboxItem: ComponentType<{ className?: string; children?: ReactNode; checked?: boolean; onCheckedChange?: (checked: boolean) => void; disabled?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const ContextMenuRadioGroup: ComponentType<{ value?: string; onValueChange?: (value: string) => void; children?: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>>;
export const ContextMenuRadioItem: ComponentType<{ value: string; className?: string; children?: ReactNode; disabled?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const ContextMenuShortcut: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLSpanElement>>;
export const ContextMenuSub: ComponentType<{ children?: ReactNode }>;
export const ContextMenuSubContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const ContextMenuSubTrigger: ComponentType<{ className?: string; children?: ReactNode; inset?: boolean } & HTMLAttributes<HTMLDivElement>>;

// Hover Card Component
export interface HoverCardProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  children?: ReactNode;
}

export const HoverCard: ComponentType<HoverCardProps>;
export const HoverCardTrigger: ComponentType<{ asChild?: boolean; className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const HoverCardContent: ComponentType<{ className?: string; children?: ReactNode; side?: 'left' | 'right' | 'top' | 'bottom'; align?: 'start' | 'center' | 'end' } & HTMLAttributes<HTMLDivElement>>;

// Menubar Components
export const Menubar: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const MenubarMenu: ComponentType<{ children?: ReactNode }>;
export const MenubarTrigger: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const MenubarContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const MenubarItem: ComponentType<{ className?: string; children?: ReactNode; disabled?: boolean; inset?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const MenubarLabel: ComponentType<{ className?: string; children?: ReactNode; inset?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const MenubarSeparator: ComponentType<{ className?: string } & HTMLAttributes<HTMLHRElement>>;
export const MenubarCheckboxItem: ComponentType<{ className?: string; children?: ReactNode; checked?: boolean; onCheckedChange?: (checked: boolean) => void; disabled?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const MenubarRadioGroup: ComponentType<{ value?: string; onValueChange?: (value: string) => void; children?: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>>;
export const MenubarRadioItem: ComponentType<{ value: string; className?: string; children?: ReactNode; disabled?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const MenubarShortcut: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLSpanElement>>;
export const MenubarSub: ComponentType<{ children?: ReactNode }>;
export const MenubarSubContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const MenubarSubTrigger: ComponentType<{ className?: string; children?: ReactNode; inset?: boolean } & HTMLAttributes<HTMLDivElement>>;

// Navigation Menu Components
export const NavigationMenu: ComponentType<{ className?: string; children?: ReactNode; orientation?: 'horizontal' | 'vertical' } & HTMLAttributes<HTMLDivElement>>;
export const NavigationMenuList: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLUListElement>>;
export const NavigationMenuItem: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLLIElement>>;
export const NavigationMenuTrigger: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const NavigationMenuContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const NavigationMenuLink: ComponentType<{ href?: string; className?: string; children?: ReactNode; asChild?: boolean; active?: boolean } & HTMLAttributes<HTMLAnchorElement>>;
export const NavigationMenuViewport: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;

// Pagination Components
export interface PaginationProps extends HTMLAttributes<HTMLNavElement> {
  className?: string;
  children?: ReactNode;
}

export const Pagination: ComponentType<PaginationProps>;
export const PaginationContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLUListElement>>;
export const PaginationItem: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLLIElement>>;
export const PaginationLink: ComponentType<{ href?: string; isActive?: boolean; className?: string; children?: ReactNode; asChild?: boolean } & HTMLAttributes<HTMLAnchorElement>>;
export const PaginationPrevious: ComponentType<{ href?: string; className?: string; children?: ReactNode } & HTMLAttributes<HTMLAnchorElement>>;
export const PaginationNext: ComponentType<{ href?: string; className?: string; children?: ReactNode } & HTMLAttributes<HTMLAnchorElement>>;
export const PaginationEllipsis: ComponentType<{ className?: string } & HTMLAttributes<HTMLSpanElement>>;

// Resizable Components
export interface ResizableProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

export const Resizable: ComponentType<ResizableProps>;
export const ResizablePanel: ComponentType<ResizableProps>;
export const ResizableHandle: ComponentType<{ className?: string; withHandle?: boolean } & HTMLAttributes<HTMLDivElement>>;

// Scroll Area Component
export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  orientation?: 'horizontal' | 'vertical' | 'both';
}

export const ScrollArea: ComponentType<ScrollAreaProps>;
export const ScrollBar: ComponentType<{ orientation?: 'horizontal' | 'vertical'; className?: string } & HTMLAttributes<HTMLDivElement>>;

// Sidebar Components
export const Sidebar: ComponentType<{ className?: string; children?: ReactNode; side?: 'left' | 'right'; variant?: 'sidebar' | 'floating' | 'inset'; collapsible?: 'icon' | 'offcanvas' | 'none'; defaultOpen?: boolean } & HTMLAttributes<HTMLDivElement>>;
export const SidebarProvider: ComponentType<{ children?: ReactNode; defaultOpen?: boolean }>;
export const SidebarTrigger: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const SidebarContent: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const SidebarHeader: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const SidebarFooter: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const SidebarMenu: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLUListElement>>;
export const SidebarMenuItem: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLLIElement>>;
export const SidebarMenuButton: ComponentType<{ asChild?: boolean; isActive?: boolean; tooltip?: string; className?: string; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const SidebarMenuSub: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLUListElement>>;
export const SidebarMenuSubItem: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLLIElement>>;
export const SidebarMenuSubButton: ComponentType<{ asChild?: boolean; isActive?: boolean; className?: string; children?: ReactNode } & HTMLAttributes<HTMLButtonElement>>;
export const SidebarRail: ComponentType<{ className?: string } & HTMLAttributes<HTMLDivElement>>;
export const SidebarInset: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;

// Sonner Toast
export const Toaster: ComponentType<{ theme?: 'light' | 'dark' | 'system'; position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'; richColors?: boolean; closeButton?: boolean; expand?: boolean }>;
export const toast: {
  (message: string, options?: any): string;
  success(message: string, options?: any): string;
  error(message: string, options?: any): string;
  loading(message: string, options?: any): string;
  custom(component: ReactNode, options?: any): string;
};

// Toast Hook
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const useToast: () => { toast: (props: any) => void; toasts: Toast[] };

// Carousel Components (if using react-responsive-carousel)
export const Carousel: ComponentType<{ children?: ReactNode; showArrows?: boolean; showThumbs?: boolean; showStatus?: boolean; infiniteLoop?: boolean; autoPlay?: boolean; interval?: number; stopOnHover?: boolean; selectedItem?: number; onClickItem?: (index: number) => void; className?: string } & HTMLAttributes<HTMLDivElement>>;
export const CarouselItem: ComponentType<{ children?: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>>;

// Chart Component (if using recharts or similar)
export const Chart: ComponentType<{ config?: any; children?: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>>;
export const ChartContainer: ComponentType<{ config?: any; children?: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>>;
export const ChartTooltip: ComponentType<{ cursor?: boolean; content?: ReactNode; className?: string }>;
export const ChartLegend: ComponentType<{ className?: string }>;

// Calendar Component (if using react-day-picker)
export const Calendar: ComponentType<{ mode?: 'single' | 'range' | 'multiple'; selected?: any; onSelect?: (date: any) => void; disabled?: (date: any) => boolean; showOutsideDays?: boolean; fixedWeeks?: boolean; className?: string } & HTMLAttributes<HTMLDivElement>>;

// Input OTP Component
export interface InputOTPProps extends InputHTMLAttributes<HTMLInputElement> {
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  containerClassName?: string;
  inputClassName?: string;
  slotClassName?: string;
}

export const InputOTP: ComponentType<InputOTPProps>;
export const InputOTPGroup: ComponentType<{ className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>>;
export const InputOTPSlot: ComponentType<{ index: number; className?: string } & HTMLAttributes<HTMLInputElement>>;
export const InputOTPSeparator: ComponentType<{ className?: string } & HTMLAttributes<HTMLDivElement>>;

// Aspect Ratio Component
export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number;
  className?: string;
  children?: ReactNode;
}

export const AspectRatio: ComponentType<AspectRatioProps>;
