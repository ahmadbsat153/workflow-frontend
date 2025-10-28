import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";

type AnalyticsCard = {
  count?: number;
  title?: string;
};
const FormAnalyticsCard = ({ count, title }: AnalyticsCard) => {
  return (
    <Card className="bg-cultured">
      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{count}</CardDescription>
      </CardContent>
    </Card>
  );
};
export default FormAnalyticsCard;
