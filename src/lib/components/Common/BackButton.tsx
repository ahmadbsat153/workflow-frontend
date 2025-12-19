import { Button } from "@/lib/ui/button";
import { MoveLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  return (
    <Button
      onClick={handleGoBack}
      className="bg-gray-50 text-default hover:bg-primary/20"
      variant="outline"
    >
      <MoveLeftIcon className="size-4" />
      Back
    </Button>
  );
};

export default BackButton;