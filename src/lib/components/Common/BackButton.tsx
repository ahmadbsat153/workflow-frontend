import { Button } from "@/lib/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  handleGoBack?: () => void;
  text?: string;
  hideIcon?: boolean;
  fallbackUrl?: string;
};

const BackButton = ({
  handleGoBack: customHandleGoBack,
  text = "Back",
  hideIcon = false,
  fallbackUrl = "/",
}: BackButtonProps) => {
  const router = useRouter();

  const handleGoBack = () => {
    if (customHandleGoBack) {
      customHandleGoBack();
    } else {
      // Check if user came from within the app (has internal referrer)
      const isInternalReferrer =
        document.referrer && document.referrer.includes(window.location.origin);

      if (isInternalReferrer) {
        router.back();
      } else {
        router.push(fallbackUrl);
      }
    }
  };

  return (
    <Button
      onClick={handleGoBack}
      type="button"
      variant="secondary"
    >
      {!hideIcon && <ChevronLeftIcon />}
      {text}
    </Button>
  );
};

export default BackButton;
