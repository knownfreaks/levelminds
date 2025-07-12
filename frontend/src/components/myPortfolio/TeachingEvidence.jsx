import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const TeachingEvidenceCard = ({ item, btnText }) => {
  return (
    <Card className="border w-full">
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h1 className="nunito-text text-[#191A1C]">{item.title}</h1>
            <p className="text-[12px]">{item.description}</p>
            <div className="flex gap-5">
              <p className="font-sans text-[#141414B2] text-xs">
                Type: {item.type}
              </p>
              <p className="text-xs text-[#141414B2]">Year: {item.year}</p>
            </div>
          </div>
          <div className="items-end">
            <Button variant="outline">{btnText}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default TeachingEvidenceCard;
