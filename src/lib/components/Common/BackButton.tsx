import { Button } from "@/lib/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  handleGoBack?: () => void;
  text?: string;
};
const BackButton = ({
  handleGoBack: customHandleGoBack,
  text = "Back",
}: BackButtonProps) => {
  const router = useRouter();
  const handleGoBack = () => {
    if (customHandleGoBack) {
      customHandleGoBack();
    } else {
      router.back();
    }
  };

  return (
    <Button
      onClick={handleGoBack}
      // className="bg-gray-50 text-default hover:bg-gray-300"
      variant="secondary"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {text}
    </Button>
  );
};

export default BackButton;
