import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusEnum } from "@/types/vehicle.type";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const vehicleFormSchema = z.object({
  name: z.string().min(2, {
    message: "Vehicle name must be at least 2 characters.",
  }),
  plateNumber: z
    .string()
    .min(1, {
      message: "Plate number is required.",
    })
    .regex(/^[A-Z0-9 ]+$/, {
      message:
        "Plate number must contain only uppercase letters, numbers and spaces.",
    }),
  status: z.nativeEnum(StatusEnum, {
    required_error: "Please select a status.",
  }),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormValues>;
  onSubmit: (data: VehicleFormValues) => Promise<void> | void;
  isLoading?: boolean;
  className?: string;
}

export function UpdateVehicleForm({
  defaultValues = {
    name: "",
    plateNumber: "",
    status: StatusEnum.Available,
  },
  onSubmit,
  isLoading = false,
  className,
}: VehicleFormProps) {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: VehicleFormValues) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-6", className)}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Vehicle Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter vehicle name"
                    {...field}
                    className="h-11"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  Enter a descriptive name for the vehicle
                </FormDescription>
                <FormMessage className="text-sm font-medium text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Plate Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter plate number"
                    {...field}
                    className="h-11 uppercase"
                    disabled={isLoading}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  Enter the official vehicle plate number
                </FormDescription>
                <FormMessage className="text-sm font-medium text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Status
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select vehicle status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(StatusEnum).map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="h-11 flex items-center"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              status === StatusEnum.Available && "bg-green-500",
                              status === StatusEnum.InActive && "bg-yellow-500",
                              status === StatusEnum.Pending && "bg-blue-500",
                              status === StatusEnum.Sold && "bg-gray-500"
                            )}
                          />
                          {status}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-sm text-gray-500">
                  Select the current operational status
                </FormDescription>
                <FormMessage className="text-sm font-medium text-red-500" />
              </FormItem>
            )}
          />
        </motion.div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px] h-11"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Vehicle"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
