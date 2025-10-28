import { z } from "zod";
import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";

export const formInformationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type FormInformationData = z.infer<typeof formInformationSchema>;

type FormInformationProps = {
  formInfo: FormInformationData;
  setFormInfo: React.Dispatch<React.SetStateAction<FormInformationData>>;
  errors?: Partial<Record<keyof FormInformationData, string>>;
}

const FormInformation = ({
  formInfo,
  setFormInfo,
  errors,
}: FormInformationProps) => {
  return (
    <div className="space-y-5">
      <Input
        variant="outline"
        label="Form Title"
        labelPlacement="outside"
        placeholder="Insert the Form Title"
        value={formInfo.title}
        onChange={(e) =>
          setFormInfo((prev) => ({ ...prev, title: e.target.value }))
        }
        errorMessage={errors?.title}
      />
      <Textarea
        size="lg"
        resize="none"
        variant="outline"
        label="Form Description"
        labelPlacement="outside"
        placeholder="Insert Description"
        value={formInfo.description || ""}
        onChange={(e) =>
          setFormInfo((prev) => ({ ...prev, description: e.target.value }))
        }
        errorMessage={errors?.description}
      />
    </div>
  );
};

export default FormInformation;
