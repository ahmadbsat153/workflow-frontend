import { z } from "zod";
import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";
import { Card, CardContent } from "@/lib/ui/card";

export const formInformationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type FormInformationData = z.infer<typeof formInformationSchema>;

interface FormInformationProps {
  formInfo: FormInformationData;
  setFormInfo: React.Dispatch<React.SetStateAction<FormInformationData>>;
  errors?: Partial<Record<keyof FormInformationData, string>>;
}

const FormInformation = ({ formInfo, setFormInfo, errors }: FormInformationProps) => {
  return (
    <div className="py-5">
      <div className="space-y-5 w-full">
        <Card>
          <CardContent className="space-y-5">
            <Input
              variant="outline"
              label="Form Title"
              labelPlacement="outside"
              placeholder="Insert the Form Title"
              value={formInfo.title}
              onChange={(e) => setFormInfo(prev => ({ ...prev, title: e.target.value }))}
              errorMessage={errors?.title}
            />
            <Textarea
              resize="none"
              variant="outline"
              label="Form Description"
              labelPlacement="outside"
              placeholder="Insert Description"
              value={formInfo.description || ""}
              onChange={(e) => setFormInfo(prev => ({ ...prev, description: e.target.value }))}
              errorMessage={errors?.description}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormInformation;